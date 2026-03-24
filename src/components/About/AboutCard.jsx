/**
 * AboutCard — individual card in the 2×2 about grid.
 */
export default function AboutCard({ icon, title, desc }) {
  return (
    <div
      className="rounded-2xl p-5 cursor-default transition-all duration-300 hover:-translate-y-1"
      style={{
        background: 'rgba(255,255,255,0.025)',
        border: '1px solid rgba(255,255,255,0.07)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'rgba(0,245,212,0.3)';
        e.currentTarget.style.background  = 'rgba(0,245,212,0.04)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)';
        e.currentTarget.style.background  = 'rgba(255,255,255,0.025)';
      }}
    >
      <div className="text-[1.6rem] mb-2.5">{icon}</div>
      <div className="font-syne font-bold text-[0.9rem] mb-1.5 text-[#e8edf8]">{title}</div>
      <div className="text-[0.78rem] leading-relaxed text-muted">{desc}</div>
    </div>
  );
}
