import features    from '../../data/features';
import FeatureCard from './FeatureCard';
import { useScrollReveal } from '../../hooks/useScrollReveal';

export default function Features() {
  const r1 = useScrollReveal();
  const r2 = useScrollReveal();
  const r3 = useScrollReveal();

  return (
    <section id="features" className="relative z-[1] py-[90px] px-6 md:px-12">
      <div className="max-w-[1180px] mx-auto">

        {/* Header */}
        <div className="text-center mb-14">
          <p ref={r1} className="animate text-[0.72rem] tracking-[2.5px] text-accent font-medium mb-3.5">FEATURES</p>
          <h2 ref={r2} className="animate font-syne font-extrabold tracking-tight leading-[1.15] mb-4 mx-auto" style={{ fontSize:'clamp(1.8rem,4vw,2.5rem)', maxWidth:500 }}>
            Everything needed to fix a city.
          </h2>
          <p ref={r3} className="animate text-muted text-[0.95rem] leading-relaxed font-light mx-auto max-w-[500px]">
            From reporting to resolution — CityFix covers every step of the urban problem lifecycle.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((feat) => (
            <FeatureCard key={feat.title} {...feat} />
          ))}
        </div>

      </div>
    </section>
  );
}
