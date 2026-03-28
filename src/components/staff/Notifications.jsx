import React from "react";

const notifications = [
  {
    title: "Issue #4831 has been escalated to high priority",
    time: "5 minutes ago",
    type: "escalate",
  },
  {
    title: "New task assigned: Pothole survey in Andheri W",
    time: "15 minutes ago",
    type: "task",
  },
  {
    title: "Issue #4807 completion photos approved",
    time: "1 hour ago",
    type: "approved",
  },
  {
    title: "Reminder: Follow-up drain inspection at Malad due by 3 PM",
    time: "2 hours ago",
    type: "reminder",
  },
  {
    title: "Issue #4795 has been resolved successfully",
    time: "Yesterday",
    type: "resolved",
  },
  {
    title: "Team message: Check Slack for zone meeting updates",
    time: "2 days ago",
    type: "message",
  },
];

const notificationStyles = {
  escalate:
    "bg-red-400/10 text-red-300 border-red-400/20",
  task: "bg-cyan-400/10 text-cyan-300 border-cyan-400/20",
  approved:
    "bg-emerald-400/10 text-emerald-300 border-emerald-400/20",
  reminder:
    "bg-amber-400/10 text-amber-300 border-amber-400/20",
  resolved:
    "bg-emerald-400/10 text-emerald-300 border-emerald-400/20",
  message:
    "bg-violet-400/10 text-violet-300 border-violet-400/20",
};

const notificationLabels = {
  escalate: "Escalated",
  task: "New Task",
  approved: "Approved",
  reminder: "Reminder",
  resolved: "Resolved",
  message: "Message",
};

const Notifications = () => {
  return (
    <div className="rounded-2xl border border-cyan-400/10 bg-[#09111f]/70 p-7 backdrop-blur-sm">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-base font-semibold text-[#e6f1ff]">
          Notifications
        </h2>
        <button className="text-sm text-cyan-300 hover:text-cyan-200 transition-colors font-medium">
          Mark all as read
        </button>
      </div>

      <div className="space-y-4">
        {notifications.map((notification, index) => (
          <div
            key={index}
            className="rounded-xl border border-cyan-400/10 bg-[#0b1628]/70 p-5 hover:bg-[#0b1628] transition-colors"
          >
            <div className="mb-3 flex items-center justify-between gap-4">
              <span
                className={`rounded-full border px-3 py-1 text-xs font-medium inline-block ${
                  notificationStyles[notification.type]
                }`}
              >
                {notificationLabels[notification.type]}
              </span>
              <span className="text-xs text-[#7c8aa5]">{notification.time}</span>
            </div>

            <p className="text-sm text-[#e6f1ff] leading-snug">
              {notification.title}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-center rounded-xl bg-cyan-400/5 border border-cyan-400/10 py-4 text-sm text-[#7c8aa5]">
        Showing {notifications.length} recent notifications
      </div>
    </div>
  );
};

export default Notifications;
