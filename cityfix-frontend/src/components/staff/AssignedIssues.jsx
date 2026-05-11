import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { getStaffAssignedComplaints } from "../../services/complaintService";
import WorkUpdateForm from "./WorkUpdateForm";

const priorityStyles = {
  HIGH: "bg-red-500/15 text-red-400 border border-red-400/10",
  MEDIUM: "bg-amber-400/10 text-amber-300 border border-amber-300/10",
  LOW: "bg-emerald-500/15 text-emerald-400 border border-emerald-400/10"
};

const statusStyles = {
  OPEN: "bg-red-500/15 text-red-400 border border-red-400/10",
  ASSIGNED: "bg-blue-500/15 text-blue-400 border border-blue-400/10",
  IN_PROGRESS: "bg-amber-400/10 text-amber-300 border border-amber-300/10",
  WORK_COMPLETED: "bg-cyan-500/15 text-cyan-400 border border-cyan-400/10",
  VERIFIED: "bg-emerald-500/15 text-emerald-400 border border-emerald-400/10",
  RESOLVED: "bg-emerald-500/15 text-emerald-400 border border-emerald-400/10",
  REJECTED: "bg-red-500/15 text-red-400 border border-red-400/10"
};

const AssignedIssues = () => {
  const { user, selectedDomain } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [stats, setStats] = useState({ total: 0, open: 0, assigned: 0, inProgress: 0, workCompleted: 0, resolved: 0, urgent: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [category, setCategory] = useState(selectedDomain || user?.assignedCategories?.[0] || "");
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [showWorkForm, setShowWorkForm] = useState(false);

  useEffect(() => {
    if (selectedDomain) setCategory(selectedDomain);
    else if (user?.assignedCategories?.length) setCategory(user.assignedCategories[0]);
  }, [selectedDomain, user]);

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const res = await getStaffAssignedComplaints(category || undefined);
      setComplaints(res.data.complaints || []);
      setStats(res.data.stats || {});
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load assigned issues");
      setComplaints([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, [category]);

  const handleWorkComplete = async () => {
    await fetchComplaints();
    setShowWorkForm(false);
    setSelectedComplaint(null);
  };

  if (showWorkForm && selectedComplaint) {
    return (
      <WorkUpdateForm
        complaint={selectedComplaint}
        onClose={() => setShowWorkForm(false)}
        onSuccess={handleWorkComplete}
      />
    );
  }

  return (
    <div className="rounded-2xl border border-cyan-400/10 bg-[#09111f]/70 p-7 backdrop-blur-sm">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-base font-semibold text-[#e6f1ff]">All Assigned Issues</h2>
          <p className="text-sm text-[#7c8aa5] mt-1">Showing issues assigned to your field.</p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="rounded-xl bg-[#0b1628]/70 border border-cyan-400/10 px-4 py-3 text-sm text-[#7c8aa5]">
            {stats.total} total assigned
          </div>
          <button className="rounded-xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm font-medium text-cyan-300 hover:bg-cyan-400/15 transition-colors">
            Export List
          </button>
        </div>
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-5">
        <div className="rounded-xl bg-[#0b1628]/50 border border-cyan-400/10 p-4">
          <p className="text-xs text-[#7c8aa5] mb-1">Open</p>
          <p className="text-2xl font-bold text-red-400">{stats.open}</p>
        </div>
        <div className="rounded-xl bg-[#0b1628]/50 border border-cyan-400/10 p-4">
          <p className="text-xs text-[#7c8aa5] mb-1">In Progress</p>
          <p className="text-2xl font-bold text-amber-300">{stats.inProgress}</p>
        </div>
        <div className="rounded-xl bg-[#0b1628]/50 border border-cyan-400/10 p-4">
          <p className="text-xs text-[#7c8aa5] mb-1">Work Completed</p>
          <p className="text-2xl font-bold text-cyan-400">{stats.workCompleted}</p>
        </div>
        <div className="rounded-xl bg-[#0b1628]/50 border border-cyan-400/10 p-4">
          <p className="text-xs text-[#7c8aa5] mb-1">Resolved</p>
          <p className="text-2xl font-bold text-emerald-400">{stats.resolved}</p>
        </div>
        <div className="rounded-xl bg-[#0b1628]/50 border border-cyan-400/10 p-4">
          <p className="text-xs text-[#7c8aa5] mb-1">Urgent</p>
          <p className="text-2xl font-bold text-cyan-300">{stats.urgent}</p>
        </div>
      </div>

      {error ? (
        <div className="rounded-xl bg-[#2f151b]/70 border border-red-500/10 p-6 text-sm text-red-300">
          {error}
        </div>
      ) : loading ? (
        <div className="rounded-xl bg-[#0b1628]/70 border border-cyan-400/10 p-6 text-sm text-cyan-200">
          Loading assigned issues...
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-cyan-400/10 text-left text-xs uppercase tracking-[0.18em] text-[#7c8aa5]">
                <th className="pb-3">Issue ID</th>
                <th className="pb-3">Category</th>
                <th className="pb-3">Location</th>
                <th className="pb-3">Priority</th>
                <th className="pb-3">Status</th>
                <th className="pb-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {complaints.map((complaint, index) => (
                <tr
                  key={complaint._id}
                  className={`hover:bg-cyan-400/5 transition-colors ${index < complaints.length - 1 ? "border-b border-cyan-400/10" : ""}`}
                >
                  <td className="py-4 text-sm font-medium text-[#19e6d2]">{complaint._id.slice(-6)}</td>
                  <td className="py-4 text-sm text-[#e6f1ff]">{complaint.category}</td>
                  <td className="py-4 text-sm text-[#7c8aa5]">{complaint.address || "Unknown"}</td>
                  <td className="py-4">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${priorityStyles[complaint.priority]}`}>
                      {complaint.priority}
                    </span>
                  </td>
                  <td className="py-4">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${statusStyles[complaint.status]}`}>
                      {complaint.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-4 text-right">
                    {complaint.status === "ASSIGNED" || complaint.status === "OPEN" ? (
                      <button
                        onClick={() => {
                          setSelectedComplaint(complaint);
                          setShowWorkForm(true);
                        }}
                        className="rounded-lg bg-blue-500/20 text-blue-300 px-3 py-1.5 text-xs font-medium hover:bg-blue-500/30 transition-colors"
                      >
                        Start Work
                      </button>
                    ) : complaint.status === "IN_PROGRESS" ? (
                      <button
                        onClick={() => {
                          setSelectedComplaint(complaint);
                          setShowWorkForm(true);
                        }}
                        className="rounded-lg bg-cyan-500/20 text-cyan-300 px-3 py-1.5 text-xs font-medium hover:bg-cyan-500/30 transition-colors"
                      >
                        Complete Work
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setSelectedComplaint(complaint);
                          setShowWorkForm(true);
                        }}
                        className="rounded-lg bg-gray-500/20 text-gray-300 px-3 py-1.5 text-xs font-medium hover:bg-gray-500/30 transition-colors"
                      >
                        View Details
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AssignedIssues;
