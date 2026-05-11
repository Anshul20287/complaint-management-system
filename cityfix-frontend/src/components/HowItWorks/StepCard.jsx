/**
 * StepCard — numbered step in the How It Works section.
 */
export default function StepCard({ num, title, desc }) {
  return (
    <div className="text-center relative z-[1]">
      <div
        className="w-[60px] h-[60px] rounded-full flex items-center justify-center mx-auto mb-4 font-syne font-extrabold text-[1.2rem] text-accent"
        style={{ background:'#0b0f1e', border:'2px solid #00f5d4' }}
      >
        {num}
      </div>
      <div className="font-syne font-bold text-[0.95rem] mb-2 text-[#e8edf8]">{title}</div>
      <div className="text-[0.82rem] leading-relaxed text-muted">{desc}</div>
    </div>
  );
}
