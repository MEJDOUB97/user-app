import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import PublicLayout from '../layouts/PublicLayout';
import AppLayout from '../layouts/AppLayout';
import LandingPage from '../pages/LandingPage';
import WelcomePage from '../pages/WelcomePage';
import DashboardPage from '../pages/DashboardPage';
import GroupsPage from '../pages/GroupsPage';
import GroupDetailsPage from '../pages/GroupDetailsPage';
import AddExpensePage from '../pages/AddExpensePage';
import MembersPage from '../pages/MembersPage';
import SettlementsPage from '../pages/SettlementsPage';
import ActivityPage from '../pages/ActivityPage';
import { useHssabnaData } from '../hooks/useHssabnaData';

function AppRoutes() {
  const hssabna = useHssabnaData();

  return (
    <Routes>
      <Route element={<PublicLayout hssabna={hssabna} />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/welcome" element={<WelcomePage />} />
      </Route>

      <Route element={<AppLayout hssabna={hssabna} />}>
        <Route path="/app" element={<DashboardPage />} />
        <Route path="/app/groups" element={<GroupsPage />} />
        <Route path="/app/groups/:groupId" element={<GroupDetailsPage />} />
        <Route path="/app/add-expense" element={<AddExpensePage />} />
        <Route path="/app/members" element={<MembersPage />} />
        <Route path="/app/settlements" element={<SettlementsPage />} />
        <Route path="/app/activity" element={<ActivityPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default AppRoutes;
