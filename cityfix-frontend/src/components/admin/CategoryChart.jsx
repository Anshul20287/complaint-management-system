import React from 'react';

const colors = [
  'bg-cyan-400',
  'bg-violet-400',
  'bg-emerald-400',
  'bg-amber-300',
  'bg-pink-400',
  'bg-blue-400'
];

const CategoryChart = ({ categoryStats = [] }) => {
  const total = categoryStats.reduce((sum, cat) => sum + cat.count, 0);

  return (
    <div className="rounded-2xl border border-cyan-400/10 bg-[#09111f]/80 p-7 backdrop-blur-md">
      <h2 className="mb-6 text-base font-semibold text-[#e6f1ff]">
        Issues by Category
      </h2>

      {categoryStats.length === 0 ? (
        <p className="text-sm text-[#7c8aa5]">No category data available.</p>
      ) : (
        <div className="flex flex-col gap-5">
          {categoryStats.map((cat, index) => {
            const pct = total ? Math.round((cat.count / total) * 100) : 0;

            return (
              <div key={cat._id} className="flex items-center gap-3">
                <span className="w-36 shrink-0 text-sm text-[#e6f1ff] font-medium">
                  {cat._id}
                </span>

                <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/[0.06]">
                  <div
                    className={`h-full rounded-full ${colors[index % colors.length]}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>

                <span className="w-12 text-right text-xs text-[#7c8aa5] font-medium">
                  {pct}%
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CategoryChart;