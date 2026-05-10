/**
 * ContactInfoItem — icon + text row in the contact info block.
 */
export default function ContactInfoItem({ icon, text }) {
  return (
    <div className="flex items-center gap-3.5">
      <div
        className="w-[42px] h-[42px] rounded-xl flex items-center justify-center text-base flex-shrink-0"
        style={{ background:'rgba(0,245,212,0.08)', border:'1px solid rgba(0,245,212,0.15)' }}
      >
        {icon}
      </div>
      <span className="text-[0.88rem] text-muted">{text}</span>
    </div>
  );
}
