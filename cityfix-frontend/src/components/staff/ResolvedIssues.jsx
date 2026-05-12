import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { getStaffAssignedComplaints } from "../../services/complaintService";

const priorityStyles = {
  HIGH: "bg-red-500/15 text-red-400 border border-red-400/10",
  MEDIUM: "bg-amber-400/10 text-amber-300 border border-amber-300/10",
  LOW: "bg-emerald-500/15 text-emerald-400 border border-emerald-400/10"
};

const ResolvedIssues = () => {
  const { selectedDomain } = useAuth();
  const [resolvedIssues, setResolvedIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResolved = async () => {
      setLoading(true);
      try {
        const res = await getStaffAssignedComplaints(selectedDomain || undefined);
        setResolvedIssues((res.data.complaints || []).filter((c) => c.status === "RESOLVED"));
        setError(null);
      } catch (err) {
        setResolvedIssues([]);
        setError(err.response?.data?.message || "Unable to load resolved issues");
      } finally {
        setLoading(false);
      }
    };

    fetchResolved();
  }, [selectedDomain]);

  return (
    <div className="rounded-2xl border border-cyan-400/10 bg-[#09111f]/70 p-7 backdrop-blur-sm">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-base font-semibold text-[#e6f1ff]">Resolved Issues</h2>
          <p className="text-sm text-[#7c8aa5] mt-1">Completed tasks in your assigned field.</p>
        </div>
        <div className="rounded-xl bg-[#0b1628]/70 border border-cyan-400/10 px-4 py-3 text-sm text-[#7c8aa5]">
          {resolvedIssues.length} resolved
        </div>
      </div>

      {error ? (
        <div className="rounded-xl bg-[#2f151b]/70 border border-red-500/10 p-6 text-sm text-red-300">
          {error}
        </div>
      ) : loading ? (
        <div className="rounded-xl bg-[#0b1628]/70 border border-cyan-400/10 p-6 text-sm text-cyan-200">
          Loading resolved issues...
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
                <th className="pb-3">Resolved</th>
              </tr>
            </thead>
            <tbody>
              {resolvedIssues.map((complaint, index) => (
                <tr
                  key={complaint._id}
                  className={`hover:bg-cyan-400/5 transition-colors ${index < resolvedIssues.length - 1 ? "border-b border-cyan-400/10" : ""}`}
                >
                  <td className="py-4 text-sm font-medium text-[#19e6d2]">{complaint._id.slice(-6)}</td>
                  <td className="py-4 text-sm text-[#e6f1ff]">{complaint.category}</td>
                  <td className="py-4 text-sm text-[#7c8aa5]">{complaint.address || "Unknown"}</td>
                  <td className="py-4">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${priorityStyles[complaint.priority]}`}>
                      {complaint.priority}
                    </span>
                  </td>
                  <td className="py-4 text-sm text-[#7c8aa5]">{new Date(complaint.updatedAt || complaint.resolvedAt || complaint.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ResolvedIssues;
