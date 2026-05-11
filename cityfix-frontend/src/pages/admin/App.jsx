import React, { useEffect, useState } from 'react';
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
import { getAdminDashboard } from "../../services/dashboardService";

const Dashboard = () => {
  const [activeNav, setActiveNav] = useState('dashboard');

  // CHANGED: state added for backend dashboard data
  const [dashboardData, setDashboardData] = useState(null);

  // CHANGED: loading and error states added
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // CHANGED: API call added to fetch admin dashboard data
  useEffect(() => {
    const fetchAdminDashboard = async () => {
      try {
        const res = await getAdminDashboard();

        console.log("ADMIN DASHBOARD DATA:", res.data);

        setDashboardData(res.data);
      } catch (err) {
        console.log("ADMIN DASHBOARD ERROR:", err);

        setError(
          err.response?.data?.message || "Failed to load admin dashboard"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAdminDashboard();
  }, []);

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

            {/* CHANGED: loading state added */}
            {loading && (
              <div className="mb-6 rounded-xl border border-cyan-400/10 bg-[#06111f] p-4 text-sm text-[#7c8aa5]">
                Loading dashboard data...
              </div>
            )}

            {/* CHANGED: error state added */}
            {error && (
              <div className="mb-6 rounded-xl border border-red-400/20 bg-red-500/10 p-4 text-sm text-red-300">
                {error}
              </div>
            )}

            {/* CHANGED: dashboardData passed to child components */}
            <StatsBar stats={dashboardData?.stats} />

            <div className="grid grid-cols-2 gap-6 mb-6">
              <RecentIssues issues={dashboardData?.recentComplaints || []} />
              <CategoryChart categoryStats={dashboardData?.categoryStats || []} />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <StaffOverview staffList={dashboardData?.staffOverview || []} />
              <Alerts alerts={dashboardData?.alerts || []} />
            </div>
          </>
        );

      case 'issues':
        return <AllIssues />;

      case 'citizens':
        return <Citizens citizens={dashboardData?.citizensOverview || []} />;

      case 'staff':
        return <Staff staff={dashboardData?.staffDirectory || []} />;

      case 'map':
        return <MapView />;

      case 'announcements':
        return <Announcements />;

      case 'profile':
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