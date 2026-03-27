import React from 'react';
import { categories } from '../../data/adminData';

const CategoryChart = () => (
  <div className="rounded-2xl border border-cyan-400/10 bg-[#09111f]/80 p-7 backdrop-blur-md">
    <h2 className="mb-6 text-base font-semibold text-[#e6f1ff]">
      Issues by Category
    </h2>

    <div className="flex flex-col gap-5">
      {categories.map((cat) => (
        <div key={cat.label} className="flex items-center gap-3">
          <span className="w-24 shrink-0 text-sm text-[#e6f1ff] font-medium">
            {cat.label}
          </span>

          <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/[0.06]">
            <div
              className={`h-full rounded-full ${cat.color}`}
              style={{ width: `${cat.pct}%` }}
            />
          </div>

          <span className="w-10 text-right text-xs text-[#7c8aa5] font-medium">
            {cat.pct}%
          </span>
        </div>
      ))}
    </div>
  </div>
);

export default CategoryChart;