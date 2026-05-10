import React from "react";
import { zoneAreas } from "../../data/staffData";

const ZoneMap = () => (
  <div className="rounded-2xl border border-cyan-400/10 bg-[#09111f]/70 p-6 backdrop-blur-sm">
    <h2 className="mb-4 text-base font-semibold text-[#e6f1ff]">My Zone · North</h2>

    {/* Map placeholder */}
    <div className="mb-5 flex h-[120px] flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-cyan-400/20 bg-cyan-400/5">
      <span className="text-2xl">📍</span>
      <span className="text-xs text-[#7c8aa5]">Field map loading...</span>
    </div>

    {/* Zone list */}
    <div className="flex flex-col">
      {zoneAreas.map((area, i) => (
        <div
          key={area.name}
          className={`flex items-center justify-between py-2.5 px-2 -mx-2 rounded-lg transition-colors hover:bg-cyan-400/5 ${
            i < zoneAreas.length - 1 ? "border-b border-cyan-400/10" : ""
          }`}
        >
          <div className="flex items-center gap-2.5">
            <span className={`h-2 w-2 shrink-0 rounded-full ${area.dot}`} />
            <span className="text-sm text-[#e6f1ff]">{area.name}</span>
          </div>
          <span className={`text-xs font-medium ${area.color}`}>{area.label}</span>
        </div>
      ))}
    </div>
  </div>
);

export default ZoneMap;