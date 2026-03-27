import React from 'react';

const mapIssues = [
  { id: '#4821', title: 'Pothole on SV Road', area: 'Andheri West', color: 'bg-red-400', status: 'Open' },
  { id: '#4790', title: 'Broken Streetlight', area: 'Bandra East', color: 'bg-amber-400', status: 'In Progress' },
  { id: '#4702', title: 'Water Leakage Fixed', area: 'Dadar', color: 'bg-emerald-400', status: 'Resolved' },
  { id: '#4744', title: 'Garbage Overflow', area: 'Kurla', color: 'bg-cyan-400', status: 'Open' },
];

const statusStyles = {
  Open: 'text-red-400',
  Resolved: 'text-emerald-300',
  'In Progress': 'text-amber-300',
};

const MapView = () => {
  return (
    <div className="rounded-2xl border border-cyan-400/10 bg-[#09111f]/80 p-7 backdrop-blur-md">
      <h2 className="mb-6 text-base font-semibold text-[#e6f1ff]">
        Live Map View
      </h2>

      <div className="mb-6 rounded-2xl border border-cyan-400/10 bg-[#08101d] p-5">
        <div className="mb-3 text-xs uppercase tracking-[0.2em] text-[#7c8aa5]">
          Live City Map — Mumbai
        </div>

        <div className="relative h-[340px] overflow-hidden rounded-2xl border border-cyan-400/10 bg-[linear-gradient(to_right,rgba(34,211,238,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(34,211,238,0.06)_1px,transparent_1px)] bg-[size:40px_40px]">
          <div className="absolute left-[18%] top-[42%] h-4 w-4 rounded-full border-2 border-emerald-400 shadow-[0_0_20px_rgba(52,211,153,0.7)]" />
          <div className="absolute left-[52%] top-[28%] h-4 w-4 rounded-full border-2 border-amber-400 shadow-[0_0_20px_rgba(251,191,36,0.7)]" />
          <div className="absolute left-[72%] top-[18%] h-4 w-4 rounded-full border-2 border-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.7)]" />
          <div className="absolute left-[30%] top-[15%] h-4 w-4 rounded-full border-2 border-red-400 shadow-[0_0_20px_rgba(248,113,113,0.7)]" />
        </div>
      </div>

      <div className="space-y-3">
        {mapIssues.map((issue) => (
          <div
            key={issue.id}
            className="flex items-center justify-between rounded-xl border border-cyan-400/10 bg-[#0b1628]/70 px-4 py-4"
          >
            <div className="flex items-start gap-3">
              <span className={`mt-2 h-2.5 w-2.5 rounded-full ${issue.color}`} />
              <div>
                <p className="font-medium text-[#e6f1ff]">{issue.title}</p>
                <p className="text-sm text-[#7c8aa5]">
                  {issue.area} · {issue.id}
                </p>
              </div>
            </div>

            <span className={`text-sm font-medium ${statusStyles[issue.status]}`}>
              {issue.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MapView;