import React from 'react';

const Staff = ({ staff = [] }) => {
  return (
    <div className="rounded-2xl border border-cyan-400/10 bg-[#09111f]/80 p-7 backdrop-blur-md">
      <h2 className="mb-5 text-base font-semibold text-[#e6f1ff]">Staff</h2>

      {staff.length === 0 ? (
        <p className="text-sm text-[#7c8aa5]">No staff data available.</p>
      ) : (
        <div className="space-y-3">
          {staff.map((s) => (
            <div
              key={s.id || s.name}
              className="flex justify-between items-center p-4 rounded-xl bg-[#0b1628]/70 border border-cyan-400/10"
            >
              <div>
                <p className="text-sm font-medium text-[#e6f1ff]">{s.name}</p>
                <p className="text-xs text-[#7c8aa5]">{s.zone}</p>
              </div>

              <span className="text-xs font-medium text-cyan-300">
                {s.active} active
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Staff;