import React from "react";
import { issueQueue } from "../../data/staffData";

const priorityStyles = {
  High: "bg-red-500/15 text-red-400 border border-red-400/10",
  Medium: "bg-amber-400/10 text-amber-300 border border-amber-300/10",
  Low: "bg-emerald-500/15 text-emerald-400 border border-emerald-400/10",
};

const statusStyles = {
  Open: "bg-red-500/15 text-red-400 border border-red-400/10",
  "In Progress":
    "bg-amber-400/10 text-amber-300 border border-amber-300/10",
  Resolved:
    "bg-emerald-500/15 text-emerald-400 border border-emerald-400/10",
};

const AssignedIssues = () => {
  return (
    <div className="rounded-2xl border border-cyan-400/10 bg-[#09111f]/70 p-7 backdrop-blur-sm">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-base font-semibold text-[#e6f1ff]">
          All Assigned Issues
        </h2>
        <button className="rounded-xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm font-medium text-cyan-300 hover:bg-cyan-400/15 transition-colors">
          Export List
        </button>
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
              <th className="pb-3 text-right text-xs font-medium tracking-wide text-[#7c8aa5]">
                Status
              </th>
            </tr>
          </thead>

          <tbody>
            {issueQueue.map((issue, i) => (
              <tr
                key={issue.id}
                className={`hover:bg-cyan-400/5 transition-colors ${
                  i < issueQueue.length - 1 ? "border-b border-cyan-400/10" : ""
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
                      priorityStyles[issue.priority]
                    }`}
                  >
                    {issue.priority}
                  </span>
                </td>
                <td className="py-4 text-right">
                  <span
                    className={`inline-flex items-center border rounded-full px-2.5 py-1 text-xs font-medium ${
                      statusStyles[issue.status]
                    }`}
                  >
                    {issue.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex items-center justify-center rounded-xl bg-cyan-400/5 border border-cyan-400/10 py-4 text-sm text-[#7c8aa5]">
        Showing {issueQueue.length} assigned issues
      </div>
    </div>
  );
};

export default AssignedIssues;
