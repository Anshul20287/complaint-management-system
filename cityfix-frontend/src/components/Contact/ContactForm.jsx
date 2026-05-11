import { useState } from 'react';

const inputClass = [
  'w-full rounded-xl px-3.5 py-3 text-sm outline-none transition-colors duration-200',
  'bg-white/[0.04] text-[#e8edf8] placeholder-muted',
  'border border-white/[0.07] focus:border-accent/40',
].join(' ');

/**
 * ContactForm — controlled form with basic validation and success feedback.
 */
export default function ContactForm() {
  const [fields, setFields]   = useState({ name:'', email:'', city:'', message:'' });
  const [error,  setError]    = useState('');
  const [success, setSuccess] = useState(false);

  function handleChange(e) {
    setFields((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  }

  function handleSubmit(e) {
    e.preventDefault();
    const { name, email, message } = fields;
    if (!name.trim() || !email.trim() || !message.trim()) {
      setError('Please fill in all required fields.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    setSuccess(true);
  }

  if (success) {
    return (
      <div className="text-center py-10">
        <div className="text-5xl mb-4">✅</div>
        <h3 className="font-syne font-bold text-[1.2rem] mb-2 text-[#e8edf8]">Message Sent!</h3>
        <p className="text-muted text-[0.88rem]">We'll get back to you within 24 hours.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="mb-4">
        <label className="block text-[0.78rem] tracking-wide text-muted mb-1.5">YOUR NAME *</label>
        <input name="name" value={fields.name} onChange={handleChange}
               placeholder="Rahul Sharma" className={inputClass} />
      </div>
      <div className="mb-4">
        <label className="block text-[0.78rem] tracking-wide text-muted mb-1.5">EMAIL ADDRESS *</label>
        <input name="email" type="email" value={fields.email} onChange={handleChange}
               placeholder="rahul@example.com" className={inputClass} />
      </div>
      <div className="mb-4">
        <label className="block text-[0.78rem] tracking-wide text-muted mb-1.5">CITY / ORGANIZATION</label>
        <input name="city" value={fields.city} onChange={handleChange}
               placeholder="Mumbai Municipal Corporation" className={inputClass} />
      </div>
      <div className="mb-4">
        <label className="block text-[0.78rem] tracking-wide text-muted mb-1.5">MESSAGE *</label>
        <textarea name="message" value={fields.message} onChange={handleChange}
                  placeholder="Tell us about your city's needs..."
                  className={`${inputClass} resize-y min-h-[100px]`} />
      </div>
      {error && <p className="text-red-400 text-[0.82rem] mb-3 text-center">{error}</p>}
      <button
        type="submit"
        className="w-full py-3.5 rounded-xl font-semibold text-[0.95rem] cursor-pointer transition-all duration-200 mt-1.5 bg-accent text-bg border-none hover:bg-white hover:-translate-y-0.5 hover:shadow-[0_8px_28px_rgba(0,245,212,0.3)]"
        style={{ fontFamily:'DM Sans, sans-serif' }}
      >
        Send Message →
      </button>
    </form>
  );
}
