import React from 'react';
import Card from './Card';
import { formatCurrency } from '../utils/currency';

function BalanceCard({ label, amount, tone = 'neutral', hint, formatAsCurrency = true }) {
  return (
    <Card className={`balance-card balance-${tone}`}>
      <span>{label}</span>
      <strong>{formatAsCurrency ? formatCurrency(amount) : amount}</strong>
      {hint ? <small>{hint}</small> : null}
    </Card>
  );
}

export default BalanceCard;
