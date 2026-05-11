import { useState, useEffect, useRef, useCallback } from 'react';
import { useScrollReveal } from '../../hooks/useScrollReveal';

const slides = [
  {
    tag: '01 — Infrastructure',
    title: 'Live\nMapping',
    sub: 'Every problem. Every street. Always visible.',
    desc: `Our real-time GIS engine aggregates citizen reports across every ward, zone, and district — stitching them into a living city-wide map that updates the moment a new issue is filed. Field supervisors see density clusters before they become crises. Residents watch their complaint travel from "logged" to "resolved" in real time. No black boxes. No lost tickets. Just the city, laid bare.`,
    statLabel: 'actively mapped',
  },
  {
    tag: '02 — Operations',
    title: 'Fast\nDispatch',
    sub: 'The right team. The right place. Right now.',
    desc: `The moment a report lands, our routing engine weighs priority, proximity, and team capacity to assign the closest available field crew — automatically. No manual triage. No phone calls down the chain. Average dispatch time has dropped from hours to under 11 minutes across our partner municipalities. Urgency doesn't wait for bureaucracy, and now neither do you.`,
    
    statLabel: 'avg. dispatch time',
  },
  {
    tag: '03 — Trust',
    title: 'Secure\n& Private',
    sub: 'You report. We protect.',
    desc: `Civic reporting has always carried risk — fear of retaliation, exposure, or simply being ignored. CityFix encrypts every submission end-to-end, anonymises identity by default, and gives citizens full control over what gets shared and with whom. Your name never reaches a contractor. Your address never leaves our encrypted layer. Accountability shouldn't cost you your safety.`,
    
    statLabel: 'end-to-end encrypted',
  },
  {
    tag: '04 — Governance',
    title: 'Transparent\nData',
    sub: 'Public money. Public record.',
    desc: `We believe city governments should have nothing to hide. Our open dashboards surface resolution rates, average response times, budget allocation per issue category, and department performance — all publicly accessible, no login required. When citizens can see the numbers, authorities are held to them. Transparency isn't a feature. It's the entire point.`,
    
    statLabel: 'reduction in grievances',
  },
];

const INTERVAL = 4200;

export default function About() {
  const r1 = useScrollReveal();
  const r2 = useScrollReveal();
  const r3 = useScrollReveal();
  const r4 = useScrollReveal();
  const r5 = useScrollReveal();

  const [current, setCurrent] = useState(0);
  const [phase, setPhase] = useState('idle');
  const [dir, setDir] = useState(1);
  const timerRef = useRef(null);
  const pendingRef = useRef(null);

  const startTimer = useCallback(() => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      pendingRef.current = null;
      setDir(1);
      setPhase('exit');
    }, INTERVAL);
  }, []);

  useEffect(() => {
    if (phase === 'exit') {
      const t = setTimeout(() => {
        setCurrent((c) => {
          const next = pendingRef.current !== null ? pendingRef.current : (c + 1) % slides.length;
          pendingRef.current = null;
          return next;
        });
        setPhase('enter');
      }, 340);
      return () => clearTimeout(t);
    }
    if (phase === 'enter') {
      const t = setTimeout(() => setPhase('idle'), 480);
      return () => clearTimeout(t);
    }
  }, [phase]);

  useEffect(() => {
    startTimer();
    return () => clearInterval(timerRef.current);
  }, [startTimer]);

  const go = (delta) => {
    if (phase !== 'idle') return;
    const n = (current + delta + slides.length) % slides.length;
    pendingRef.current = n;
    setDir(delta);
    setPhase('exit');
    startTimer();
  };

  const goTo = (i) => {
    if (i === current || phase !== 'idle') return;
    pendingRef.current = i;
    setDir(i > current ? 1 : -1);
    setPhase('exit');
    startTimer();
  };

  const s = slides[current];

  const exitStyle = {
    opacity: 0,
    transform: `translateX(${dir === 1 ? '-55px' : '55px'}) scale(0.96)`,
  };
  const enterStyle = {
    opacity: 0,
    transform: `translateX(${dir === 1 ? '55px' : '-55px'}) scale(0.96)`,
  };
  const idleStyle = { opacity: 1, transform: 'translateX(0) scale(1)' };

  const bodyStyle = {
    transition: 'opacity 0.28s ease, transform 0.38s cubic-bezier(.22,1,.36,1)',
    ...(phase === 'exit' ? exitStyle : phase === 'enter' ? enterStyle : idleStyle),
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');

        .about-section * { box-sizing: border-box; }

        .about-card {
          position: relative;
          overflow: hidden;
          border-radius: 22px;
          border: 1px solid rgba(255,255,255,0.07);
          background: linear-gradient(145deg, rgba(18,18,22,0.95) 0%, rgba(10,10,14,0.98) 100%);
          backdrop-filter: blur(20px);
          padding: 54px 50px 46px;
          min-height: 490px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }
        .about-card::before {
          content: '';
          position: absolute;
          top: -100px; right: -100px;
          width: 320px; height: 320px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(45,232,162,0.055) 0%, transparent 65%);
          pointer-events: none;
        }
        .about-card::after {
          content: '';
          position: absolute;
          bottom: -60px; left: -40px;
          width: 200px; height: 200px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(0,180,216,0.04) 0%, transparent 65%);
          pointer-events: none;
        }

        .card-tag {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.65rem;
          letter-spacing: 3.5px;
          text-transform: uppercase;
          color: #2de8a2;
          font-weight: 500;
          margin-bottom: 26px;
        }
        .card-title {
          font-family: 'DM Serif Display', serif;
          font-size: clamp(2.8rem, 5.5vw, 4.1rem);
          line-height: 0.95;
          color: #ffffff;
          letter-spacing: -0.025em;
          margin-bottom: 18px;
          white-space: pre-line;
        }
        .card-sub {
          font-family: 'DM Serif Display', serif;
          font-style: italic;
          font-size: 0.92rem;
          color: rgba(255,255,255,0.32);
          letter-spacing: 0.01em;
          margin-bottom: 24px;
        }
        .card-rule {
          width: 32px; height: 1.5px;
          background: linear-gradient(90deg, #2de8a2, #00b4d8);
          border-radius: 2px;
          margin-bottom: 22px;
        }
        .card-desc {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.875rem;
          line-height: 1.82;
          color: rgba(255,255,255,0.44);
          font-weight: 300;
        }
        .card-stat-row {
          display: flex;
          align-items: flex-end;
          gap: 11px;
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid rgba(255,255,255,0.065);
        }
        .card-stat-value {
          font-family: 'DM Serif Display', serif;
          font-size: 2.1rem;
          color: #fff;
          line-height: 1;
        }
        .card-stat-label {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.7rem;
          color: rgba(255,255,255,0.28);
          letter-spacing: 2px;
          text-transform: uppercase;
          padding-bottom: 4px;
        }

        .card-progress {
          position: absolute;
          bottom: 0; left: 0;
          height: 2px;
          background: linear-gradient(90deg, #2de8a2, #00b4d8);
          animation: cprog ${INTERVAL}ms linear;
          transform-origin: left;
        }
        @keyframes cprog { from { width: 0; } to { width: 100%; } }

        .about-nav {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-top: 20px;
        }
        .nav-btn {
          width: 44px; height: 44px;
          border-radius: 50%;
          border: 1px solid rgba(255,255,255,0.1);
          background: transparent;
          color: rgba(255,255,255,0.45);
          font-size: 1rem;
          cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: border-color 0.2s, color 0.2s, background 0.2s, transform 0.15s;
          font-family: 'DM Sans', sans-serif;
        }
        .nav-btn:hover {
          border-color: #2de8a2;
          color: #2de8a2;
          background: rgba(45,232,162,0.07);
          transform: scale(1.1);
        }
        .nav-dots { display: flex; gap: 7px; align-items: center; }
        .nav-dot {
          cursor: pointer; border: none; background: none;
          padding: 5px; display: flex; align-items: center;
        }
        .dot-inner {
          height: 6px; border-radius: 3px;
          background: rgba(255,255,255,0.16);
          transition: width 0.35s cubic-bezier(.22,1,.36,1), background 0.35s;
          width: 6px;
        }
        .nav-dot.active .dot-inner {
          width: 24px;
          background: #2de8a2;
        }
        .nav-counter {
          margin-left: auto;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.72rem;
          color: rgba(255,255,255,0.2);
          letter-spacing: 1.5px;
          font-variant-numeric: tabular-nums;
        }

        .left-stat-row {
          display: flex;
          gap: 36px;
        }
        .left-stat-val {
          font-family: 'DM Serif Display', serif;
          font-size: 1.75rem;
          color: #fff;
          line-height: 1;
        }
        .left-stat-lbl {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.67rem;
          color: rgba(255,255,255,0.28);
          letter-spacing: 2px;
          text-transform: uppercase;
          margin-top: 5px;
        }
      `}</style>

      <section
        id="about"
        className="about-section relative z-[1] py-[90px] px-6 md:px-12"
        style={{
          background: 'rgba(255,255,255,0.015)',
          borderTop: '1px solid rgba(255,255,255,0.07)',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
        }}
      >
        <div className="max-w-[1180px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">

          {/* ── Left ── */}
          <div>
            <p
              ref={r1}
              className="animate"
              style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.67rem', letterSpacing: '3.5px', textTransform: 'uppercase', color: '#2de8a2', fontWeight: 500, marginBottom: '18px' }}
            >
              About Us
            </p>
            <h2
              ref={r2}
              className="animate"
              style={{ fontFamily: "'DM Serif Display', serif", fontSize: 'clamp(2.1rem,4.5vw,3rem)', lineHeight: 1.08, letterSpacing: '-0.02em', color: '#fff', marginBottom: '22px' }}
            >
              Built for citizens.<br />Powered by data.
            </h2>
            <p
              ref={r3}
              className="animate"
              style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.9rem', lineHeight: 1.82, color: 'rgba(255,255,255,0.48)', fontWeight: 300, maxWidth: '440px', marginBottom: '16px' }}
            >
              CityFix bridges the gap between residents and municipal authorities — making it effortless to flag problems, track resolutions, and hold governments accountable with complete transparency.
            </p>
            <p
              ref={r4}
              className="animate"
              style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.9rem', lineHeight: 1.82, color: 'rgba(255,255,255,0.48)', fontWeight: 300, maxWidth: '440px', marginBottom: '38px' }}
            >
              Public infrastructure deserves better than ignored complaints and delayed responses — we make every issue count.
            </p>
            <div ref={r5} className="animate left-stat-row">
              {[['40+', 'Cities'], ['60%', 'Fewer Complaints'], ['2023', 'Founded']].map(([val, lbl]) => (
                <div key={lbl}>
                  <div className="left-stat-val">{val}</div>
                  <div className="left-stat-lbl">{lbl}</div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Right ── */}
          <div>
            <div className="about-card">
              <div className="card-progress" key={`prog-${current}`} />

              <div style={bodyStyle}>
                <div className="card-tag">{s.tag}</div>
                <div className="card-title">{s.title}</div>
                <div className="card-sub">{s.sub}</div>
                <div className="card-rule" />
                <div className="card-desc">{s.desc}</div>
              </div>

              <div className="card-stat-row" style={bodyStyle}>
                <div className="card-stat-value">{s.stat}</div>
                <div className="card-stat-label">{s.statLabel}</div>
              </div>
            </div>

            <div className="about-nav">
              <button className="nav-btn" onClick={() => go(-1)} aria-label="Previous">←</button>
              <button className="nav-btn" onClick={() => go(1)} aria-label="Next">→</button>
              <div className="nav-dots">
                {slides.map((_, i) => (
                  <button key={i} className={`nav-dot${i === current ? ' active' : ''}`} onClick={() => goTo(i)}>
                    <div className="dot-inner" />
                  </button>
                ))}
              </div>
              <span className="nav-counter">0{current + 1} / 0{slides.length}</span>
            </div>
          </div>

        </div>
      </section>
    </>
  );
}