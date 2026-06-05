import React from 'react';
import { useOutletContext } from 'react-router-dom';
import Card from '../components/Card';
import MemberBalanceCard from '../components/MemberBalanceCard';
import Button from '../components/Button';

function MembersPage() {
  const { membersSummary, currentUser, resetDemoData } = useOutletContext();

  return (
    <div className="app-page">
      <div className="page-header-row">
        <div>
          <span className="chip">People & profile</span>
          <h1>Members</h1>
          <p>See who paid, who owes, and reset the demo when you want a clean slate.</p>
        </div>
      </div>

      <Card className="profile-banner">
        <div>
          <h3>{currentUser?.name || 'Current user'}</h3>
          <p>{currentUser?.emailOrPhone || 'No contact saved yet'}</p>
        </div>
        <Button variant="ghost" onClick={resetDemoData}>
          Reset demo data
        </Button>
      </Card>

      <div className="member-grid">
        {membersSummary.map((member) => (
          <MemberBalanceCard key={member.id} member={member} />
        ))}
      </div>
    </div>
  );
}

export default MembersPage;
