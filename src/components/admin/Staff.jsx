import React from 'react';

const staff = [
  { name: 'Ravi S.', zone: 'North', active: 8 },
  { name: 'Priya K.', zone: 'West', active: 5 },
];

const Staff = () => {
  return (
    <div className="rounded-2xl border border-cyan-400/10 bg-[#09111f]/80 p-7 backdrop-blur-md">
      <h2 className="mb-5 text-base font-semibold text-[#e6f1ff]">Staff</h2>

      <div className="space-y-3">
        {staff.map((s, i) => (
          <div
            key={i}
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
    </div>
  );
};

export default Staff;