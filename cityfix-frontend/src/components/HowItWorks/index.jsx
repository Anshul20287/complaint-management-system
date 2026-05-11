import steps    from '../../data/steps';
import StepCard from './StepCard';
import { useScrollReveal } from '../../hooks/useScrollReveal';

/**
 * HowItWorks — centered header + 4-step horizontal process.
 */
export default function HowItWorks() {
  const r1 = useScrollReveal();
  const r2 = useScrollReveal();

  return (
    <section
      id="howitworks"
      className="relative z-[1] py-[90px] px-6 md:px-12"
      style={{ background:'rgba(255,255,255,0.015)', borderTop:'1px solid rgba(255,255,255,0.07)', borderBottom:'1px solid rgba(255,255,255,0.07)' }}
    >
      <div className="max-w-[1180px] mx-auto">

        {/* Header */}
        <div className="text-center mb-12">
          <p ref={r1} className="animate text-[0.72rem] tracking-[2.5px] text-accent font-medium mb-3.5">HOW IT WORKS</p>
          <h2 ref={r2} className="animate font-syne font-extrabold tracking-tight leading-[1.15]" style={{ fontSize:'clamp(1.8rem,4vw,2.5rem)' }}>
            4 simple steps to a fixed city.
          </h2>
        </div>

        {/* Steps */}
        <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Connector line – desktop only */}
          <div
            className="hidden lg:block absolute top-[30px] h-px z-0"
            style={{ left:'10%', right:'10%', background:'linear-gradient(90deg,transparent,rgba(255,255,255,0.07),rgba(255,255,255,0.07),rgba(255,255,255,0.07),transparent)' }}
          />
          {steps.map((step) => (
            <StepCard key={step.num} {...step} />
          ))}
        </div>

      </div>
    </section>
  );
}
