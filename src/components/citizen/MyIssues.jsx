import React from "react";

const issues = [
  {
    id: "#4821",
    type: "Pothole / Road Damage",
    location: "Andheri West",
    date: "2 hours ago",
    status: "Open",
  },
  {
    id: "#4790",
    type: "Streetlight Outage",
    location: "Bandra East",
    date: "Yesterday",
    status: "Resolved",
  },
  {
    id: "#4755",
    type: "Garbage / Waste",
    location: "Kurla",
    date: "3 days ago",
    status: "In Progress",
  },
  {
    id: "#4702",
    type: "Water Leakage",
    location: "Dadar",
    date: "5 days ago",
    status: "Resolved",
  },
];

const statusStyles = {
  Open: "bg-red-500/15 text-red-400 border border-red-400/10",
  Resolved: "bg-emerald-400/10 text-emerald-300 border border-emerald-300/10",
  "In Progress": "bg-amber-400/10 text-amber-300 border border-amber-300/10",
};

const MyIssues = () => {
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
            </tr>
          </thead>

          <tbody>
            {issues.map((issue, i) => (
              <tr
                key={issue.id}
                className={i < issues.length - 1 ? "border-b border-cyan-400/10" : ""}
              >
                <td className="py-4 text-sm font-medium text-[#60a5fa]">{issue.id}</td>
                <td className="py-4 text-sm text-[#e6f1ff]">{issue.type}</td>
                <td className="py-4 text-sm text-[#7c8aa5]">{issue.location}</td>
                <td className="py-4 text-sm text-[#7c8aa5]">{issue.date}</td>
                <td className="py-4 text-right">
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${statusStyles[issue.status]}`}
                  >
                    {issue.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyIssues;