export default function FeatureCard({ icon, title, desc }) {
  return (
    <div
      className="group relative rounded-2xl p-7 cursor-default overflow-hidden transition-all duration-300"
      style={{ background:'rgba(255,255,255,0.025)', border:'1px solid rgba(255,255,255,0.07)' }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'rgba(124,111,255,0.3)';
        e.currentTarget.style.background  = 'rgba(124,111,255,0.04)';
        e.currentTarget.style.transform   = 'translateY(-5px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)';
        e.currentTarget.style.background  = 'rgba(255,255,255,0.025)';
        e.currentTarget.style.transform   = 'translateY(0)';
      }}
    >
      {/* Sliding top accent line */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-center"
        style={{ background: 'linear-gradient(90deg,transparent,#7c6fff,transparent)' }}
      />
      <div className="text-[2rem] mb-3.5">{icon}</div>
      <div className="font-syne font-bold text-base mb-2.5 text-[#e8edf8]">{title}</div>
      <div className="text-[0.84rem] leading-relaxed text-muted">{desc}</div>
    </div>
  );
}
