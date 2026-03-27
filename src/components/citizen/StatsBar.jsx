import React from "react";

const stats = [
  { label: "My Reports", value: 8, color: "text-[#e6f1ff]" },
  { label: "Resolved", value: 5, color: "text-[#19e6d2]" },
  { label: "Pending", value: 3, color: "text-[#fbbf24]" },
];

const StatsBar = () => {
  return (
    <div className="mb-8 flex items-center gap-8 rounded-2xl border border-cyan-400/10 bg-[#09111f]/70 px-6 py-5 backdrop-blur-sm">
      {stats.map((s, i) => (
        <React.Fragment key={s.label}>
          <div className="flex flex-col gap-1">
            <span className="text-sm text-[#7c8aa5]">{s.label}</span>
            <span className={`text-3xl font-bold leading-none ${s.color}`}>
              {s.value}
            </span>
          </div>

          {i < stats.length - 1 && (
            <div className="h-10 w-px bg-cyan-400/10" />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default StatsBar;