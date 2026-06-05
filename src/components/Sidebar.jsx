import React from 'react';
import {
  Activity,
  CirclePlus,
  HandCoins,
  Home,
  LayoutGrid,
  Users,
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import Logo from './Logo';
import Button from './Button';

const items = [
  { to: '/app', label: 'Dashboard', icon: Home },
  { to: '/app/groups', label: 'Groups', icon: LayoutGrid },
  { to: '/app/add-expense', label: 'Add expense', icon: CirclePlus },
  { to: '/app/settlements', label: 'Settlements', icon: HandCoins },
  { to: '/app/activity', label: 'Activity', icon: Activity },
  { to: '/app/members', label: 'Members', icon: Users },
];

function Sidebar({ currentUser, onReset }) {
  const location = useLocation();

  return (
    <aside className="sidebar">
      <Logo />
      <div className="sidebar-links">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.to === '/app' ? location.pathname === '/app' : location.pathname.startsWith(item.to);

          return (
            <Link key={item.to} to={item.to} className={isActive ? 'active' : ''}>
              <Icon size={18} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
      <div className="sidebar-profile">
        <div>
          <strong>{currentUser?.name || 'Guest'}</strong>
          <p>{currentUser?.emailOrPhone || 'Welcome to Hssabna'}</p>
        </div>
        <Button variant="ghost" size="sm" onClick={onReset}>
          Reset demo data
        </Button>
      </div>
    </aside>
  );
}

export default Sidebar;
