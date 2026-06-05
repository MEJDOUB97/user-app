import React from 'react';
import { Link } from 'react-router-dom';
import Card from './Card';
import Avatar from './Avatar';
import { formatCurrency } from '../utils/currency';
import { formatRelativeDate } from '../utils/dates';

function GroupCard({ group, users }) {
  const members = group.members
    .map((memberId) => users.find((user) => user.id === memberId))
    .filter(Boolean);

  return (
    <Link to={`/app/groups/${group.id}`}>
      <Card className="group-card">
        <div className="group-card-top">
          <div className="group-icon">{group.config.emoji}</div>
          <div>
            <h3>{group.name}</h3>
            <p>{group.config.label}</p>
          </div>
          <span className={group.yourBalance >= 0 ? 'badge-positive' : 'badge-negative'}>
            {group.yourBalance >= 0 ? 'You are owed' : 'You owe'}
          </span>
        </div>
        <div className="group-metrics">
          <div>
            <span>Total spent</span>
            <strong>{formatCurrency(group.totalSpent)}</strong>
          </div>
          <div>
            <span>Your balance</span>
            <strong>{formatCurrency(group.yourBalance)}</strong>
          </div>
          <div>
            <span>Last activity</span>
            <strong>{formatRelativeDate(group.lastActivityDate)}</strong>
          </div>
        </div>
        <div className="group-members">
          <div className="avatar-stack">
            {members.slice(0, 4).map((member) => (
              <Avatar key={member.id} name={member.name} size="sm" />
            ))}
          </div>
          <small>{members.length} members</small>
        </div>
      </Card>
    </Link>
  );
}

export default GroupCard;
