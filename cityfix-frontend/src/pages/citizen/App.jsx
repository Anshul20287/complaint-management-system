import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/citizen/Sidebar';
import ReportForm from '../../components/citizen/ReportForm';
import RecentIssues from '../../components/citizen/RecentIssues';
import StatsBar from '../../components/citizen/StatsBar';
import MyIssues from '../../components/citizen/MyIssues';
import MapView from '../../components/citizen/MapView';
import Alerts from '../../components/citizen/Alerts';
import Profile from '../../components/citizen/Profile';
import { useAuth } from '../../context/AuthContext';
import { getCitizenDashboard } from '../../services/dashboardService';

const Dashboard = () => {
  const { user } = useAuth();
  const [activeNav, setActiveNav] = useState('report');
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboard = async () => {
    if (user?.role !== 'citizen') return;
    try {
      setLoading(true);
      const res = await getCitizenDashboard();
      setDashboardData(res.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to load citizen dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, [user]);

  const refreshDashboard = () => {
    fetchDashboard();
  };

  const renderContent = () => {
    switch (activeNav) {
      case 'report':
        return (
          <>
            <StatsBar stats={dashboardData?.stats} onRefresh={refreshDashboard} />
            <ReportForm />
            <RecentIssues issues={dashboardData?.myRecentIssues || []} />
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
            <StatsBar stats={dashboardData?.stats} onRefresh={refreshDashboard} />
            <ReportForm />
            <RecentIssues issues={dashboardData?.myRecentIssues || []} />
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
        {loading ? (
          <div className="rounded-2xl border border-cyan-400/10 bg-[#09111f]/70 p-10 text-center text-cyan-200">
            Loading citizen dashboard...
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-500/20 bg-[#2d0f16]/70 p-10 text-center text-red-300">
            {error}
          </div>
        ) : (
          renderContent()
        )}
      </main>
    </div>
  );
};

export default Dashboard;