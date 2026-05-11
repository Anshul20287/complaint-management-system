import React, { useEffect, useState } from "react";
import {
  getNotifications,
  markAllNotificationsRead,
  markNotificationRead,
  deleteNotification,
} from "../../services/notificationService";

const notificationStyles = {
  escalate: "bg-red-400/10 text-red-300 border-red-400/20",
  task: "bg-cyan-400/10 text-cyan-300 border-cyan-400/20",
  approved: "bg-emerald-400/10 text-emerald-300 border-emerald-400/20",
  reminder: "bg-amber-400/10 text-amber-300 border-amber-400/20",
  resolved: "bg-emerald-400/10 text-emerald-300 border-emerald-400/20",
  message: "bg-violet-400/10 text-violet-300 border-violet-400/20",
  staff_rejected: "bg-red-400/10 text-red-300 border-red-400/20",
};

const notificationLabels = {
  escalate: "Escalated",
  task: "New Task",
  approved: "Approved",
  reminder: "Reminder",
  resolved: "Resolved",
  message: "Message",
  staff_rejected: "Staff Rejected",
};

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await getNotifications();
      setNotifications(res.data.notifications || []);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load notifications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAllRead = async () => {
    try {
      await markAllNotificationsRead();
      fetchNotifications();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to mark notifications as read");
    }
  };

  const handleMarkRead = async (id) => {
    try {
      await markNotificationRead(id);
      fetchNotifications();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to mark notification as read");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteNotification(id);
      setNotifications((prev) => prev.filter((item) => item._id !== id));
    } catch (err) {
      setError(err.response?.data?.message || "Unable to delete notification");
    }
  };

  return (
    <div className="rounded-2xl border border-cyan-400/10 bg-[#09111f]/70 p-7 backdrop-blur-sm">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold text-[#e6f1ff]">Notifications</h2>
          <p className="text-sm text-[#7c8aa5] mt-1">Latest system messages and staff alerts.</p>
        </div>
        <button
          onClick={handleMarkAllRead}
          className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm font-medium text-cyan-300 hover:bg-cyan-400/15 transition-colors"
        >
          Mark all read
        </button>
      </div>

      {error ? (
        <div className="rounded-xl bg-[#2f151b]/70 border border-red-500/10 p-6 text-sm text-red-300">
          {error}
        </div>
      ) : loading ? (
        <div className="rounded-xl bg-[#0b1628]/70 border border-cyan-400/10 p-6 text-sm text-cyan-200">
          Loading notifications...
        </div>
      ) : (
        <div className="space-y-4">
          {notifications.length === 0 ? (
            <div className="rounded-xl border border-cyan-400/10 bg-[#0b1628]/70 p-6 text-sm text-[#7c8aa5]">
              No notifications yet.
            </div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification._id}
                className={`rounded-xl border px-5 py-5 transition-colors ${notification.isRead ? "border-cyan-400/10 bg-[#0b1628]/70" : "border-cyan-400/20 bg-[#0b1628]/90"}`}
              >
                <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                  <span
                    className={`rounded-full border px-3 py-1 text-xs font-medium inline-block ${notificationStyles[notification.type] || notificationStyles.message}`}
                  >
                    {notificationLabels[notification.type] || "Update"}
                  </span>
                  <span className="text-xs text-[#7c8aa5]">{new Date(notification.createdAt).toLocaleString()}</span>
                </div>

                <p className="text-sm text-[#e6f1ff] leading-snug mb-4">
                  {notification.message || notification.title || "Notification received."}
                </p>

                <div className="flex flex-wrap items-center gap-2 text-xs text-[#7c8aa5]">
                  <button
                    onClick={() => handleMarkRead(notification._id)}
                    className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-cyan-300 hover:bg-cyan-400/15 transition-colors"
                  >
                    Mark read
                  </button>
                  <button
                    onClick={() => handleDelete(notification._id)}
                    className="rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1 text-red-300 hover:bg-red-500/15 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      <div className="mt-6 flex items-center justify-center rounded-xl bg-cyan-400/5 border border-cyan-400/10 py-4 text-sm text-[#7c8aa5]">
        Showing {notifications.length} recent notifications
      </div>
    </div>
  );
};

export default Notifications;
