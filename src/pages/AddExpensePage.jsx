import React, { useMemo, useState } from 'react';
import { useNavigate, useOutletContext, useSearchParams } from 'react-router-dom';
import Button from '../components/Button';
import Card from '../components/Card';
import { roundAmount } from '../utils/currency';

const categories = ['dinner', 'taxi', 'coffee', 'rent', 'travel', 'shopping', 'other'];

function AddExpensePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { data, addExpense } = useOutletContext();
  const [error, setError] = useState('');
  const defaultGroupId = searchParams.get('groupId') || data.groups[0]?.id || '';
  const defaultGroup = data.groups.find((group) => group.id === defaultGroupId) || data.groups[0];

  const [form, setForm] = useState({
    title: '',
    amount: '',
    paidBy: defaultGroup?.members[0] || '',
    groupId: defaultGroup?.id || '',
    date: new Date().toISOString().slice(0, 10),
    category: 'other',
    splitType: 'equal',
    participants: defaultGroup?.members || [],
    customSplits: {},
  });

  const selectedGroup = useMemo(
    () => data.groups.find((group) => group.id === form.groupId) || defaultGroup,
    [data.groups, defaultGroup, form.groupId],
  );

  const groupMembers = useMemo(
    () => data.users.filter((user) => selectedGroup?.members.includes(user.id)),
    [data.users, selectedGroup],
  );

  function toggleParticipant(userId) {
    setForm((previous) => {
      const nextParticipants = previous.participants.includes(userId)
        ? previous.participants.filter((item) => item !== userId)
        : [...previous.participants, userId];

      return {
        ...previous,
        participants: nextParticipants,
      };
    });
  }

  function handleGroupChange(groupId) {
    const group = data.groups.find((item) => item.id === groupId);
    setForm((previous) => ({
      ...previous,
      groupId,
      paidBy: group?.members[0] || '',
      participants: group?.members || [],
      customSplits: {},
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (form.splitType === 'custom') {
      const totalCustomSplit = roundAmount(
        form.participants.reduce(
          (sum, participantId) => sum + Number(form.customSplits[participantId] || 0),
          0,
        ),
      );

      if (totalCustomSplit !== roundAmount(form.amount)) {
        setError('Custom split shares need to add up exactly to the expense amount.');
        return;
      }
    }

    setError('');
    const created = addExpense({
      ...form,
      groupMemberIds: selectedGroup?.members || [],
    });

    if (created) {
      navigate(`/app/groups/${created.groupId}`);
    }
  }

  return (
    <div className="app-page">
      <div className="page-header-row">
        <div>
          <span className="chip">Add a new expense</span>
          <h1>Add expense</h1>
          <p>Track a payment, choose participants, and keep every amount in MAD.</p>
        </div>
      </div>

      <Card className="form-card">
        <form className="form-grid expense-form" onSubmit={handleSubmit}>
          <label>
            Expense title
            <input
              value={form.title}
              onChange={(event) => setForm((previous) => ({ ...previous, title: event.target.value }))}
              placeholder="Lunch in Casablanca"
              required
            />
          </label>
          <label>
            Amount (MAD)
            <input
              type="number"
              min="0"
              step="0.01"
              value={form.amount}
              onChange={(event) => setForm((previous) => ({ ...previous, amount: event.target.value }))}
              placeholder="0.00"
              required
            />
          </label>
          <label>
            Paid by
            <select
              value={form.paidBy}
              onChange={(event) => setForm((previous) => ({ ...previous, paidBy: event.target.value }))}
            >
              {groupMembers.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            Group
            <select value={form.groupId} onChange={(event) => handleGroupChange(event.target.value)}>
              {data.groups.map((group) => (
                <option key={group.id} value={group.id}>
                  {group.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            Date
            <input
              type="date"
              value={form.date}
              onChange={(event) => setForm((previous) => ({ ...previous, date: event.target.value }))}
            />
          </label>
          <label>
            Category
            <select
              value={form.category}
              onChange={(event) => setForm((previous) => ({ ...previous, category: event.target.value }))}
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </label>
          <label>
            Split type
            <select
              value={form.splitType}
              onChange={(event) => setForm((previous) => ({ ...previous, splitType: event.target.value }))}
            >
              <option value="equal">Equal split</option>
              <option value="custom">Custom split</option>
            </select>
          </label>
          <div className="selector-group">
            <span>Participants</span>
            <div className="chip-selector">
              {groupMembers.map((member) => (
                <button
                  type="button"
                  key={member.id}
                  className={form.participants.includes(member.id) ? 'selected' : ''}
                  onClick={() => toggleParticipant(member.id)}
                >
                  {member.name}
                </button>
              ))}
            </div>
          </div>

          {form.splitType === 'custom' ? (
            <div className="custom-split-grid">
              {groupMembers
                .filter((member) => form.participants.includes(member.id))
                .map((member) => (
                  <label key={member.id}>
                    {member.name}'s share
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={form.customSplits[member.id] || ''}
                      onChange={(event) =>
                        setForm((previous) => ({
                          ...previous,
                          customSplits: {
                            ...previous.customSplits,
                            [member.id]: event.target.value,
                          },
                        }))
                      }
                      placeholder="0.00"
                    />
                  </label>
                ))}
            </div>
          ) : null}

          {error ? <p className="form-error">{error}</p> : null}

          <div className="form-actions">
            <Button type="submit">Save expense</Button>
            <Button type="button" variant="ghost" onClick={() => navigate(-1)}>
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

export default AddExpensePage;
