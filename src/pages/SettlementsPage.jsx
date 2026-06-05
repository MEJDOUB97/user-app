import React from 'react';
import { useOutletContext } from 'react-router-dom';
import Card from '../components/Card';
import SettlementCard from '../components/SettlementCard';

function SettlementsPage() {
  const { data, allSuggestedSettlements, markSettlementSettled } = useOutletContext();

  return (
    <div className="app-page">
      <div className="page-header-row">
        <div>
          <span className="chip">Suggested payments</span>
          <h1>Settlements</h1>
          <p>Minimized transfers so groups can settle faster with fewer steps.</p>
        </div>
      </div>

      <div className="content-stack">
        {allSuggestedSettlements.length ? (
          allSuggestedSettlements.map(({ group, ...settlement }) => (
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
            <h3>All clear</h3>
            <p>There are no pending settlement suggestions right now.</p>
          </Card>
        )}
      </div>
    </div>
  );
}

export default SettlementsPage;
