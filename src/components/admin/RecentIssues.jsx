import React from 'react';
import { recentIssues } from '../../data/adminData';

const statusStyles = {
  Open: 'bg-red-500/12 text-red-300 border border-red-400/10',
  'In Progress': 'bg-amber-400/12 text-amber-200 border border-amber-300/10',
  Resolved: 'bg-emerald-500/12 text-emerald-300 border border-emerald-400/10',
  Escalated: 'bg-violet-500/12 text-violet-300 border border-violet-400/10',
};

const RecentIssues = () => (
  <div className="rounded-2xl border border-cyan-400/10 bg-[#09111f]/80 p-7 backdrop-blur-md">
    <h2 className="mb-5 text-base font-semibold text-[#e6f1ff]">Recent Issues</h2>

    <table className="w-full border-collapse">
      <thead>
        <tr className="border-b border-cyan-400/10">
          {['#ID', 'Type · Area', 'Assigned', 'Status'].map((h) => (
            <th
              key={h}
              className="pb-3 text-left text-xs font-medium tracking-wide text-[#7c8aa5]"
            >
              {h}
            </th>
          ))}
        </tr>
      </thead>

      <tbody>
        {recentIssues.map((issue, i) => (
          <tr
            key={issue.id}
            className={i < recentIssues.length - 1 ? 'border-b border-cyan-400/10' : ''}
          >
            <td className="py-4">
              <span className="cursor-pointer text-sm font-medium text-[#60a5fa] hover:underline">
                {issue.id}
              </span>
            </td>

            <td className="py-4 text-sm">
              <span className="font-medium text-[#e6f1ff]">{issue.type}</span>
              <span className="text-xs text-[#7c8aa5]"> · {issue.area}</span>
            </td>

            <td className="py-4 text-sm text-[#e6f1ff]">{issue.assigned}</td>

            <td className="py-4">
              <span
                className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${statusStyles[issue.status]}`}
              >
                {issue.status}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default RecentIssues;