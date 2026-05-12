import React, { useEffect, useState } from "react";
import {
  getNotifications,
  markAllNotificationsRead,
  markNotificationRead,
  deleteNotification,
} from "../../services/notificationService";

const alertStyles = {
  update: "bg-cyan-400/10 text-cyan-300 border-cyan-400/15",
  comment: "bg-violet-400/10 text-violet-300 border-violet-400/15",
  resolved: "bg-emerald-400/10 text-emerald-300 border-emerald-400/15",
  assigned: "bg-amber-400/10 text-amber-300 border-amber-400/15",
  staff_rejected: "bg-red-400/10 text-red-300 border-red-400/20",
};

const Alerts = () => {
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
      setError(err.response?.data?.message || "Unable to load alerts");
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
      setError(err.response?.data?.message || "Unable to mark alerts as read");
    }
  };

  const handleMarkRead = async (id) => {
    try {
      await markNotificationRead(id);
      fetchNotifications();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to mark alert as read");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteNotification(id);
      setNotifications((prev) => prev.filter((item) => item._id !== id));
    } catch (err) {
      setError(err.response?.data?.message || "Unable to delete alert");
    }
  };

  return (
    <div className="rounded-2xl border border-cyan-400/10 bg-[#09111f]/80 p-7 backdrop-blur-md">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-base font-semibold text-[#e6f1ff]">
          Alerts
        </h2>
        <button
          onClick={handleMarkAllRead}
          className="text-xs text-cyan-300 hover:text-cyan-200 transition-colors"
        >
          Mark all as read
        </button>
      </div>

      {error ? (
        <div className="rounded-xl bg-[#2f151b]/70 border border-red-500/10 p-6 text-sm text-red-300">
          {error}
        </div>
      ) : loading ? (
        <div className="rounded-xl bg-[#0b1628]/70 border border-cyan-400/10 p-6 text-sm text-cyan-200">
          Loading alerts...
        </div>
      ) : (
        <div className="space-y-4">
          {notifications.length === 0 ? (
            <div className="rounded-xl border border-cyan-400/10 bg-[#0b1628]/70 p-6 text-sm text-[#7c8aa5]">
              No alerts yet.
            </div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification._id}
                className="rounded-xl border border-cyan-400/10 bg-[#0b1628]/70 p-4"
              >
                <div className="mb-2 flex items-center justify-between gap-4">
                  <span
                    className={`rounded-full border px-3 py-1 text-xs font-medium ${alertStyles[notification.type] || alertStyles.update}`}
                  >
                    {notification.type.charAt(0).toUpperCase() + notification.type.slice(1).replace('_', ' ')}
                  </span>
                  <span className="text-xs text-[#7c8aa5]">{new Date(notification.createdAt).toLocaleString()}</span>
                </div>

                <p className="text-sm text-[#e6f1ff] mb-3">{notification.message || notification.title || "Alert received."}</p>

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
    </div>
  );
};

export default Alerts;