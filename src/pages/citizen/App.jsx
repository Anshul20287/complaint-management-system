import React, { useState } from 'react';
import Sidebar from '../../components/citizen/Sidebar';
import ReportForm from '../../components/citizen/ReportForm';
import RecentIssues from '../../components/citizen/RecentIssues';
import StatsBar from '../../components/citizen/StatsBar';
import MyIssues from '../../components/citizen/MyIssues';
import MapView from '../../components/citizen/MapView';
import Alerts from '../../components/citizen/Alerts';
import Profile from '../../components/citizen/Profile';

const Dashboard = () => {
  const [activeNav, setActiveNav] = useState('report');

  const renderContent = () => {
    switch (activeNav) {
      case 'report':
        return (
          <>
            <StatsBar />
            <ReportForm />
            <RecentIssues />
          </>
        );
      case 'issues':
        return <MyIssues />;
      case 'map':
        return <MapView />;
      case 'alerts':
        return <Alerts />;
      case 'profile':
        return <Profile />;
      default:
        return (
          <>
            <StatsBar />
            <ReportForm />
            <RecentIssues />
          </>
        );
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