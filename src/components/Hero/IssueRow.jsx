/**
 * IssueRow — single row in the live issues list inside the map card.
 */
export default function IssueRow({ color, name, loc, badge, bg, border }) {
  return (
    <div
      className="flex items-center justify-between px-3 py-2.5 rounded-lg"
      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
    >
      <div className="flex items-center gap-2.5">
        <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: color }} />
        <div>
          <div className="text-[0.82rem] font-medium text-[#e8edf8]">{name}</div>
          <div className="text-[0.7rem] mt-0.5 text-muted">{loc}</div>
        </div>
      </div>
      <span
        className="text-[0.68rem] px-2.5 py-0.5 rounded-full font-medium"
        style={{ background: bg, color, border: `1px solid ${border}` }}
      >
        {badge}
      </span>
    </div>
  );
}
