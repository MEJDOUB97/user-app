import React from 'react';
import Card from './Card';
import Avatar from './Avatar';
import { formatCurrency } from '../utils/currency';
import { formatDate } from '../utils/dates';
import { groupTypeConfig } from '../utils/balances';

function ExpenseCard({ expense, payer }) {
  const category = groupTypeConfig[expense.category] ?? groupTypeConfig.other;

  return (
    <Card className="expense-card">
      <div className="expense-icon">{category.emoji}</div>
      <div className="expense-content">
        <div className="expense-row">
          <h4>{expense.title}</h4>
          <strong>{formatCurrency(expense.amount)}</strong>
        </div>
        <div className="expense-row expense-meta">
          <span>Paid by {payer?.name || 'Unknown'}</span>
          <span>{formatDate(expense.date)}</span>
        </div>
      </div>
      <Avatar name={payer?.name || 'U'} size="sm" />
    </Card>
  );
}

export default ExpenseCard;
