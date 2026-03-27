import React from "react";

const alerts = [
  {
    title: "Issue #4821 has been marked In Progress",
    time: "10 minutes ago",
    type: "update",
  },
  {
    title: "New comment added by city staff on Issue #4790",
    time: "1 hour ago",
    type: "comment",
  },
  {
    title: "Issue #4702 has been resolved successfully",
    time: "Yesterday",
    type: "resolved",
  },
  {
    title: "Your issue in Kurla has been assigned to a field worker",
    time: "2 days ago",
    type: "assigned",
  },
];

const alertStyles = {
  update: "bg-cyan-400/10 text-cyan-300 border-cyan-400/15",
  comment: "bg-violet-400/10 text-violet-300 border-violet-400/15",
  resolved: "bg-emerald-400/10 text-emerald-300 border-emerald-400/15",
  assigned: "bg-amber-400/10 text-amber-300 border-amber-400/15",
};

const Alerts = () => {
  return (
    <div className="rounded-2xl border border-cyan-400/10 bg-[#09111f]/80 p-7 backdrop-blur-md">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-base font-semibold text-[#e6f1ff]">
          Alerts
        </h2>
        <button className="text-xs text-cyan-300 hover:text-cyan-200 transition-colors">
          Mark all as read
        </button>
      </div>

      <div className="space-y-4">
        {alerts.map((alert, index) => (
          <div
            key={index}
            className="rounded-xl border border-cyan-400/10 bg-[#0b1628]/70 p-4"
          >
            <div className="mb-2 flex items-center justify-between gap-4">
              <span
                className={`rounded-full border px-3 py-1 text-xs font-medium ${alertStyles[alert.type]}`}
              >
                {alert.type.charAt(0).toUpperCase() + alert.type.slice(1)}
              </span>
              <span className="text-xs text-[#7c8aa5]">{alert.time}</span>
            </div>

            <p className="text-sm text-[#e6f1ff]">{alert.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Alerts;