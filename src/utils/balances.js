import { roundAmount } from './currency';

export const groupTypeConfig = {
  travel: { label: 'Trip', emoji: '✈️' },
  rent: { label: 'Rent', emoji: '🏠' },
  dinner: { label: 'Dinner', emoji: '🍴' },
  coffee: { label: 'Coffee', emoji: '☕' },
  event: { label: 'Event', emoji: '🎉' },
  taxi: { label: 'Taxi', emoji: '🚕' },
  shopping: { label: 'Shopping', emoji: '🛍️' },
  other: { label: 'Other', emoji: '💰' },
};

function createBalanceEntry() {
  return {
    paid: 0,
    owed: 0,
    net: 0,
  };
}

function normalizeBalances(balanceMap) {
  return Object.fromEntries(
    Object.entries(balanceMap).map(([userId, value]) => [
      userId,
      {
        paid: roundAmount(value.paid),
        owed: roundAmount(value.owed),
        net: roundAmount(value.paid - value.owed),
      },
    ]),
  );
}

export function calculateGroupBalances(groupId, data) {
  const group = data.groups.find((item) => item.id === groupId);
  if (!group) {
    return {};
  }

  const balances = group.members.reduce((accumulator, userId) => {
    accumulator[userId] = createBalanceEntry();
    return accumulator;
  }, {});

  data.expenses
    .filter((expense) => expense.groupId === groupId)
    .forEach((expense) => {
      if (!balances[expense.paidBy]) {
        balances[expense.paidBy] = createBalanceEntry();
      }

      balances[expense.paidBy].paid += Number(expense.amount) || 0;

      const participants = expense.participants || [];
      if (!participants.length) {
        return;
      }

      if (expense.splitType === 'custom') {
        participants.forEach((participantId) => {
          if (!balances[participantId]) {
            balances[participantId] = createBalanceEntry();
          }

          balances[participantId].owed += Number(expense.customSplits?.[participantId] || 0);
        });
        return;
      }

      const share = (Number(expense.amount) || 0) / participants.length;
      participants.forEach((participantId) => {
        if (!balances[participantId]) {
          balances[participantId] = createBalanceEntry();
        }

        balances[participantId].owed += share;
      });
    });

  data.settlements
    .filter((settlement) => settlement.groupId === groupId && settlement.status === 'settled')
    .forEach((settlement) => {
      if (!balances[settlement.fromUserId]) {
        balances[settlement.fromUserId] = createBalanceEntry();
      }

      if (!balances[settlement.toUserId]) {
        balances[settlement.toUserId] = createBalanceEntry();
      }

      balances[settlement.fromUserId].paid += Number(settlement.amount) || 0;
      balances[settlement.toUserId].owed += Number(settlement.amount) || 0;
    });

  return normalizeBalances(balances);
}

export function calculateUserGlobalBalance(userId, data) {
  const balancesByGroup = data.groups.reduce((accumulator, group) => {
    const groupBalances = calculateGroupBalances(group.id, data);
    const userBalance = groupBalances[userId];

    if (userBalance) {
      accumulator.paid += userBalance.paid;
      accumulator.owed += userBalance.owed;
      accumulator.net += userBalance.net;
    }

    return accumulator;
  }, createBalanceEntry());

  return {
    paid: roundAmount(balancesByGroup.paid),
    owed: roundAmount(balancesByGroup.owed),
    net: roundAmount(balancesByGroup.net),
  };
}

export function generateSuggestedSettlements(groupId, data) {
  const balances = calculateGroupBalances(groupId, data);
  const creditors = [];
  const debtors = [];

  Object.entries(balances).forEach(([userId, balance]) => {
    if (balance.net > 0.009) {
      creditors.push({ userId, amount: balance.net });
    }

    if (balance.net < -0.009) {
      debtors.push({ userId, amount: Math.abs(balance.net) });
    }
  });

  creditors.sort((left, right) => right.amount - left.amount);
  debtors.sort((left, right) => right.amount - left.amount);

  const suggestions = [];
  let debtorIndex = 0;
  let creditorIndex = 0;

  while (debtorIndex < debtors.length && creditorIndex < creditors.length) {
    const debtor = debtors[debtorIndex];
    const creditor = creditors[creditorIndex];
    const amount = roundAmount(Math.min(debtor.amount, creditor.amount));

    if (amount > 0) {
      suggestions.push({
        id: `suggested-${groupId}-${debtor.userId}-${creditor.userId}-${suggestions.length}`,
        groupId,
        fromUserId: debtor.userId,
        toUserId: creditor.userId,
        amount,
        status: 'pending',
      });
    }

    debtor.amount = roundAmount(debtor.amount - amount);
    creditor.amount = roundAmount(creditor.amount - amount);

    if (debtor.amount <= 0.009) {
      debtorIndex += 1;
    }

    if (creditor.amount <= 0.009) {
      creditorIndex += 1;
    }
  }

  return suggestions;
}
