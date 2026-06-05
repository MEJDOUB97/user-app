import React, { useMemo, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import Button from '../components/Button';
import GroupCard from '../components/GroupCard';
import Modal from '../components/Modal';

const groupTypes = ['travel', 'rent', 'dinner', 'coffee', 'event', 'other'];

function GroupsPage() {
  const { data, groupSummaries, createGroup, currentUser } = useOutletContext();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: '',
    type: 'travel',
    memberIds: [],
  });

  const selectableMembers = useMemo(
    () => data.users.filter((user) => user.id !== currentUser?.id),
    [currentUser?.id, data.users],
  );

  function toggleMember(memberId) {
    setForm((previous) => ({
      ...previous,
      memberIds: previous.memberIds.includes(memberId)
        ? previous.memberIds.filter((item) => item !== memberId)
        : [...previous.memberIds, memberId],
    }));
  }

  function handleCreateGroup(event) {
    event.preventDefault();
    const created = createGroup(form);
    if (created) {
      setOpen(false);
      setForm({ name: '', type: 'travel', memberIds: [] });
    }
  }

  return (
    <div className="app-page">
      <div className="page-header-row">
        <div>
          <span className="chip">Your circles</span>
          <h1>Groups</h1>
          <p>Trips, rent, dinners, office coffee, and everything in between.</p>
        </div>
        <Button onClick={() => setOpen(true)}>Create group</Button>
      </div>

      <div className="group-grid">
        {groupSummaries.map((group) => (
          <GroupCard key={group.id} group={group} users={data.users} />
        ))}
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title="Create a new group">
        <form className="form-grid" onSubmit={handleCreateGroup}>
          <label>
            Group name
            <input
              value={form.name}
              onChange={(event) => setForm((previous) => ({ ...previous, name: event.target.value }))}
              placeholder="Weekend in Rabat"
              required
            />
          </label>
          <label>
            Group type
            <select
              value={form.type}
              onChange={(event) => setForm((previous) => ({ ...previous, type: event.target.value }))}
            >
              {groupTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </label>
          <div className="selector-group">
            <span>Add members</span>
            <div className="chip-selector">
              {selectableMembers.map((member) => (
                <button
                  type="button"
                  key={member.id}
                  className={form.memberIds.includes(member.id) ? 'selected' : ''}
                  onClick={() => toggleMember(member.id)}
                >
                  {member.name}
                </button>
              ))}
            </div>
          </div>
          <Button type="submit" fullWidth>
            Save group
          </Button>
        </form>
      </Modal>
    </div>
  );
}

export default GroupsPage;
