import React from "react";
import { stats as defaultStats } from "../../data/staffData";

const StatsBar = ({ stats }) => {
  const metricItems = stats
    ? [
        { label: "Assigned to Me", value: stats.assignedToMe || 0, color: "text-cyan-300" },
        { label: "Resolved", value: stats.resolved || 0, color: "text-emerald-300" },
        { label: "Pending", value: stats.pending || 0, color: "text-amber-300" }
      ]
    : defaultStats;

  return (
    <div className="mb-8 flex items-center gap-8 rounded-2xl border border-cyan-400/10 bg-[#09111f]/70 px-6 py-5 backdrop-blur-sm">
      {metricItems.map((s, i) => (
        <React.Fragment key={s.label}>
          <div className="flex flex-col gap-1">
            <span className="text-sm text-[#7c8aa5]">{s.label}</span>
            <span className={`text-3xl font-bold leading-none ${s.color}`}>
              {s.value}
            </span>
          </div>

          {i < metricItems.length - 1 && (
            <div className="h-10 w-px bg-cyan-400/10" />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default StatsBar;