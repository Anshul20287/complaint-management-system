import React from 'react';
import { getNotifications } from '../../services/notificationService';
import {
  getPendingStaffRequests,
  approveStaffRequest,
  rejectStaffRequest
} from '../../services/authService';

const announcementTypes = new Set(['complaint_registered']);

const Announcements = () => {
  const [announcements, setAnnouncements] = React.useState([]);
  const [pendingStaffRequests, setPendingStaffRequests] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState('');
  const [actionLoadingId, setActionLoadingId] = React.useState('');

  const fetchAnnouncements = React.useCallback(async (showLoading = true) => {
    if (showLoading) setLoading(true);
    try {
      const [notificationsRes, staffRequestsRes] = await Promise.all([
        getNotifications(),
        getPendingStaffRequests()
      ]);
      const relevant = (notificationsRes.data?.notifications || []).filter((item) =>
        announcementTypes.has(item.type)
      );
      setAnnouncements(relevant);
      setPendingStaffRequests(staffRequestsRes.data?.requests || []);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load announcements');
    } finally {
      if (showLoading) setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchAnnouncements(true);
    const intervalId = setInterval(() => {
      fetchAnnouncements(false);
    }, 10000);

    return () => clearInterval(intervalId);
  }, [fetchAnnouncements]);

  const formatDate = (dateString) => {
    if (!dateString) return 'Recently';
    return new Date(dateString).toLocaleString();
  };

  const handleStaffDecision = async (staffId, decision) => {
    try {
      setActionLoadingId(`${decision}-${staffId}`);
      if (decision === 'approve') {
        await approveStaffRequest(staffId);
      } else {
        await rejectStaffRequest(staffId);
      }
      await fetchAnnouncements(false);
    } catch (err) {
      setError(err.response?.data?.message || `Failed to ${decision} request`);
    } finally {
      setActionLoadingId('');
    }
  };

  return (
    <div className="rounded-2xl border border-cyan-400/10 bg-[#09111f]/80 p-7 backdrop-blur-md">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-base font-semibold text-[#e6f1ff]">Announcements</h2>
        <button
          type="button"
          className="text-xs text-cyan-300 hover:text-cyan-200 transition-colors"
          onClick={() => fetchAnnouncements(true)}
        >
          Refresh
        </button>
      </div>

      {loading && <p className="text-sm text-[#7c8aa5]">Loading announcements...</p>}
      {error && <p className="text-sm text-red-300">{error}</p>}

      {!loading && !error && announcements.length === 0 && pendingStaffRequests.length === 0 && (
        <p className="text-sm text-[#7c8aa5]">No announcements available.</p>
      )}

      {!loading && !error && pendingStaffRequests.length > 0 && (
        <div className="space-y-3 mb-4">
          {pendingStaffRequests.map((staff) => (
            <div
              key={staff.id}
              className="p-4 rounded-xl bg-[#0b1628]/70 border border-amber-300/20"
            >
              <p className="text-sm font-medium text-[#e6f1ff]">
                Pending Staff Approval Request
              </p>
              <p className="text-xs text-[#7c8aa5] mt-1">
                {staff.name} ({staff.email}) requested staff access.
              </p>
              <p className="text-xs text-[#7c8aa5] mt-1">{formatDate(staff.createdAt)}</p>
              <div className="mt-3 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleStaffDecision(staff.id, 'approve')}
                  disabled={actionLoadingId === `approve-${staff.id}` || !!actionLoadingId}
                  className="rounded-md bg-emerald-500/20 px-3 py-1.5 text-xs text-emerald-300 border border-emerald-300/20 disabled:opacity-60"
                >
                  {actionLoadingId === `approve-${staff.id}` ? 'Approving...' : 'Approve'}
                </button>
                <button
                  type="button"
                  onClick={() => handleStaffDecision(staff.id, 'reject')}
                  disabled={actionLoadingId === `reject-${staff.id}` || !!actionLoadingId}
                  className="rounded-md bg-red-500/20 px-3 py-1.5 text-xs text-red-300 border border-red-300/20 disabled:opacity-60"
                >
                  {actionLoadingId === `reject-${staff.id}` ? 'Rejecting...' : 'Reject'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && !error && announcements.length > 0 && (
        <div className="space-y-3">
          {announcements.map((a) => (
            <div
              key={a._id}
              className="p-4 rounded-xl bg-[#0b1628]/70 border border-cyan-400/10"
            >
              <p className="text-sm font-medium text-[#e6f1ff]">{a.title}</p>
              <p className="text-xs text-[#7c8aa5] mt-1">{a.message}</p>
              <p className="text-xs text-[#7c8aa5] mt-1">{formatDate(a.createdAt)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Announcements;