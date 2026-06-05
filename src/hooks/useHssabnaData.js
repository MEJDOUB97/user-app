import { useMemo } from 'react';
import { seedData } from '../data/seedData';
import { useLocalStorage } from './useLocalStorage';
import {
  calculateGroupBalances,
  calculateUserGlobalBalance,
  generateSuggestedSettlements,
  groupTypeConfig,
} from '../utils/balances';

const STORAGE_KEY = 'hssabna-demo-data';

function createId(prefix) {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

function nowIso() {
  return new Date().toISOString();
}

function sanitizeAmount(value) {
  const parsed = Number(value);
  if (Number.isNaN(parsed)) {
    return 0;
  }

  return Math.round((parsed + Number.EPSILON) * 100) / 100;
}

export function useHssabnaData() {
  const [data, setData] = useLocalStorage(STORAGE_KEY, seedData);

  const currentUser = useMemo(
    () => data.users.find((user) => user.id === data.currentUserId) ?? data.users[0] ?? null,
    [data.currentUserId, data.users],
  );

  const groupSummaries = useMemo(
    () =>
      data.groups.map((group) => {
        const groupExpenses = data.expenses.filter((expense) => expense.groupId === group.id);
        const balances = calculateGroupBalances(group.id, data);
        const totalSpent = groupExpenses.reduce((sum, expense) => sum + Number(expense.amount || 0), 0);
        const lastActivityDate = [
          group.createdAt,
          ...groupExpenses.map((expense) => expense.createdAt),
          ...data.settlements
            .filter((settlement) => settlement.groupId === group.id)
            .map((settlement) => settlement.settledAt || settlement.createdAt),
        ]
          .filter(Boolean)
          .sort()
          .at(-1);

        return {
          ...group,
          totalSpent,
          yourBalance: balances[currentUser?.id]?.net ?? 0,
          balances,
          lastActivityDate,
          config: groupTypeConfig[group.type] ?? groupTypeConfig.other,
        };
      }),
    [currentUser?.id, data],
  );

  const allSuggestedSettlements = useMemo(
    () =>
      data.groups.flatMap((group) =>
        generateSuggestedSettlements(group.id, data).map((settlement) => ({
          ...settlement,
          group,
        })),
      ),
    [data],
  );

  const dashboardStats = useMemo(() => {
    if (!currentUser) {
      return {
        totalBalance: 0,
        owed: 0,
        owes: 0,
        activeGroups: 0,
      };
    }

    const globalBalance = calculateUserGlobalBalance(currentUser.id, data);

    return {
      totalBalance: globalBalance.net,
      owed: Math.max(globalBalance.net, 0),
      owes: Math.abs(Math.min(globalBalance.net, 0)),
      activeGroups: groupSummaries.length,
    };
  }, [currentUser, data, groupSummaries.length]);

  const recentExpenses = useMemo(
    () =>
      [...data.expenses]
        .sort((left, right) => new Date(right.createdAt) - new Date(left.createdAt))
        .slice(0, 5),
    [data.expenses],
  );

  const recentSettlements = useMemo(
    () =>
      [...data.settlements]
        .filter((settlement) => settlement.status === 'settled')
        .sort((left, right) => new Date(right.settledAt || right.createdAt) - new Date(left.settledAt || left.createdAt))
        .slice(0, 5),
    [data.settlements],
  );

  const membersSummary = useMemo(
    () =>
      data.users.map((user) => {
        const balance = calculateUserGlobalBalance(user.id, data);
        return {
          ...user,
          totalPaid: balance.paid,
          totalOwed: balance.owed,
          netBalance: balance.net,
        };
      }),
    [data],
  );

  function saveCurrentUser(profile) {
    const trimmedName = profile.name?.trim();
    const trimmedContact = profile.emailOrPhone?.trim();

    if (!trimmedName || !trimmedContact) {
      return null;
    }

    setData((previous) => {
      const existingUser = previous.users.find((user) => user.id === previous.currentUserId);
      if (existingUser) {
        return {
          ...previous,
          users: previous.users.map((user) =>
            user.id === previous.currentUserId
              ? {
                  ...user,
                  name: trimmedName,
                  emailOrPhone: trimmedContact,
                }
              : user,
          ),
        };
      }

      const createdUser = {
        id: createId('user'),
        name: trimmedName,
        emailOrPhone: trimmedContact,
        avatar: '',
      };

      return {
        ...previous,
        currentUserId: createdUser.id,
        users: [createdUser, ...previous.users],
      };
    });

    return true;
  }

  function createGroup(payload) {
    const name = payload.name?.trim();
    if (!name || !currentUser) {
      return null;
    }

    const members = Array.from(new Set([currentUser.id, ...(payload.memberIds || [])]));
    const newGroup = {
      id: createId('group'),
      name,
      type: payload.type || 'other',
      members,
      createdAt: nowIso(),
    };

    setData((previous) => ({
      ...previous,
      groups: [newGroup, ...previous.groups],
      activity: [
        {
          id: createId('activity'),
          type: 'group_created',
          title: `${name} created`,
          groupId: newGroup.id,
          amount: null,
          createdAt: nowIso(),
        },
        ...previous.activity,
      ],
    }));

    return newGroup;
  }

  function addMemberToGroup(groupId, memberId) {
    if (!groupId || !memberId) {
      return;
    }

    const member = data.users.find((user) => user.id === memberId);
    const group = data.groups.find((item) => item.id === groupId);
    if (!member || !group || group.members.includes(memberId)) {
      return;
    }

    setData((previous) => ({
      ...previous,
      groups: previous.groups.map((item) =>
        item.id === groupId ? { ...item, members: [...item.members, memberId] } : item,
      ),
      activity: [
        {
          id: createId('activity'),
          type: 'member_joined',
          title: `${member.name} joined ${group.name}`,
          groupId,
          amount: null,
          memberId,
          createdAt: nowIso(),
        },
        ...previous.activity,
      ],
    }));
  }

  function addExpense(payload) {
    const amount = sanitizeAmount(payload.amount);
    const participants = payload.participants?.length ? payload.participants : payload.groupMemberIds ?? [];

    if (!payload.groupId || !payload.title?.trim() || !payload.paidBy || amount <= 0 || !participants.length) {
      return null;
    }

    const customSplits =
      payload.splitType === 'custom'
        ? Object.fromEntries(
            participants.map((participantId) => [participantId, sanitizeAmount(payload.customSplits?.[participantId])]),
          )
        : {};

    const newExpense = {
      id: createId('expense'),
      groupId: payload.groupId,
      title: payload.title.trim(),
      amount,
      paidBy: payload.paidBy,
      participants,
      splitType: payload.splitType || 'equal',
      customSplits,
      category: payload.category || 'other',
      date: payload.date || new Date().toISOString().slice(0, 10),
      createdAt: nowIso(),
    };

    setData((previous) => ({
      ...previous,
      expenses: [newExpense, ...previous.expenses],
      activity: [
        {
          id: createId('activity'),
          type: 'expense_added',
          title: `${newExpense.title} added`,
          groupId: newExpense.groupId,
          amount: newExpense.amount,
          expenseId: newExpense.id,
          createdAt: newExpense.createdAt,
        },
        ...previous.activity,
      ],
    }));

    return newExpense;
  }

  function markSettlementSettled(payload) {
    const group = data.groups.find((item) => item.id === payload.groupId);
    if (!group) {
      return null;
    }

    const settlementId = payload.id?.startsWith('settlement-') ? payload.id : createId('settlement');
    const createdAt = payload.createdAt || nowIso();
    const settledAt = nowIso();

    const settlementRecord = {
      id: settlementId,
      groupId: payload.groupId,
      fromUserId: payload.fromUserId,
      toUserId: payload.toUserId,
      amount: sanitizeAmount(payload.amount),
      status: 'settled',
      createdAt,
      settledAt,
    };

    setData((previous) => {
      const existing = previous.settlements.find((item) => item.id === settlementId);
      const settlements = existing
        ? previous.settlements.map((item) => (item.id === settlementId ? settlementRecord : item))
        : [settlementRecord, ...previous.settlements];

      const fromUser = previous.users.find((user) => user.id === payload.fromUserId);
      const toUser = previous.users.find((user) => user.id === payload.toUserId);

      return {
        ...previous,
        settlements,
        activity: [
          {
            id: createId('activity'),
            type: 'settlement_completed',
            title: `${fromUser?.name || 'Member'} settled with ${toUser?.name || 'member'}`,
            groupId: payload.groupId,
            amount: settlementRecord.amount,
            settlementId,
            createdAt: settledAt,
          },
          ...previous.activity,
        ],
      };
    });

    return settlementRecord;
  }

  function resetDemoData() {
    setData(seedData);
  }

  return {
    data,
    currentUser,
    groupSummaries,
    allSuggestedSettlements,
    dashboardStats,
    recentExpenses,
    recentSettlements,
    membersSummary,
    saveCurrentUser,
    createGroup,
    addMemberToGroup,
    addExpense,
    markSettlementSettled,
    resetDemoData,
  };
}
