import React from 'react';

const citizens = [
  { name: 'Rahul Sharma', complaints: 5 },
  { name: 'Priya Verma', complaints: 2 },
  { name: 'Amit Singh', complaints: 7 },
];

const Citizens = () => {
  return (
    <div className="rounded-2xl border border-cyan-400/10 bg-[#09111f]/80 p-7 backdrop-blur-md">
      <h2 className="mb-5 text-base font-semibold text-[#e6f1ff]">Citizens</h2>

      <div className="space-y-3">
        {citizens.map((c, i) => (
          <div
            key={i}
            className="flex justify-between items-center p-4 rounded-xl bg-[#0b1628]/70 border border-cyan-400/10"
          >
            <span className="text-sm font-medium text-[#e6f1ff]">{c.name}</span>
            <span className="text-xs text-[#7c8aa5]">
              {c.complaints} complaints
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Citizens;