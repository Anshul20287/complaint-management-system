import React, { useState } from 'react';
import Sidebar from '../../components/staff/Sidebar';
import StatsBar from '../../components/staff/StatsBar';
import IssueQueue from '../../components/staff/IssueQueue';
import Checklist from '../../components/staff/Checklist';
import ZoneMap from '../../components/staff/ZoneMap';
import AssignedIssues from '../../components/staff/AssignedIssues';
import ResolvedIssues from '../../components/staff/ResolvedIssues';
import FieldMap from '../../components/staff/FieldMap';
import Notifications from '../../components/staff/Notifications';
import StaffProfile from '../../components/staff/StaffProfile';
import { staffUser } from '../../data/staffData';

const StaffDashboard = () => {
  const [active, setActive] = useState('dashboard');

  const renderContent = () => {
    switch (active) {
      case 'dashboard':
        return (
          <>
            <StatsBar />
            <div className="grid grid-cols-[1fr_320px] gap-6">
              <IssueQueue />
              <div className="flex flex-col gap-6">
                <Checklist />
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
            <StatsBar />
            <div className="grid grid-cols-[1fr_320px] gap-6">
              <IssueQueue />
              <div className="flex flex-col gap-6">
                <Checklist />
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
          <h1 className="text-xl font-semibold text-[#e6f1ff]">
            {active === 'dashboard' && 'Staff Dashboard'}
            {active === 'assigned' && 'Assigned Issues'}
            {active === 'resolved' && 'Resolved Issues'}
            {active === 'map' && 'Field Map'}
            {active === 'alerts' && 'Notifications'}
            {active === 'profile' && 'My Profile'}
          </h1>

          {/* User pill */}
          <div className="flex items-center gap-2 border border-cyan-400/10 rounded-full pl-1.5 pr-4 py-1.5 bg-[#09111f]/50 backdrop-blur-sm">
            <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center text-xs font-semibold text-[#19e6d2]">
              {staffUser.initials}
            </div>
            <span className="text-sm text-[#7c8aa5]">
              {staffUser.name} · {staffUser.zone}
            </span>
          </div>
        </div>

        {/* Page Content */}
        {renderContent()}
      </main>
    </div>
  );
};

export default StaffDashboard;