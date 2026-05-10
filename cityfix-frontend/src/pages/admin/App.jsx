import React, { useState } from 'react';
import Sidebar from '../../components/admin/Sidebar';
import StatsBar from '../../components/admin/StatsBar';
import StaffOverview from '../../components/admin/StaffOverview';
import RecentIssues from '../../components/admin/RecentIssues';
import CategoryChart from '../../components/admin/CategoryChart';
import Alerts from '../../components/admin/Alerts';
import AllIssues from '../../components/admin/AllIssues';
import Citizens from '../../components/admin/Citizens';
import Staff from '../../components/admin/Staff';
import MapView from '../../components/admin/MapView';
import Announcements from '../../components/admin/Announcements';
import Settings from '../../components/admin/Settings';

const Dashboard = () => {
  const [activeNav, setActiveNav] = useState('dashboard');

  const renderContent = () => {
    switch (activeNav) {
      case 'dashboard':
        return (
          <>
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-base font-semibold text-[#e6f1ff]">
                Admin Dashboard
              </h1>

              <span className="bg-[#041424] border border-cyan-400/10 rounded-full px-4 py-2 text-xs text-[#7c8aa5]">
                Mumbai Municipal Corp.
              </span>
            </div>

            <StatsBar />

            <div className="grid grid-cols-2 gap-6 mb-6">
              <RecentIssues />
              <CategoryChart />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <StaffOverview />
              <Alerts />
            </div>
          </>
        );

      case 'issues':
        return <AllIssues />;

      case 'citizens':
        return <Citizens />;

      case 'staff':
        return <Staff />;

      case 'map':
        return <MapView />;

      case 'announcements':
        return <Announcements />;

      case 'settings':
        return <Settings />;

      default:
        return null;
    }
  };

  return (
    <div
      className="min-h-screen bg-[#030712] text-white"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      <Sidebar activeNav={activeNav} setActiveNav={setActiveNav} />

      <main className="ml-[220px] min-h-screen p-8 bg-[radial-gradient(circle_at_top,_rgba(25,230,210,0.08),_transparent_35%),linear-gradient(to_bottom,_#030712,_#020617)]">
        {renderContent()}
      </main>
    </div>
  );
};

export default Dashboard;