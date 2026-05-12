import React from "react";

const statusStyles = {
  OPEN: "bg-red-500/15 text-red-400 border border-red-400/10",
  RESOLVED: "bg-emerald-400/10 text-emerald-300 border border-emerald-300/10",
  IN_PROGRESS: "bg-amber-400/10 text-amber-300 border border-amber-300/10",
};

const RecentIssues = ({ issues }) => {
  return (
    <div className="rounded-2xl border border-cyan-400/10 bg-[#09111f]/80 p-7 backdrop-blur-md">
      <h2 className="mb-5 text-base font-semibold text-[#e6f1ff]">
        My Recent Issues
      </h2>

      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-cyan-400/10">
            <th className="pb-3 text-left text-xs font-medium tracking-wide text-[#7c8aa5]">
              #ID
            </th>
            <th className="pb-3 text-left text-xs font-medium tracking-wide text-[#7c8aa5]">
              Type · Location
            </th>
            <th className="pb-3 text-right text-xs font-medium tracking-wide text-[#7c8aa5]">
              Status
            </th>
          </tr>
        </thead>

        <tbody>
          {issues.map((issue, i) => (
            <tr
              key={issue._id}
              className={i < issues.length - 1 ? "border-b border-cyan-400/10" : ""}
            >
              <td className="py-4">
                <span className="cursor-pointer text-sm font-medium text-[#60a5fa] hover:underline">
                  {issue._id.slice(-6)}
                </span>
              </td>

              <td className="py-4 text-sm">
                <span className="font-medium text-[#e6f1ff]">{issue.category}</span>
                <span className="text-xs text-[#7c8aa5]"> · {issue.address || "Unknown"}</span>
              </td>

              <td className="py-4 text-right">
                <span
                  className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${statusStyles[issue.status]}`}
                >
                  {issue.status.replace('_', ' ')}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RecentIssues;