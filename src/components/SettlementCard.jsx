import React from 'react';
import Card from './Card';
import Button from './Button';
import { formatCurrency } from '../utils/currency';
import { formatRelativeDate } from '../utils/dates';

function SettlementCard({ settlement, fromUser, toUser, groupName, onSettle, settled }) {
  return (
    <Card className="settlement-card">
      <div>
        <h4>
          {fromUser?.name || 'Member'} pays {toUser?.name || 'Member'}
        </h4>
        <p>
          {groupName} - {formatRelativeDate(settlement.createdAt)}
        </p>
      </div>
      <strong>{formatCurrency(settlement.amount)}</strong>
      {settled ? (
        <span className="badge-positive">Settled</span>
      ) : (
        <Button variant="secondary" size="sm" onClick={() => onSettle(settlement)}>
          Mark as settled
        </Button>
      )}
    </Card>
  );
}

export default SettlementCard;
