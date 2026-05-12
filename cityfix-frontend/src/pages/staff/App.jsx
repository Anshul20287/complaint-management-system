import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Sidebar from '../../components/staff/Sidebar';
import StatsBar from '../../components/staff/StatsBar';
import IssueQueue from '../../components/staff/IssueQueue';
import ZoneMap from '../../components/staff/ZoneMap';
import AssignedIssues from '../../components/staff/AssignedIssues';
import ResolvedIssues from '../../components/staff/ResolvedIssues';
import FieldMap from '../../components/staff/FieldMap';
import Notifications from '../../components/staff/Notifications';
import StaffProfile from '../../components/staff/StaffProfile';
import { getStaffDashboard } from '../../services/dashboardService';

const StaffDashboard = () => {
  const navigate = useNavigate();
  const { user, selectedDomain } = useAuth();
  const [active, setActive] = useState('dashboard');
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const userInitials = user?.name
    ? user.name
        .split(' ')
        .map((word) => word[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : 'ST';

  // Redirect if no selected domain
  React.useEffect(() => {
    if (!selectedDomain && user?.role === 'staff') {
      navigate('/staff/domain-select');
    }
  }, [selectedDomain, user, navigate]);

  useEffect(() => {
    const fetchDashboard = async () => {
      if (user?.role !== 'staff') return;
      try {
        setLoading(true);
        const res = await getStaffDashboard();
        setDashboardData(res.data);
        setError(null);
      } catch (err) {
        setError(err.response?.data?.message || 'Unable to load staff dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [user]);

  const renderContent = () => {
    switch (active) {
      case 'dashboard':
        return (
          <>
            <StatsBar stats={dashboardData?.stats} />
            <div className="grid grid-cols-[1fr_320px] gap-6">
              <IssueQueue issues={dashboardData?.assignedIssues || []} />
              <div className="flex flex-col gap-6">
                <ZoneMap />
              </div>
            </div>
          </>
        );
      case 'assigned':
        return <AssignedIssues />;
      case 'resolved':
        return <ResolvedIssues />;
      case 'map':
        return <FieldMap />;
      case 'alerts':
        return <Notifications />;
      case 'profile':
        return <StaffProfile />;
      default:
        return (
          <>
            <StatsBar stats={dashboardData?.stats} />
            <div className="grid grid-cols-[1fr_320px] gap-6">
              <IssueQueue issues={dashboardData?.assignedIssues || []} />
              <div className="flex flex-col gap-6">
                <ZoneMap />
              </div>
            </div>
          </>
        );
    }
  };

  return (
    <div
      className="min-h-screen bg-[#030712] text-white"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      <Sidebar active={active} setActive={setActive} />

      <main className="ml-[220px] min-h-screen p-8 bg-[radial-gradient(circle_at_top,_rgba(25,230,210,0.08),_transparent_35%),linear-gradient(to_bottom,_#030712,_#020617)] overflow-y-auto">
        {/* Top Bar */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-semibold text-[#e6f1ff]">
              {active === 'dashboard' && 'Staff Dashboard'}
              {active === 'assigned' && 'Assigned Issues'}
              {active === 'resolved' && 'Resolved Issues'}
              {active === 'map' && 'Field Map'}
              {active === 'alerts' && 'Notifications'}
              {active === 'profile' && 'My Profile'}
            </h1>

            {/* Domain Badge */}
            {selectedDomain && (
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30">
                <span className="text-xs text-cyan-300 font-medium">📍 Domain:</span>
                <span className="text-xs text-cyan-200 font-semibold">{selectedDomain}</span>
                {user?.assignedCategories?.length > 1 && (
                  <button
                    onClick={() => navigate('/staff/domain-select')}
                    className="ml-2 text-xs text-cyan-300 hover:text-cyan-100 cursor-pointer underline"
                  >
                    Change
                  </button>
                )}
              </div>
            )}
          </div>

          {/* User pill */}
          <div className="flex items-center gap-2 border border-cyan-400/10 rounded-full pl-1.5 pr-4 py-1.5 bg-[#09111f]/50 backdrop-blur-sm">
            <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center text-xs font-semibold text-[#19e6d2]">
              {userInitials}
            </div>
            <span className="text-sm text-[#7c8aa5]">
              {user?.name || 'Staff'} · {user?.address || 'Zone not set'}
            </span>
          </div>
        </div>

        {/* Page Content */}
        {loading ? (
          <div className="rounded-2xl border border-cyan-400/10 bg-[#09111f]/70 p-10 text-center text-cyan-200">
            Loading staff dashboard...
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

export default StaffDashboard;