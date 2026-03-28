import React, { useState } from "react";
import { checklist as initialChecklist } from "../../data/staffData";

const Checklist = () => {
  const [items, setItems] = useState(initialChecklist);

  const toggle = (id) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, done: !item.done } : item))
    );
  };

  const doneCount = items.filter((i) => i.done).length;

  return (
    <div className="rounded-2xl border border-cyan-400/10 bg-[#09111f]/70 p-6 backdrop-blur-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-base font-semibold text-[#e6f1ff]">Today's Checklist</h2>
        <span className="text-xs text-[#7c8aa5]">
          {doneCount}/{items.length} done
        </span>
      </div>

      {/* Progress bar */}
      <div className="mb-5 h-1 overflow-hidden rounded-full bg-cyan-400/10">
        <div
          className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-cyan-300 transition-all duration-500"
          style={{ width: `${(doneCount / items.length) * 100}%` }}
        />
      </div>

      <div className="flex flex-col">
        {items.map((item, i) => (
          <div
            key={item.id}
            className={`flex cursor-pointer items-start gap-3 py-3 group transition-colors hover:bg-cyan-400/5 px-2 -mx-2 rounded-lg ${
              i < items.length - 1 ? "border-b border-cyan-400/10" : ""
            }`}
            onClick={() => toggle(item.id)}
          >
            {/* Checkbox */}
            <div
              className={`mt-1 h-4 w-4 shrink-0 flex items-center justify-center rounded-[4px] border transition-all ${
                item.done
                  ? "border-[#19e6d2] bg-emerald-500/20"
                  : "border-cyan-400/30 group-hover:border-cyan-400/50"
              }`}
            >
              {item.done && (
                <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                  <path
                    d="M1 3.5L3.5 6L8 1"
                    stroke="#19e6d2"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <p
                className={`text-sm leading-snug transition-all ${
                  item.done ? "line-through text-[#7c8aa5]" : "text-[#e6f1ff]"
                }`}
              >
                {item.task}
              </p>
              <p className="mt-1 text-xs text-[#7c8aa5]">{item.meta}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Checklist;