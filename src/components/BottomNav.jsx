import React from 'react';
import { Activity, CirclePlus, Home, LayoutGrid, UserCircle2 } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const items = [
  { to: '/app', label: 'Home', icon: Home },
  { to: '/app/groups', label: 'Groups', icon: LayoutGrid },
  { to: '/app/add-expense', label: 'Add', icon: CirclePlus },
  { to: '/app/activity', label: 'Activity', icon: Activity },
  { to: '/app/members', label: 'Profile', icon: UserCircle2 },
];

function BottomNav() {
  const location = useLocation();

  return (
    <nav className="bottom-nav">
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
    </nav>
  );
}

export default BottomNav;
