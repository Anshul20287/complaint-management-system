import stats   from '../../data/stats';
import MapCard from './MapCard';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import { useNavigate } from "react-router-dom";


export default function Hero() {
  const r1 = useScrollReveal(); const r2 = useScrollReveal();
  const r3 = useScrollReveal(); const r4 = useScrollReveal();
  const r5 = useScrollReveal();
  const navigate = useNavigate();

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center pt-[120px] pb-20 px-6 md:px-12 z-[1]"
    >
      {/* Glow orbs */}
      <div
        className="absolute rounded-full pointer-events-none"
        style={{ width:500,height:400,top:'10%',left:'40%',background:'rgba(0,245,212,0.08)',filter:'blur(80px)' }}
      />
      <div
        className="absolute rounded-full pointer-events-none"
        style={{ width:350,height:300,bottom:'10%',right:'5%',background:'rgba(124,111,255,0.08)',filter:'blur(80px)' }}
      />

      <div className="max-w-[1180px] mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center">

        {/* Left column */}
        <div>
          {/* Live badge */}
          <div
            ref={r1}
            className="animate inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs tracking-widest mb-7 text-accent"
            style={{ background:'rgba(0,245,212,0.07)', border:'1px solid rgba(0,245,212,0.2)' }}
          >
            <span className="w-[7px] h-[7px] rounded-full bg-accent animate-pulseDot" />
            CITY PROBLEM TRACKER v2.0
          </div>

          {/* Headline */}
          <h1
            ref={r2}
            className="animate font-syne font-extrabold leading-[1.1] tracking-tight mb-5"
            style={{ fontSize: 'clamp(2.2rem,5vw,3.4rem)' }}
          >
            Track. Report.<br />
            <span className="gradient-text">Fix Your City.</span>
          </h1>

          {/* Description */}
          <p
            ref={r3}
            className="animate text-muted leading-relaxed mb-9 font-light max-w-[460px] text-base"
          >
            A smart platform that empowers citizens to report urban issues — potholes,
            broken streetlights, illegal dumping — and tracks them to resolution in real time.
          </p>

          {/* CTA buttons */}
          <div ref={r4} className="animate flex gap-3.5 flex-wrap mb-12">
            <button className="px-8 py-3.5 text-[0.95rem] rounded-xl font-semibold bg-accent text-bg border-none cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,245,212,0.3)]" onClick={()=>{navigate('/signup')}}>
              Report an Issue →
            </button>
            <button
              onClick={() => navigate('/live-map')}
              className="px-8 py-3.5 text-[0.95rem] rounded-xl cursor-pointer transition-all hover:border-accent hover:text-accent"
              style={{ border:'1px solid rgba(255,255,255,0.07)', background:'transparent', color:'#6b7a99' }}
            >
              View Live Map
            </button>
          </div>

          {/* Stats */}
          <div ref={r5} className="animate flex gap-9">
            {stats.map(({ value, label }) => (
              <div key={label}>
                <div className="font-syne font-extrabold text-[1.8rem] text-accent">{value}</div>
                <div className="text-xs mt-0.5 text-muted">{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right column — Map card */}
        <MapCard />
      </div>
    </section>
  );
}
