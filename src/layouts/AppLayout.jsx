import React from 'react';
import { Outlet } from 'react-router-dom';
import BottomNav from '../components/BottomNav';
import Sidebar from '../components/Sidebar';

function AppLayout({ hssabna }) {
  return (
    <div className="app-layout">
      <Sidebar currentUser={hssabna.currentUser} onReset={hssabna.resetDemoData} />
      <div className="app-layout-content">
        <Outlet context={hssabna} />
      </div>
      <BottomNav />
    </div>
  );
}

export default AppLayout;
