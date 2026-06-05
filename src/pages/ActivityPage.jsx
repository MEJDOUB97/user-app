import React from 'react';
import { CheckCircle2, PlusCircle, ReceiptText, UsersRound } from 'lucide-react';
import { useOutletContext } from 'react-router-dom';
import Card from '../components/Card';
import { formatCurrency } from '../utils/currency';
import { formatDate } from '../utils/dates';

const activityConfig = {
  expense_added: { icon: ReceiptText, label: 'Expense added' },
  member_joined: { icon: UsersRound, label: 'Member joined' },
  settlement_completed: { icon: CheckCircle2, label: 'Settlement completed' },
  group_created: { icon: PlusCircle, label: 'Group created' },
};

function ActivityPage() {
  const { data } = useOutletContext();
  const activity = [...data.activity].sort((left, right) => new Date(right.createdAt) - new Date(left.createdAt));

  return (
    <div className="app-page">
      <div className="page-header-row">
        <div>
          <span className="chip">Recent timeline</span>
          <h1>Activity</h1>
          <p>Expenses added, members joined, settlements completed, and new groups created.</p>
        </div>
      </div>

      <div className="timeline">
        {activity.map((item) => {
          const config = activityConfig[item.type] ?? activityConfig.group_created;
          const Icon = config.icon;
          const group = data.groups.find((entry) => entry.id === item.groupId);

          return (
            <Card key={item.id} className="timeline-item">
              <span className="timeline-icon">
                <Icon size={18} />
              </span>
              <div>
                <h3>{item.title}</h3>
                <p>
                  {config.label} - {group?.name || 'No group'} - {formatDate(item.createdAt)}
                </p>
              </div>
              {typeof item.amount === 'number' ? <strong>{formatCurrency(item.amount)}</strong> : null}
            </Card>
          );
        })}
      </div>
    </div>
  );
}

export default ActivityPage;
