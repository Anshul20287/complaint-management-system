import React, { useState } from "react";
import { issueQueue } from "../../data/staffData";

const statusStyles = {
  'Open':        'bg-red-500/15 text-red-400',
  'In Progress': 'bg-amber-400/10 text-amber-300',
  'Resolved':    'bg-emerald-500/10 text-emerald-400',
};

const priorityStyles = {
  'High':   'bg-red-500/15 text-red-400 font-semibold',
  'Medium': 'bg-amber-400/10 text-amber-300',
  'Low':    'bg-emerald-500/10 text-emerald-400',
};

const statusOptions = ['Open', 'In Progress', 'Resolved'];

const IssueQueue = () => {
  const [issues, setIssues] = useState(issueQueue);
  const [modal, setModal] = useState(null); // { index, status }

  const openModal = (index) => {
    setModal({ index, status: issues[index].status });
  };

  const saveStatus = () => {
    setIssues(prev =>
      prev.map((issue, i) =>
        i === modal.index ? { ...issue, status: modal.status } : issue
      )
    );
    setModal(null);
  };

  return (
    <>
      <div className="rounded-2xl border border-cyan-400/10 bg-[#09111f]/70 p-6 backdrop-blur-sm">
        <h2 className="mb-4 text-base font-semibold text-[#e6f1ff]">
          Assigned Issues Queue
        </h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-cyan-400/10">
              {["#ID", "Type · Location", "Priority", "Status", ""].map((h) => (
                <th key={h} className="pb-3 text-left text-xs font-medium text-[#7c8aa5] tracking-wide">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {issues.map((issue, i) => (
              <tr key={issue.id} className={i < issues.length - 1 ? "border-b border-cyan-400/10" : ""}>
                <td className="py-3 text-sm font-medium text-[#19e6d2] cursor-pointer hover:underline transition-colors">
                  {issue.id}
                </td>
                <td className="py-3 text-sm">
                  <span className="text-[#e6f1ff]">{issue.type}</span>
                  <span className="text-[#7c8aa5]"> · {issue.location}</span>
                </td>
                <td className="py-3">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${priorityStyles[issue.priority]}`}>
                    {issue.priority}
                  </span>
                </td>
                <td className="py-3">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${statusStyles[issue.status]}`}>
                    {issue.status}
                  </span>
                </td>
                <td className="py-3">
                  <button
                    onClick={() => openModal(i)}
                    className="rounded-lg border border-cyan-400/10 bg-cyan-400/5 px-3 py-1.5 text-xs text-[#7c8aa5] transition-all hover:border-cyan-400/30 hover:bg-cyan-400/10 hover:text-[#e6f1ff] cursor-pointer font-medium"
                  >
                    {issue.status === "Resolved" ? "View" : "Update"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Update Status Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-[340px] rounded-2xl border border-cyan-400/10 bg-[#09111f]/95 p-6 shadow-2xl backdrop-blur-lg">
            <h3 className="mb-2 text-base font-semibold text-[#e6f1ff]">
              Update Issue {issues[modal.index].id}
            </h3>
            <p className="mb-5 text-sm text-[#7c8aa5]">
              {issues[modal.index].type} · {issues[modal.index].location}
            </p>

            <label className="mb-3 block text-xs font-medium uppercase tracking-wider text-[#7c8aa5]">
              Status
            </label>
            <div className="mb-6 flex flex-col gap-2.5">
              {statusOptions.map((opt) => (
                <button
                  key={opt}
                  onClick={() => setModal((prev) => ({ ...prev, status: opt }))}
                  className={`flex items-center gap-2.5 rounded-lg border px-3 py-2.5 text-left text-sm transition-all cursor-pointer font-medium ${
                    modal.status === opt
                      ? "border-[#19e6d2] bg-emerald-500/10 text-[#19e6d2]"
                      : "border-cyan-400/10 bg-cyan-400/5 text-[#7c8aa5] hover:border-cyan-400/30 hover:bg-cyan-400/10"
                  }`}
                >
                  <span
                    className={`h-2 w-2 shrink-0 rounded-full ${
                      opt === "Open"
                        ? "bg-red-400"
                        : opt === "In Progress"
                          ? "bg-amber-300"
                          : "bg-emerald-400"
                    }`}
                  />
                  {opt}
                </button>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setModal(null)}
                className="flex-1 rounded-lg border border-cyan-400/10 py-2.5 text-sm font-medium text-[#7c8aa5] transition-all hover:border-cyan-400/30 hover:bg-cyan-400/5 hover:text-[#e6f1ff] cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={saveStatus}
                className="flex-1 rounded-lg bg-gradient-to-r from-cyan-500 to-cyan-400 py-2.5 text-sm font-semibold text-[#030712] transition-all hover:shadow-lg hover:shadow-cyan-500/30 cursor-pointer"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default IssueQueue;