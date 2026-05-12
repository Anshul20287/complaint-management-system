import React from "react";

const StatsBar = ({ stats, onRefresh }) => {
  const statsData = stats ? [
    { label: "My Reports", value: stats.myReports || 0, color: "text-[#e6f1ff]" },
    { label: "Resolved", value: stats.resolved || 0, color: "text-[#19e6d2]" },
    { label: "Pending", value: stats.pending || 0, color: "text-[#fbbf24]" },
  ] : [
    { label: "My Reports", value: 0, color: "text-[#e6f1ff]" },
    { label: "Resolved", value: 0, color: "text-[#19e6d2]" },
    { label: "Pending", value: 0, color: "text-[#fbbf24]" },
  ];

  return (
    <div className="mb-8 flex items-center justify-between rounded-2xl border border-cyan-400/10 bg-[#09111f]/70 px-6 py-5 backdrop-blur-sm">
      <div className="flex items-center gap-8">
        {statsData.map((s, i) => (
          <React.Fragment key={s.label}>
            <div className="flex flex-col gap-1">
              <span className="text-sm text-[#7c8aa5]">{s.label}</span>
              <span className={`text-3xl font-bold leading-none ${s.color}`}>
                {s.value}
              </span>
            </div>

            {i < statsData.length - 1 && (
              <div className="h-10 w-px bg-cyan-400/10" />
            )}
          </React.Fragment>
        ))}
      </div>

      {onRefresh && (
        <button
          onClick={onRefresh}
          className="rounded-xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm font-medium text-cyan-300 hover:bg-cyan-400/15 transition-colors"
        >
          ↻ Refresh
        </button>
      )}
    </div>
  );
};

export default StatsBar;