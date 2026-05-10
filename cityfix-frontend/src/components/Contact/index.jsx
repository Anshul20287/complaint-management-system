import contactInfo    from '../../data/contactInfo';
import ContactInfoItem from './ContactInfoItem';
import ContactForm     from './ContactForm';
import { useScrollReveal } from '../../hooks/useScrollReveal';

/**
 * Contact — two-column: info copy on left, form on right.
 */
export default function Contact() {
  const r1 = useScrollReveal();
  const r2 = useScrollReveal();
  const r3 = useScrollReveal();
  const r4 = useScrollReveal();
  const r5 = useScrollReveal();

  return (
    <section id="contact" className="relative z-[1] py-[90px] px-6 md:px-12">
      <div className="max-w-[1180px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-start">

        {/* Left */}
        <div>
          <p ref={r1} className="animate text-[0.72rem] tracking-[2.5px] text-accent font-medium mb-3.5">CONTACT</p>
          <h2 ref={r2} className="animate font-syne font-extrabold tracking-tight leading-[1.15] mb-4" style={{ fontSize:'clamp(1.8rem,4vw,2.5rem)' }}>
            Let's build a<br />better city together.
          </h2>
          <p ref={r3} className="animate text-muted text-[0.95rem] leading-relaxed font-light mb-8 max-w-[500px]">
            Want to onboard your city? Have questions? We'd love to hear from you.
          </p>
          <div ref={r4} className="animate flex flex-col gap-5">
            {contactInfo.map((item) => (
              <ContactInfoItem key={item.text} {...item} />
            ))}
          </div>
        </div>

        {/* Right — form */}
        <div
          ref={r5}
          className="animate rounded-2xl p-8"
          style={{ background:'rgba(255,255,255,0.025)', border:'1px solid rgba(255,255,255,0.07)' }}
        >
          <ContactForm />
        </div>

      </div>
    </section>
  );
}
