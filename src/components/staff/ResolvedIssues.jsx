import React from "react";
import { issueQueue } from "../../data/staffData";

const resolvedIssues = [
  ...issueQueue.filter((issue) => issue.status === "Resolved"),
  {
    id: "#4776",
    type: "Streetlight",
    location: "Borivali",
    priority: "Low",
    status: "Resolved",
    resolvedDate: "2 days ago",
  },
  {
    id: "#4765",
    type: "Water Leakage",
    location: "Andheri W",
    priority: "High",
    status: "Resolved",
    resolvedDate: "3 days ago",
  },
  {
    id: "#4752",
    type: "Garbage",
    location: "Malad",
    priority: "Medium",
    status: "Resolved",
    resolvedDate: "5 days ago",
  },
];

const ResolvedIssues = () => {
  return (
    <div className="rounded-2xl border border-cyan-400/10 bg-[#09111f]/70 p-7 backdrop-blur-sm">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-base font-semibold text-[#e6f1ff]">
          Resolved Issues
        </h2>
        <div className="flex gap-3">
          <button className="rounded-xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm font-medium text-cyan-300 hover:bg-cyan-400/15 transition-colors">
            This Month
          </button>
          <button className="rounded-xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm font-medium text-cyan-300 hover:bg-cyan-400/15 transition-colors">
            Export
          </button>
        </div>
      </div>

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
                Priority
              </th>
              <th className="pb-3 text-left text-xs font-medium tracking-wide text-[#7c8aa5]">
                Resolved
              </th>
            </tr>
          </thead>

          <tbody>
            {resolvedIssues.map((issue, i) => (
              <tr
                key={issue.id}
                className={`hover:bg-cyan-400/5 transition-colors ${
                  i < resolvedIssues.length - 1
                    ? "border-b border-cyan-400/10"
                    : ""
                }`}
              >
                <td className="py-4 text-sm font-medium text-[#19e6d2]">
                  {issue.id}
                </td>
                <td className="py-4 text-sm text-[#e6f1ff]">{issue.type}</td>
                <td className="py-4 text-sm text-[#7c8aa5]">
                  {issue.location}
                </td>
                <td className="py-4">
                  <span
                    className={`inline-flex items-center border rounded-full px-2.5 py-1 text-xs font-medium ${
                      issue.priority === "High"
                        ? "bg-red-500/15 text-red-400 border-red-400/10"
                        : issue.priority === "Medium"
                          ? "bg-amber-400/10 text-amber-300 border-amber-300/10"
                          : "bg-emerald-500/15 text-emerald-400 border-emerald-400/10"
                    }`}
                  >
                    {issue.priority}
                  </span>
                </td>
                <td className="py-4 text-sm text-[#7c8aa5]">
                  {issue.resolvedDate || "Today"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="rounded-xl bg-emerald-500/10 border border-emerald-400/20 p-4">
          <p className="text-xs text-[#7c8aa5] mb-1">Total Resolved</p>
          <p className="text-2xl font-bold text-emerald-400">
            {resolvedIssues.length}
          </p>
        </div>
        <div className="rounded-xl bg-cyan-500/10 border border-cyan-400/20 p-4">
          <p className="text-xs text-[#7c8aa5] mb-1">Avg. Resolution Time</p>
          <p className="text-2xl font-bold text-cyan-300">18h</p>
        </div>
      </div>
    </div>
  );
};

export default ResolvedIssues;
