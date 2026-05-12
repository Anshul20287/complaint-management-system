import React from 'react';

const StatsBar = ({ stats }) => {
  const dashboardStats = [
    {
      label: 'Total Issues',
      value: stats?.totalIssues || 0,
      sub: 'All complaints',
      color: 'text-cyan-300'
    },
    {
      label: 'Resolved',
      value: stats?.resolved || 0,
      sub: 'Completed',
      color: 'text-emerald-300'
    },
    {
      label: 'Pending',
      value: stats?.pending || 0,
      sub: 'Open + In Progress',
      color: 'text-amber-300'
    },
    {
      label: 'Escalated',
      value: stats?.escalated || 0,
      sub: 'High priority',
      color: 'text-violet-300'
    }
  ];

  return (
    <div className="mb-8 flex items-center gap-8 rounded-2xl border border-cyan-400/10 bg-[#09111f]/70 px-6 py-5 backdrop-blur-sm">
      {dashboardStats.map((stat, i) => (
        <React.Fragment key={stat.label}>
          <div className="flex flex-col gap-1">
            <span className="text-sm text-[#7c8aa5]">{stat.label}</span>
            <span className={`text-3xl font-bold leading-none ${stat.color}`}>
              {stat.value}
            </span>
            <p className="text-xs text-slate-500 mt-1">{stat.sub}</p>
          </div>

          {i < dashboardStats.length - 1 && (
            <div className="h-10 w-px bg-cyan-400/10" />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default StatsBar;