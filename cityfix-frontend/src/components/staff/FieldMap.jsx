import React, { useState } from "react";
import { zoneAreas } from "../../data/staffData";

const FieldMap = () => {
  const [selectedZone, setSelectedZone] = useState(null);

  return (
    <div className="space-y-6">
      {/* Map Section */}
      <div className="rounded-2xl border border-cyan-400/10 bg-[#09111f]/70 p-7 backdrop-blur-sm">
        <h2 className="mb-4 text-base font-semibold text-[#e6f1ff]">
          My Zone · North
        </h2>

        {/* Map Container */}
        <div className="mb-6 flex h-[400px] flex-col items-center justify-center rounded-xl border-2 border-dashed border-cyan-400/20 bg-gradient-to-br from-cyan-500/5 to-emerald-500/5">
          <div className="text-center">
            <span className="mb-3 block text-5xl">📍</span>
            <p className="text-base text-[#e6f1ff] font-semibold mb-2">
              Interactive Field Map
            </p>
            <p className="text-sm text-[#7c8aa5]">
              Click on zones below to view details
            </p>
          </div>
        </div>

        {/* Zone Grid */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {zoneAreas.map((area) => (
            <button
              key={area.name}
              onClick={() => setSelectedZone(area)}
              className={`rounded-lg border-2 p-4 transition-all text-left ${
                selectedZone?.name === area.name
                  ? "border-[#19e6d2] bg-cyan-400/15"
                  : "border-cyan-400/10 bg-[#0b1628]/50 hover:border-cyan-400/30 hover:bg-cyan-400/10"
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className={`h-2.5 w-2.5 rounded-full ${area.dot}`} />
                <p className="text-sm font-medium text-[#e6f1ff]">{area.name}</p>
              </div>
              <p className={`text-xs font-semibold ${area.color}`}>
                {area.label}
              </p>
            </button>
          ))}
        </div>

        {/* Selected Zone Details */}
        {selectedZone && (
          <div className="mt-6 rounded-xl border border-cyan-400/20 bg-cyan-400/5 p-5">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-base font-semibold text-[#e6f1ff]">
                  {selectedZone.name} · Details
                </h3>
                <p className="text-sm text-[#7c8aa5] mt-1">
                  Status: {selectedZone.status}
                </p>
              </div>
              <span className={`rounded-full px-3 py-1 text-xs font-medium border ${selectedZone.color} ${
                selectedZone.status === 'open'
                  ? 'bg-red-500/15 border-red-400/20'
                  : selectedZone.status === 'in-progress'
                    ? 'bg-amber-400/15 border-amber-300/20'
                    : 'bg-emerald-500/15 border-emerald-400/20'
              }`}>
                {selectedZone.label}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="rounded-lg bg-[#0b1628]/50 p-3 border border-cyan-400/10">
                <p className="text-xs text-[#7c8aa5] mb-1">Covered Area</p>
                <p className="text-lg font-bold text-cyan-300">2.5 km²</p>
              </div>
              <div className="rounded-lg bg-[#0b1628]/50 p-3 border border-cyan-400/10">
                <p className="text-xs text-[#7c8aa5] mb-1">Population</p>
                <p className="text-lg font-bold text-cyan-300">45K+</p>
              </div>
              <div className="rounded-lg bg-[#0b1628]/50 p-3 border border-cyan-400/10">
                <p className="text-xs text-[#7c8aa5] mb-1">Response Time</p>
                <p className="text-lg font-bold text-cyan-300">~15 min</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Zone Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-cyan-400/10 bg-[#09111f]/70 p-7 backdrop-blur-sm">
          <h3 className="mb-4 text-base font-semibold text-[#e6f1ff]">
            Active Issues by Zone
          </h3>
          <div className="space-y-3">
            {zoneAreas.map((area) => (
              <div
                key={area.name}
                className="flex items-center justify-between rounded-lg bg-[#0b1628]/50 p-3"
              >
                <div className="flex items-center gap-2">
                  <span className={`h-2 w-2 rounded-full ${area.dot}`} />
                  <span className="text-sm text-[#e6f1ff]">{area.name}</span>
                </div>
                <span className={`text-sm font-semibold ${area.color}`}>
                  {area.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-cyan-400/10 bg-[#09111f]/70 p-7 backdrop-blur-sm">
          <h3 className="mb-4 text-base font-semibold text-[#e6f1ff]">
            Coverage Summary
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#7c8aa5]">Total Coverage</span>
              <span className="text-base font-bold text-cyan-300">
                12.5 km²
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#7c8aa5]">Population Served</span>
              <span className="text-base font-bold text-cyan-300">
                225K+
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#7c8aa5]">Average Response</span>
              <span className="text-base font-bold text-cyan-300">
                14 min
              </span>
            </div>
            <div className="h-1 bg-cyan-400/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan-400 to-emerald-400"
                style={{ width: "85%" }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FieldMap;
