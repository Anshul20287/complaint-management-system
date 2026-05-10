import React from 'react';

const announcements = [
  { title: 'Water supply disruption', date: 'Today' },
  { title: 'Road maintenance notice', date: 'Tomorrow' },
];

const Announcements = () => {
  return (
    <div className="rounded-2xl border border-cyan-400/10 bg-[#09111f]/80 p-7 backdrop-blur-md">
      <h2 className="mb-5 text-base font-semibold text-[#e6f1ff]">Announcements</h2>

      <div className="space-y-3">
        {announcements.map((a, i) => (
          <div
            key={i}
            className="p-4 rounded-xl bg-[#0b1628]/70 border border-cyan-400/10"
          >
            <p className="text-sm font-medium text-[#e6f1ff]">{a.title}</p>
            <p className="text-xs text-[#7c8aa5] mt-1">{a.date}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Announcements;