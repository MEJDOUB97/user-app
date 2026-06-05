import React, { useMemo, useState } from 'react';
import { useNavigate, useOutletContext, useParams } from 'react-router-dom';
import Button from '../components/Button';
import Card from '../components/Card';
import ExpenseCard from '../components/ExpenseCard';
import Modal from '../components/Modal';
import Avatar from '../components/Avatar';
import SettlementCard from '../components/SettlementCard';
import { formatCurrency } from '../utils/currency';
import { calculateGroupBalances, generateSuggestedSettlements } from '../utils/balances';

function GroupDetailsPage() {
  const navigate = useNavigate();
  const { groupId } = useParams();
  const { data, addMemberToGroup, markSettlementSettled } = useOutletContext();
  const [open, setOpen] = useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState('');

  const group = data.groups.find((item) => item.id === groupId);
  const expenses = data.expenses.filter((item) => item.groupId === groupId);
  const members = data.users.filter((user) => group?.members.includes(user.id));
  const balances = useMemo(
    () => (group ? Object.entries(calculateGroupBalances(group.id, data)) : []),
    [group, data],
  );
  const suggestions = useMemo(
    () => (group ? generateSuggestedSettlements(group.id, data) : []),
    [group, data],
  );
  const availableMembers = data.users.filter((user) => !group?.members.includes(user.id));

  if (!group) {
    return (
      <div className="app-page">
        <Card>
          <h2>Group not found</h2>
          <p>The group you are looking for is not available in this demo.</p>
        </Card>
      </div>
    );
  }

  function handleAddMember(event) {
    event.preventDefault();
    if (!selectedMemberId) {
      return;
    }

    addMemberToGroup(group.id, selectedMemberId);
    setSelectedMemberId('');
    setOpen(false);
  }

  return (
    <div className="app-page">
      <Card className="group-detail-hero">
        <div>
          <span className="chip">{group.name}</span>
          <h1>{group.name}</h1>
          <p>
            {members.length} members -{' '}
            {formatCurrency(expenses.reduce((sum, expense) => sum + expense.amount, 0))} total spent
          </p>
        </div>
        <div className="quick-actions">
          <Button onClick={() => navigate(`/app/add-expense?groupId=${group.id}`)}>Add expense</Button>
          <Button variant="ghost" onClick={() => setOpen(true)}>
            Add member
          </Button>
          <Button variant="secondary" onClick={() => navigate('/app/settlements')}>
            Settle up
          </Button>
        </div>
      </Card>

      <section className="three-column-grid">
        <Card>
          <h3>Members</h3>
          <div className="detail-member-list">
            {members.map((member) => (
              <div key={member.id} className="member-inline">
                <Avatar name={member.name} size="sm" />
                <span>{member.name}</span>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <h3>Balance summary</h3>
          <div className="summary-metric">
            <span>Expenses</span>
            <strong>{expenses.length}</strong>
          </div>
          <div className="summary-metric">
            <span>Suggested settlements</span>
            <strong>{suggestions.length}</strong>
          </div>
        </Card>
        <Card>
          <h3>Members balances</h3>
          <div className="mini-balance-list">
            {balances.map(([userId, balance]) => {
              const user = data.users.find((member) => member.id === userId);
              return (
                <div key={userId} className="mini-balance-row">
                  <span>{user?.name || 'Unknown'}</span>
                  <strong className={balance.net >= 0 ? 'text-positive' : 'text-negative'}>
                    {formatCurrency(balance.net)}
                  </strong>
                </div>
              );
            })}
          </div>
        </Card>
      </section>

      <section className="two-column-grid">
        <div className="content-stack">
          <div className="section-title-row">
            <h2>Expenses</h2>
            <Button variant="ghost" size="sm" onClick={() => navigate(`/app/add-expense?groupId=${group.id}`)}>
              Add expense
            </Button>
          </div>
          {expenses.map((expense) => (
            <ExpenseCard
              key={expense.id}
              expense={expense}
              payer={data.users.find((user) => user.id === expense.paidBy)}
            />
          ))}
        </div>

        <div className="content-stack">
          <div className="section-title-row">
            <h2>Suggested settlements</h2>
          </div>
          {suggestions.length ? (
            suggestions.map((settlement) => (
              <SettlementCard
                key={settlement.id}
                settlement={settlement}
                fromUser={data.users.find((user) => user.id === settlement.fromUserId)}
                toUser={data.users.find((user) => user.id === settlement.toUserId)}
                groupName={group.name}
                onSettle={markSettlementSettled}
              />
            ))
          ) : (
            <Card>
              <p>Everyone is balanced here. No transfers needed.</p>
            </Card>
          )}
        </div>
      </section>

      <Modal open={open} onClose={() => setOpen(false)} title="Add member">
        {availableMembers.length ? (
          <form className="form-grid" onSubmit={handleAddMember}>
            <label>
              Select a member
              <select value={selectedMemberId} onChange={(event) => setSelectedMemberId(event.target.value)}>
                <option value="">Choose someone</option>
                {availableMembers.map((member) => (
                  <option key={member.id} value={member.id}>
                    {member.name}
                  </option>
                ))}
              </select>
            </label>
            <Button type="submit" fullWidth>
              Add to group
            </Button>
          </form>
        ) : (
          <p>All available demo members are already in this group.</p>
        )}
      </Modal>
    </div>
  );
}

export default GroupDetailsPage;
