import React from 'react';

const dummyIssues = [
  { id: '#4821', type: 'Pothole', area: 'Andheri', status: 'Open' },
  { id: '#4822', type: 'Garbage', area: 'Kurla', status: 'Resolved' },
  { id: '#4823', type: 'Streetlight', area: 'Dadar', status: 'In Progress' },
];

const statusStyles = {
  Open: 'bg-red-500/15 text-red-400 border border-red-400/10',
  Resolved: 'bg-emerald-400/10 text-emerald-300 border border-emerald-300/10',
  'In Progress': 'bg-amber-400/10 text-amber-300 border border-amber-300/10',
};

const AllIssues = () => {
  return (
    <div className="rounded-2xl border border-cyan-400/10 bg-[#09111f]/80 p-7 backdrop-blur-md">
      <h2 className="mb-5 text-base font-semibold text-[#e6f1ff]">All Issues</h2>

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
          </tr>
        </thead>

        <tbody>
          {dummyIssues.map((issue, i) => (
            <tr
              key={issue.id}
              className={i < dummyIssues.length - 1 ? 'border-b border-cyan-400/10' : ''}
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
};

export default AllIssues;