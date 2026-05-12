import React, { useEffect, useState } from "react";
import { getMyComplaints, updateComplaint, verifyCitizen, getComplaintById } from "../../services/complaintService";

const statusStyles = {
  OPEN: "bg-red-500/15 text-red-400 border border-red-400/10",
  ASSIGNED: "bg-blue-500/15 text-blue-400 border border-blue-400/10",
  IN_PROGRESS: "bg-amber-400/10 text-amber-300 border border-amber-300/10",
  WORK_COMPLETED: "bg-cyan-500/15 text-cyan-400 border border-cyan-400/10",
  VERIFIED: "bg-emerald-500/15 text-emerald-400 border border-emerald-400/10",
  RESOLVED: "bg-emerald-400/10 text-emerald-300 border border-emerald-300/10",
  REJECTED: "bg-red-500/15 text-red-400 border border-red-400/10"
};

const MyIssues = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingComplaint, setEditingComplaint] = useState(null);
  const [showTimeExpiredPopup, setShowTimeExpiredPopup] = useState(false);
  const [verifyingComplaint, setVerifyingComplaint] = useState(null);
  const [verificationFeedback, setVerificationFeedback] = useState("");
  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    category: "",
    priority: "",
    address: "",
    latitude: "",
    longitude: ""
  });

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const res = await getMyComplaints();
      setComplaints(res.data.complaints || []);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load my issues");
      setComplaints([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const canEditComplaint = (complaint) => {
    const now = new Date();
    const createdAt = new Date(complaint.createdAt);
    const timeDiff = (now - createdAt) / (1000 * 60); // in minutes
    return timeDiff <= 3 && complaint.status === "OPEN";
  };

  const handleEditClick = (complaint) => {
    if (canEditComplaint(complaint)) {
      setEditingComplaint(complaint);
      setEditForm({
        title: complaint.title,
        description: complaint.description,
        category: complaint.category,
        priority: complaint.priority,
        address: complaint.address,
        latitude: complaint.location?.latitude || "",
        longitude: complaint.location?.longitude || ""
      });
    } else {
      setShowTimeExpiredPopup(true);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await updateComplaint(editingComplaint._id, editForm);
      setComplaints(complaints.map(c =>
        c._id === editingComplaint._id ? res.data.complaint : c
      ));
      setEditingComplaint(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update complaint");
    }
  };

  const handleEditCancel = () => {
    setEditingComplaint(null);
    setEditForm({
      title: "",
      description: "",
      category: "",
      priority: "",
      address: "",
      latitude: "",
      longitude: ""
    });
  };

  const handleVerifyWork = async (verified) => {
    try {
      const res = await verifyCitizen(verifyingComplaint._id, {
        verified,
        feedback: verificationFeedback
      });
      setComplaints(complaints.map(c =>
        c._id === verifyingComplaint._id ? res.data.complaint : c
      ));
      setVerifyingComplaint(null);
      setVerificationFeedback("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to verify work");
    }
  };

  return (
    <div className="rounded-2xl border border-cyan-400/10 bg-[#09111f]/80 p-7 backdrop-blur-md">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-base font-semibold text-[#e6f1ff]">
          My Issues
        </h2>
        <button className="rounded-xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm font-medium text-cyan-300 hover:bg-cyan-400/15">
          Export History
        </button>
      </div>

      {error ? (
        <div className="rounded-xl bg-[#2f151b]/70 border border-red-500/10 p-6 text-sm text-red-300">
          {error}
        </div>
      ) : loading ? (
        <div className="rounded-xl bg-[#0b1628]/70 border border-cyan-400/10 p-6 text-sm text-cyan-200">
          Loading my issues...
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-cyan-400/10">
                <th className="pb-3 text-left text-xs font-medium tracking-wide text-[#7c8aa5]">
                  Issue ID
                </th>
                <th className="pb-3 text-left text-xs font-medium tracking-wide text-[#7c8aa5]">
                  Category
                </th>
                <th className="pb-3 text-left text-xs font-medium tracking-wide text-[#7c8aa5]">
                  Location
                </th>
                <th className="pb-3 text-left text-xs font-medium tracking-wide text-[#7c8aa5]">
                  Reported
                </th>
                <th className="pb-3 text-right text-xs font-medium tracking-wide text-[#7c8aa5]">
                  Status
                </th>
                <th className="pb-3 text-right text-xs font-medium tracking-wide text-[#7c8aa5]">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {complaints.map((complaint, i) => (
                <tr
                  key={complaint._id}
                  className={i < complaints.length - 1 ? "border-b border-cyan-400/10" : ""}
                >
                  <td className="py-4 text-sm font-medium text-[#60a5fa]">{complaint._id.slice(-6)}</td>
                  <td className="py-4 text-sm text-[#e6f1ff]">{complaint.category}</td>
                  <td className="py-4 text-sm text-[#7c8aa5]">{complaint.address || "Unknown"}</td>
                  <td className="py-4 text-sm text-[#7c8aa5]">{new Date(complaint.createdAt).toLocaleDateString()}</td>
                  <td className="py-4 text-right">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${statusStyles[complaint.status]}`}
                    >
                      {complaint.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-4 text-right space-x-2">
                    {complaint.status === "WORK_COMPLETED" ? (
                      <button
                        onClick={() => setVerifyingComplaint(complaint)}
                        className="rounded-lg px-3 py-1 text-xs font-medium bg-cyan-500/15 text-cyan-400 border border-cyan-400/20 hover:bg-cyan-500/25"
                      >
                        Verify Work
                      </button>
                    ) : (
                      <button
                        onClick={() => handleEditClick(complaint)}
                        className={`rounded-lg px-3 py-1 text-xs font-medium transition-colors ${
                          canEditComplaint(complaint)
                            ? "bg-blue-500/15 text-blue-400 border border-blue-400/20 hover:bg-blue-500/25"
                            : "bg-gray-500/15 text-gray-400 border border-gray-400/20 cursor-not-allowed"
                        }`}
                        disabled={!canEditComplaint(complaint)}
                      >
                        Edit
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Edit Modal */}
      {editingComplaint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-cyan-400/20 bg-[#09111f]/95 p-6 backdrop-blur-md">
            <h3 className="mb-4 text-lg font-semibold text-[#e6f1ff]">Edit Complaint</h3>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#7c8aa5] mb-1">Title</label>
                <input
                  type="text"
                  value={editForm.title}
                  onChange={(e) => setEditForm({...editForm, title: e.target.value})}
                  className="w-full rounded-lg border border-cyan-400/20 bg-[#0b1628]/70 px-3 py-2 text-sm text-[#e6f1ff] placeholder-[#7c8aa5] focus:border-cyan-400/50 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#7c8aa5] mb-1">Description</label>
                <textarea
                  value={editForm.description}
                  onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                  className="w-full rounded-lg border border-cyan-400/20 bg-[#0b1628]/70 px-3 py-2 text-sm text-[#e6f1ff] placeholder-[#7c8aa5] focus:border-cyan-400/50 focus:outline-none"
                  rows="3"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#7c8aa5] mb-1">Category</label>
                <select
                  value={editForm.category}
                  onChange={(e) => setEditForm({...editForm, category: e.target.value})}
                  className="w-full rounded-lg border border-cyan-400/20 bg-[#0b1628]/70 px-3 py-2 text-sm text-[#e6f1ff] focus:border-cyan-400/50 focus:outline-none"
                  required
                >
                  <option value="">Select Category</option>
                  <option value="Road">Road</option>
                  <option value="Water">Water</option>
                  <option value="Electricity">Electricity</option>
                  <option value="Sanitation">Sanitation</option>
                  <option value="Public Safety">Public Safety</option>
                  <option value="Environment">Environment</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#7c8aa5] mb-1">Priority</label>
                <select
                  value={editForm.priority}
                  onChange={(e) => setEditForm({...editForm, priority: e.target.value})}
                  className="w-full rounded-lg border border-cyan-400/20 bg-[#0b1628]/70 px-3 py-2 text-sm text-[#e6f1ff] focus:border-cyan-400/50 focus:outline-none"
                  required
                >
                  <option value="">Select Priority</option>
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#7c8aa5] mb-1">Address</label>
                <input
                  type="text"
                  value={editForm.address}
                  onChange={(e) => setEditForm({...editForm, address: e.target.value})}
                  className="w-full rounded-lg border border-cyan-400/20 bg-[#0b1628]/70 px-3 py-2 text-sm text-[#e6f1ff] placeholder-[#7c8aa5] focus:border-cyan-400/50 focus:outline-none"
                  required
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 rounded-lg bg-cyan-500/20 border border-cyan-400/30 px-4 py-2 text-sm font-medium text-cyan-300 hover:bg-cyan-500/30 transition-colors"
                >
                  Update Complaint
                </button>
                <button
                  type="button"
                  onClick={handleEditCancel}
                  className="flex-1 rounded-lg border border-gray-400/20 bg-gray-500/10 px-4 py-2 text-sm font-medium text-gray-300 hover:bg-gray-500/20 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Verification Modal */}
      {verifyingComplaint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-cyan-400/20 bg-[#09111f]/95 p-6 backdrop-blur-md">
            <h3 className="mb-4 text-lg font-semibold text-[#e6f1ff]">Verify Work Completion</h3>
            <div className="mb-6 rounded-lg bg-[#0b1628]/50 border border-cyan-400/10 p-4">
              <p className="text-sm text-[#7c8aa5] mb-3">Was your issue resolved?</p>
              <div className="space-y-2">
                <p className="text-xs text-[#7c8aa5]">• Staff uploaded proof images</p>
                <p className="text-xs text-[#7c8aa5]">• Work location verified via GPS</p>
              </div>
            </div>
            <textarea
              value={verificationFeedback}
              onChange={(e) => setVerificationFeedback(e.target.value)}
              placeholder="Add your feedback (optional)..."
              className="w-full rounded-lg border border-cyan-400/20 bg-[#0b1628]/70 px-3 py-2 text-sm text-[#e6f1ff] placeholder-[#7c8aa5] focus:border-cyan-400/50 focus:outline-none mb-4"
              rows="3"
            />
            <div className="flex gap-3">
              <button
                onClick={() => handleVerifyWork(true)}
                className="flex-1 rounded-lg bg-green-500/20 border border-green-400/30 px-4 py-2 text-sm font-medium text-green-300 hover:bg-green-500/30 transition-colors"
              >
                ✓ Yes, Resolved
              </button>
              <button
                onClick={() => handleVerifyWork(false)}
                className="flex-1 rounded-lg bg-red-500/20 border border-red-400/30 px-4 py-2 text-sm font-medium text-red-300 hover:bg-red-500/30 transition-colors"
              >
                ✗ No, Reopen
              </button>
            </div>
            <button
              onClick={() => setVerifyingComplaint(null)}
              className="mt-3 w-full rounded-lg border border-gray-400/20 bg-gray-500/10 px-4 py-2 text-sm font-medium text-gray-300 hover:bg-gray-500/20 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Time Expired Popup */}
      {showTimeExpiredPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl border border-red-400/20 bg-[#09111f]/95 p-6 backdrop-blur-md">
            <div className="text-center">
              <div className="mb-4 text-red-400">
                <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="mb-2 text-lg font-semibold text-[#e6f1ff]">Time Limit Exceeded</h3>
              <p className="text-sm text-[#7c8aa5] mb-6">
                Complaints can only be edited within 3 minutes of creation.
              </p>
              <button
                onClick={() => setShowTimeExpiredPopup(false)}
                className="w-full rounded-lg bg-red-500/20 border border-red-400/30 px-4 py-2 text-sm font-medium text-red-300 hover:bg-red-500/30 transition-colors"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyIssues;

