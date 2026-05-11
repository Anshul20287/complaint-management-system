import React from 'react';

const Citizens = ({ citizens = [] }) => {
  return (
    <div className="rounded-2xl border border-cyan-400/10 bg-[#09111f]/80 p-7 backdrop-blur-md">
      <h2 className="mb-5 text-base font-semibold text-[#e6f1ff]">Citizens</h2>

      {citizens.length === 0 ? (
        <p className="text-sm text-[#7c8aa5]">No citizen data available.</p>
      ) : (
        <div className="space-y-3">
          {citizens.map((c) => (
            <div
              key={c.id || c.email}
              className="flex justify-between items-center p-4 rounded-xl bg-[#0b1628]/70 border border-cyan-400/10"
            >
              <div className="min-w-0">
                <p className="text-sm font-medium text-[#e6f1ff] truncate">{c.name}</p>
                <p className="text-xs text-[#7c8aa5] truncate">{c.email}</p>
              </div>
              <span className="text-xs text-[#7c8aa5]">
                {c.complaints} complaints
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Citizens;