import React from 'react';
import { getAllComplaints, getStaffByCategory, assignComplaint, getComplaintTimeline, rejectUpdate } from '../../services/complaintService';
import ComplaintTimeline from './ComplaintTimeline';

const statusStyles = {
  OPEN: 'bg-red-500/15 text-red-400 border border-red-400/10',
  ASSIGNED: 'bg-blue-500/15 text-blue-400 border border-blue-400/10',
  IN_PROGRESS: 'bg-amber-400/10 text-amber-300 border border-amber-300/10',
  WORK_COMPLETED: 'bg-cyan-500/15 text-cyan-400 border border-cyan-400/10',
  VERIFIED: 'bg-emerald-500/15 text-emerald-400 border border-emerald-400/10',
  RESOLVED: 'bg-emerald-400/10 text-emerald-300 border border-emerald-300/10',
  REJECTED: 'bg-red-500/15 text-red-400 border border-red-400/10'
};

const AllIssues = () => {
  const [issues, setIssues] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState('');
  const [selectedIssue, setSelectedIssue] = React.useState(null);
  const [staffList, setStaffList] = React.useState([]);
  const [loadingStaff, setLoadingStaff] = React.useState(false);
  const [selectedStaff, setSelectedStaff] = React.useState(null);
  const [assignmentError, setAssignmentError] = React.useState('');
  const [assignmentSuccess, setAssignmentSuccess] = React.useState('');
  const [viewingTimeline, setViewingTimeline] = React.useState(null);
  const [rejectingIssue, setRejectingIssue] = React.useState(null);
  const [rejectReason, setRejectReason] = React.useState('');

  React.useEffect(() => {
    const fetchIssues = async () => {
      try {
        const res = await getAllComplaints();
        setIssues(res.data?.complaints || []);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load issues');
      } finally {
        setLoading(false);
      }
    };

    fetchIssues();
  }, []);

  const handleAssignClick = async (issue) => {
    setSelectedIssue(issue);
    setSelectedStaff(null);
    setAssignmentError('');
    setAssignmentSuccess('');
    setLoadingStaff(true);

    try {
      const res = await getStaffByCategory(issue.category);
      setStaffList(res.data?.staff || []);
      if (!res.data?.staff || res.data.staff.length === 0) {
        setAssignmentError(`No available staff for category: ${issue.category}`);
      }
    } catch (err) {
      setAssignmentError(err.response?.data?.message || 'Failed to load staff members');
    } finally {
      setLoadingStaff(false);
    }
  };

  const handleAssignComplaint = async () => {
    if (!selectedStaff) {
      setAssignmentError('Please select a staff member');
      return;
    }

    try {
      setAssignmentError('');
      const res = await assignComplaint(selectedIssue._id, selectedStaff);
      setAssignmentSuccess('Complaint assigned successfully!');
      
      // Update the issues list
      setIssues(issues.map(issue =>
        issue._id === selectedIssue._id
          ? res.data?.complaint
          : issue
      ));

      // Close modal after 1.5 seconds
      setTimeout(() => {
        setSelectedIssue(null);
        setSelectedStaff(null);
      }, 1500);
    } catch (err) {
      setAssignmentError(err.response?.data?.message || 'Failed to assign complaint');
    }
  };

  const handleRejectUpdate = async () => {
    try {
      await rejectUpdate(rejectingIssue._id, { reason: rejectReason });
      setIssues(issues.map(issue =>
        issue._id === rejectingIssue._id
          ? { ...issue, status: 'REJECTED' }
          : issue
      ));
      setRejectingIssue(null);
      setRejectReason('');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to reject update');
    }
  };

  const formatStatus = (status) => {
    return status.replace('_', ' ');
  };

  if (viewingTimeline) {
    return <ComplaintTimeline complaint={viewingTimeline} onClose={() => setViewingTimeline(null)} />;
  }

  // Filter suspicious updates
  const suspiciousIssues = issues.filter(issue => issue.geoVerification?.flagged);

  return (
    <div className="rounded-2xl border border-cyan-400/10 bg-[#09111f]/80 p-7 backdrop-blur-md">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-base font-semibold text-[#e6f1ff]">All Issues</h2>
        {suspiciousIssues.length > 0 && (
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/15 border border-red-400/20">
            <span className="text-xs text-red-400 font-medium">⚠️ {suspiciousIssues.length} Suspicious GPS</span>
          </div>
        )}
      </div>

      {loading && (
        <p className="mb-4 text-sm text-[#7c8aa5]">Loading issues...</p>
      )}

      {error && (
        <p className="mb-4 text-sm text-red-300">{error}</p>
      )}

      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-cyan-400/10">
            <th className="pb-3 text-left text-xs font-medium tracking-wide text-[#7c8aa5]">
              #ID
            </th>
            <th className="pb-3 text-left text-xs font-medium tracking-wide text-[#7c8aa5]">
              Type · Location
            </th>
            <th className="pb-3 text-left text-xs font-medium tracking-wide text-[#7c8aa5]">
              Status
            </th>
            <th className="pb-3 text-left text-xs font-medium tracking-wide text-[#7c8aa5]">
              Assigned To
            </th>
            <th className="pb-3 text-left text-xs font-medium tracking-wide text-[#7c8aa5]">
              Action
            </th>
          </tr>
        </thead>

        <tbody>
          {issues.map((issue, i) => (
            <tr
              key={issue._id}
              className={`${i < issues.length - 1 ? 'border-b border-cyan-400/10' : ''} ${issue.geoVerification?.flagged ? 'bg-red-500/5' : ''}`}
            >
              <td className="py-4">
                <span className="cursor-pointer text-sm font-medium text-[#60a5fa] hover:underline">
                  #{issue._id?.slice(-5)}
                </span>
              </td>

              <td className="py-4 text-sm">
                <span className="font-medium text-[#e6f1ff]">{issue.category}</span>
                <span className="text-xs text-[#7c8aa5]"> · {issue.address}</span>
                {issue.geoVerification?.flagged && (
                  <div className="text-xs text-red-400 mt-1">
                    ⚠️ GPS Distance: {issue.geoVerification.distance}m
                  </div>
                )}
              </td>

              <td className="py-4">
                <span
                  className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${statusStyles[issue.status] || statusStyles.OPEN}`}
                >
                  {formatStatus(issue.status)}
                </span>
              </td>

              <td className="py-4 text-sm">
                <span className="text-[#7c8aa5]">
                  {issue.assignedTo ? issue.assignedTo.name : 'Unassigned'}
                </span>
              </td>

              <td className="py-4 space-x-2">
                <button
                  onClick={() => setViewingTimeline(issue)}
                  className="text-xs px-3 py-1 rounded bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 transition-colors border border-blue-500/30"
                >
                  Timeline
                </button>
                {!issue.assignedTo ? (
                  <button
                    onClick={() => handleAssignClick(issue)}
                    className="text-xs px-3 py-1 rounded bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 transition-colors border border-cyan-500/30"
                  >
                    Assign
                  </button>
                ) : (
                  <button
                    onClick={() => handleAssignClick(issue)}
                    className="text-xs px-3 py-1 rounded bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 transition-colors border border-amber-500/30"
                  >
                    Reassign
                  </button>
                )}
                {issue.status === 'WORK_COMPLETED' && issue.geoVerification?.flagged && (
                  <button
                    onClick={() => setRejectingIssue(issue)}
                    className="text-xs px-3 py-1 rounded bg-red-500/20 text-red-300 hover:bg-red-500/30 transition-colors border border-red-500/30"
                  >
                    Reject
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {!loading && issues.length === 0 && !error && (
        <p className="mt-4 text-sm text-[#7c8aa5]">No issues found.</p>
      )}

      {/* Assignment Modal */}
      {selectedIssue && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#09111f] border border-cyan-400/20 rounded-2xl p-8 max-w-md w-full mx-4 shadow-xl">
            <h3 className="text-lg font-semibold text-[#e6f1ff] mb-4">
              Assign Complaint
            </h3>

            <div className="mb-4 p-3 bg-cyan-400/10 rounded-lg border border-cyan-400/20">
              <p className="text-sm text-[#7c8aa5]">Category</p>
              <p className="text-sm font-medium text-[#e6f1ff]">{selectedIssue.category}</p>
              <p className="text-xs text-[#7c8aa5] mt-2">Title</p>
              <p className="text-sm font-medium text-[#e6f1ff]">{selectedIssue.title}</p>
            </div>

            {loadingStaff && (
              <p className="text-sm text-[#7c8aa5] mb-4">Loading staff members...</p>
            )}

            {assignmentError && (
              <p className="text-sm text-red-300 mb-4">{assignmentError}</p>
            )}

            {assignmentSuccess && (
              <p className="text-sm text-emerald-300 mb-4">{assignmentSuccess}</p>
            )}

            {!loadingStaff && staffList.length > 0 && (
              <div className="mb-4">
                <label className="block text-sm text-[#7c8aa5] mb-2">
                  Select Staff Member
                </label>
                <select
                  value={selectedStaff?._id || ''}
                  onChange={(e) => {
                    const staff = staffList.find(s => s._id === e.target.value);
                    setSelectedStaff(staff);
                  }}
                  className="w-full bg-[#1a2f4f]/50 border border-cyan-400/20 rounded-lg px-3 py-2 text-sm text-[#e6f1ff] focus:outline-none focus:border-cyan-400/50"
                >
                  <option value="">Choose a staff member...</option>
                  {staffList.map((staff) => (
                    <option key={staff._id} value={staff._id}>
                      {staff.name} ({staff.email})
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setSelectedIssue(null);
                  setSelectedStaff(null);
                  setAssignmentError('');
                  setAssignmentSuccess('');
                }}
                className="flex-1 px-4 py-2 rounded-lg bg-[#1a2f4f]/50 text-[#7c8aa5] hover:bg-[#1a2f4f] transition-colors border border-cyan-400/10"
              >
                Cancel
              </button>
              <button
                onClick={handleAssignComplaint}
                disabled={!selectedStaff || assignmentSuccess}
                className="flex-1 px-4 py-2 rounded-lg bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 transition-colors border border-cyan-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Assign
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Update Modal */}
      {rejectingIssue && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#09111f] border border-red-400/20 rounded-2xl p-8 max-w-md w-full mx-4 shadow-xl">
            <h3 className="text-lg font-semibold text-[#e6f1ff] mb-4">
              Reject Suspicious Update
            </h3>

            <div className="mb-4 p-3 bg-red-400/10 rounded-lg border border-red-400/20">
              <p className="text-sm text-red-300">⚠️ GPS mismatch detected</p>
              <p className="text-xs text-[#7c8aa5] mt-2">Distance: {rejectingIssue.geoVerification?.distance}m from location</p>
            </div>

            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Reason for rejection..."
              className="w-full bg-[#1a2f4f]/50 border border-cyan-400/20 rounded-lg px-3 py-2 text-sm text-[#e6f1ff] placeholder-[#7c8aa5] focus:outline-none focus:border-cyan-400/50 mb-4"
              rows="3"
            />

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setRejectingIssue(null);
                  setRejectReason('');
                }}
                className="flex-1 px-4 py-2 rounded-lg bg-[#1a2f4f]/50 text-[#7c8aa5] hover:bg-[#1a2f4f] transition-colors border border-cyan-400/10"
              >
                Cancel
              </button>
              <button
                onClick={handleRejectUpdate}
                className="flex-1 px-4 py-2 rounded-lg bg-red-500/20 text-red-300 hover:bg-red-500/30 transition-colors border border-red-500/30"
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllIssues;
