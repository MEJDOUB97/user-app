import React from 'react';
import { HandCoins, Plus, Users } from 'lucide-react';
import { Link, useNavigate, useOutletContext } from 'react-router-dom';
import Button from '../components/Button';
import Card from '../components/Card';
import BalanceCard from '../components/BalanceCard';
import ExpenseCard from '../components/ExpenseCard';
import SettlementCard from '../components/SettlementCard';

function DashboardPage() {
  const navigate = useNavigate();
  const {
    currentUser,
    dashboardStats,
    recentExpenses,
    recentSettlements,
    data,
    markSettlementSettled,
  } = useOutletContext();

  const greetingHours = new Date().getHours();
  const greeting =
    greetingHours < 12 ? 'Good morning' : greetingHours < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="app-page">
      <section className="dashboard-hero app-card">
        <div>
          <span className="chip">Split expenses. Keep it simple.</span>
          <h1>
            {greeting}, {currentUser?.name || 'friend'}
          </h1>
          <p>No spreadsheets. No awkward conversations.</p>
        </div>
        <div className="quick-actions">
          <Button onClick={() => navigate('/app/add-expense')}>
            <Plus size={16} />
            Add expense
          </Button>
          <Link to="/app/groups">
            <Button variant="ghost">
              <Users size={16} />
              Create group
            </Button>
          </Link>
          <Link to="/app/settlements">
            <Button variant="secondary">
              <HandCoins size={16} />
              Settle up
            </Button>
          </Link>
        </div>
      </section>

      <section className="stats-grid">
        <BalanceCard label="Total balance" amount={dashboardStats.totalBalance} tone="neutral" />
        <BalanceCard label="You are owed" amount={dashboardStats.owed} tone="positive" />
        <BalanceCard label="You owe" amount={dashboardStats.owes} tone="negative" />
        <BalanceCard
          label="Active groups"
          amount={dashboardStats.activeGroups}
          hint="groups"
          tone="neutral"
          formatAsCurrency={false}
        />
      </section>

      <section className="two-column-grid">
        <div className="content-stack">
          <div className="section-title-row">
            <h2>Recent expenses</h2>
            <Link to="/app/add-expense">Add new</Link>
          </div>
          {recentExpenses.map((expense) => (
            <ExpenseCard
              key={expense.id}
              expense={expense}
              payer={data.users.find((user) => user.id === expense.paidBy)}
            />
          ))}
        </div>

        <div className="content-stack">
          <div className="section-title-row">
            <h2>Recent settlements</h2>
            <Link to="/app/settlements">View all</Link>
          </div>
          {recentSettlements.map((settlement) => {
            const group = data.groups.find((item) => item.id === settlement.groupId);
            return (
              <SettlementCard
                key={settlement.id}
                settlement={settlement}
                fromUser={data.users.find((user) => user.id === settlement.fromUserId)}
                toUser={data.users.find((user) => user.id === settlement.toUserId)}
                groupName={group?.name || 'Unknown group'}
                onSettle={markSettlementSettled}
                settled
              />
            );
          })}
          {!recentSettlements.length ? (
            <Card>
              <p>No completed settlements yet.</p>
            </Card>
          ) : null}
        </div>
      </section>
    </div>
  );
}

export default DashboardPage;
