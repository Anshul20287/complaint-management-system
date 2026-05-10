import React from 'react';
import { staffList } from '../../data/adminData';

const StaffOverview = () => (
  <div className="rounded-2xl border border-cyan-400/10 bg-[#09111f]/80 p-7 backdrop-blur-md">
    <h2 className="mb-5 text-base font-semibold text-[#e6f1ff]">Staff Overview</h2>

    <table className="w-full border-collapse">
      <thead>
        <tr className="border-b border-cyan-400/10">
          {['Name', 'Zone', 'Open', 'Resolved'].map((h) => (
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
        {staffList.map((staff, i) => (
          <tr
            key={staff.name}
            className={i < staffList.length - 1 ? 'border-b border-cyan-400/10' : ''}
          >
            <td className="py-4 text-sm font-medium text-[#e6f1ff]">
              {staff.name}
            </td>
            <td className="py-4 text-sm text-[#7c8aa5]">{staff.zone}</td>
            <td className="py-4 text-sm font-semibold text-red-400">
              {staff.open}
            </td>
            <td className="py-4 text-sm font-semibold text-emerald-400">
              {staff.resolved}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default StaffOverview;