import React from 'react';
import Card from './Card';
import Avatar from './Avatar';
import { formatCurrency } from '../utils/currency';

function MemberBalanceCard({ member }) {
  const tone = member.netBalance > 0 ? 'positive' : member.netBalance < 0 ? 'negative' : 'neutral';

  return (
    <Card className="member-balance-card">
      <div className="member-balance-header">
        <Avatar name={member.name} />
        <div>
          <h4>{member.name}</h4>
          <p>{member.emailOrPhone}</p>
        </div>
      </div>
      <div className="member-balance-grid">
        <div>
          <span>Paid</span>
          <strong>{formatCurrency(member.totalPaid)}</strong>
        </div>
        <div>
          <span>Owed</span>
          <strong>{formatCurrency(member.totalOwed)}</strong>
        </div>
        <div>
          <span>Net</span>
          <strong className={`text-${tone}`}>{formatCurrency(member.netBalance)}</strong>
        </div>
      </div>
    </Card>
  );
}

export default MemberBalanceCard;
