import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from "../../context/AuthContext";
import { registerUser } from "../../services/authService";

// ─── Role options ────────────────────────────────────────────────────────────
const ROLES = [
  {
    value: 'citizen',
    icon:  '👤',
    title: 'Citizen',
    desc:  'Report & track urban issues in your area.',
  },
  {
    value: 'staff',
    icon:  '👷',
    title: 'Staff',
    desc:  'Field worker — receive and resolve assigned issues.',
  },
  {
    value: 'admin',
    icon:  '🛡️',
    title: 'Admin',
    desc:  'Manage the platform and all city issues.',
  },
];

// ─── Category options with descriptions ────────────────────────────────────
const CATEGORIES = [
  {
    value: 'Pothole/Road Damage',
    label: 'Pothole/Road Damage',
    icon: '🛣️',
    desc: 'Repair damaged roads, potholes, cracks, and surface irregularities.',
  },
  {
    value: 'Sanitation',
    label: 'Sanitation',
    icon: '🧹',
    desc: 'Clean streets, manage waste collection, and maintain public hygiene.',
  },
  {
    value: 'Electricity',
    label: 'Electricity',
    icon: '⚡',
    desc: 'Fix street lights, electrical lines, and power supply issues.',
  },
  {
    value: 'Water Problems',
    label: 'Water Problems',
    icon: '💧',
    desc: 'Handle water supply issues, leaks, and drainage problems.',
  },
  {
    value: 'Environmental factors',
    label: 'Environmental factors',
    icon: '🌳',
    desc: 'Address pollution, tree maintenance, and environmental concerns.',
  },
  {
    value: 'Other',
    label: 'Other',
    icon: '📋',
    desc: 'Handle miscellaneous issues not covered by other categories.',
  },
];

// ─── Reusable field wrapper ───────────────────────────────────────────────────
function Field({ label, error, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        className="text-[0.75rem] tracking-wide font-medium"
        style={{ color: '#6b7a99' }}
      >
        {label}
      </label>
      {children}
      {error && (
        <p className="text-[0.75rem]" style={{ color: '#f87171' }}>
          {error}
        </p>
      )}
    </div>
  );
}

// ─── Shared input style ───────────────────────────────────────────────────────
const inputStyle = {
  width: '100%',
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.07)',
  borderRadius: 12,
  padding: '12px 16px',
  color: '#e8edf8',
  fontSize: '0.9rem',
  fontFamily: 'DM Sans, sans-serif',
  outline: 'none',
  transition: 'border-color 0.2s',
};

// ─── Main component ───────────────────────────────────────────────────────────
export default function SignUp() {
  const navigate  = useNavigate();
  const { login } = useAuth();

  const [fields, setFields] = useState({
    fullName:        '',
    username:        '',
    email:           '',
    password:        '',
    confirmPassword: '',
  });
  const [role,    setRole]    = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [errors,  setErrors]  = useState({});
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);

  // Field change handler
  function handleChange(e) {
    const { name, value } = e.target;
    setFields((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  }

  // Category toggle handler
  function handleCategoryToggle(category) {
    setSelectedCategories((prev) => {
      if (prev.includes(category)) {
        return prev.filter((c) => c !== category);
      } else {
        return [...prev, category];
      }
    });
    setErrors((prev) => ({ ...prev, categories: '' }));
  }

  // Validation
  function validate() {
    const errs = {};
    if (!fields.fullName.trim())
      errs.fullName = 'Full name is required.';
    if (!fields.username.trim() || fields.username.trim().length < 3)
      errs.username = 'Username must be at least 3 characters.';
    if (!fields.email.trim())
      errs.email = 'Email is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email))
      errs.email = 'Enter a valid email address.';
    if (!fields.password)
      errs.password = 'Password is required.';
    else if (fields.password.length < 6)
      errs.password = 'Password must be at least 6 characters.';
    if (fields.password !== fields.confirmPassword)
      errs.confirmPassword = 'Passwords do not match.';
    if (!role)
      errs.role = 'Please select a role to continue.';
    if (role === 'staff' && selectedCategories.length === 0)
      errs.categories = 'Please select at least one category for your work.';
    return errs;
  }

  // Submit
  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    try {
      setLoading(true);

      const res = await registerUser({
        name: fields.fullName,
        email: fields.email,
        password: fields.password,
        role,
        assignedCategories: role === 'staff' ? selectedCategories : []
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      login(res.data.user);

      if (res.data.user.role === "admin") navigate("/admin");
      else if (res.data.user.role === "staff") navigate("/staff");
      else navigate("/citizen");
    } catch (error) {
      alert(error.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{ minHeight: '100vh', background: '#03060f', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 16px', position: 'relative' }}
    >
      {/* Glow orbs */}
      <div style={{ position: 'absolute', width: 500, height: 400, top: '-10%', right: '-10%', background: 'rgba(0,245,212,0.07)', filter: 'blur(90px)', borderRadius: '50%', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', width: 400, height: 350, bottom: '-10%', left: '-5%',  background: 'rgba(124,111,255,0.07)', filter: 'blur(80px)', borderRadius: '50%', pointerEvents: 'none' }} />

      {/* Grid background */}
      <div style={{ position: 'fixed', inset: 0, backgroundImage: 'linear-gradient(rgba(0,245,212,.03) 1px,transparent 1px),linear-gradient(90deg,rgba(0,245,212,.03) 1px,transparent 1px)', backgroundSize: '50px 50px', pointerEvents: 'none', zIndex: 0 }} />

      <div style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: 520 }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <Link to="/" style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '1.8rem', color: '#e8edf8', textDecoration: 'none' }}>
            City<span style={{ color: '#00f5d4' }}>Fix</span>
          </Link>
          <p style={{ color: '#6b7a99', fontSize: '0.9rem', marginTop: 6 }}>
            Create your account to get started
          </p>
        </div>

        {/* Card */}
        <div style={{ position: 'relative', background: 'rgba(11,15,30,0.95)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20, padding: 32, backdropFilter: 'blur(20px)' }}>

          {/* Top accent line */}
          <div style={{ position: 'absolute', top: 0, left: '20%', right: '20%', height: 2, background: 'linear-gradient(90deg,transparent,#00f5d4,transparent)', borderRadius: '0 0 4px 4px' }} />

          <h1 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '1.3rem', color: '#e8edf8', textAlign: 'center', marginBottom: 24 }}>
            Create Account
          </h1>

          <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            {/* Full Name */}
            <Field label="FULL NAME *" error={errors.fullName}>
              <input
                name="fullName"
                value={fields.fullName}
                onChange={handleChange}
                placeholder="Rahul Sharma"
                style={inputStyle}
                onFocus={(e) => (e.target.style.borderColor = 'rgba(0,245,212,0.4)')}
                onBlur={(e)  => (e.target.style.borderColor = 'rgba(255,255,255,0.07)')}
              />
            </Field>

            {/* Username */}
            <Field label="USERNAME *" error={errors.username}>
              <input
                name="username"
                value={fields.username}
                onChange={handleChange}
                placeholder="rahulsharma"
                style={inputStyle}
                onFocus={(e) => (e.target.style.borderColor = 'rgba(0,245,212,0.4)')}
                onBlur={(e)  => (e.target.style.borderColor = 'rgba(255,255,255,0.07)')}
              />
            </Field>

            {/* Email */}
            <Field label="EMAIL ADDRESS *" error={errors.email}>
              <input
                name="email"
                type="email"
                value={fields.email}
                onChange={handleChange}
                placeholder="rahul@example.com"
                style={inputStyle}
                onFocus={(e) => (e.target.style.borderColor = 'rgba(0,245,212,0.4)')}
                onBlur={(e)  => (e.target.style.borderColor = 'rgba(255,255,255,0.07)')}
              />
            </Field>

            {/* Password */}
            <Field label="PASSWORD *" error={errors.password}>
              <div style={{ position: 'relative' }}>
                <input
                  name="password"
                  type={showPwd ? 'text' : 'password'}
                  value={fields.password}
                  onChange={handleChange}
                  placeholder="Min. 6 characters"
                  style={{ ...inputStyle, paddingRight: 56 }}
                  onFocus={(e) => (e.target.style.borderColor = 'rgba(0,245,212,0.4)')}
                  onBlur={(e)  => (e.target.style.borderColor = 'rgba(255,255,255,0.07)')}
                />
                <button
                  type="button"
                  onClick={() => setShowPwd((p) => !p)}
                  style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#6b7a99', fontSize: '0.75rem', cursor: 'pointer' }}
                >
                  {showPwd ? 'Hide' : 'Show'}
                </button>
              </div>
            </Field>

            {/* Confirm Password */}
            <Field label="CONFIRM PASSWORD *" error={errors.confirmPassword}>
              <input
                name="confirmPassword"
                type={showPwd ? 'text' : 'password'}
                value={fields.confirmPassword}
                onChange={handleChange}
                placeholder="Re-enter your password"
                style={inputStyle}
                onFocus={(e) => (e.target.style.borderColor = 'rgba(0,245,212,0.4)')}
                onBlur={(e)  => (e.target.style.borderColor = 'rgba(255,255,255,0.07)')}
              />
            </Field>

            {/* ── Role selector ── */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <p style={{ fontSize: '0.75rem', letterSpacing: '0.05em', fontWeight: 500, color: '#6b7a99' }}>
                SELECT YOUR ROLE *
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
                {ROLES.map(({ value, icon, title, desc }) => {
                  const active = role === value;
                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => { setRole(value); setSelectedCategories([]); setErrors((p) => ({ ...p, role: '' })); }}
                      style={{
                        display: 'flex', flexDirection: 'column', alignItems: 'center',
                        textAlign: 'center', gap: 6, borderRadius: 14, padding: '14px 8px',
                        border: `1px solid ${active ? '#00f5d4' : 'rgba(255,255,255,0.07)'}`,
                        background: active ? 'rgba(0,245,212,0.08)' : 'rgba(255,255,255,0.02)',
                        color: active ? '#00f5d4' : '#6b7a99',
                        cursor: 'pointer', transition: 'all 0.2s',
                      }}
                    >
                      <span style={{ fontSize: '1.5rem' }}>{icon}</span>
                      <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '0.85rem' }}>{title}</span>
                      <span style={{ fontSize: '0.68rem', lineHeight: 1.4 }}>{desc}</span>
                      {active && (
                        <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#00f5d4', marginTop: 2 }} />
                      )}
                    </button>
                  );
                })}
              </div>
              {errors.role && (
                <p style={{ color: '#f87171', fontSize: '0.75rem' }}>{errors.role}</p>
              )}
            </div>

            {/* ── Staff Categories Selector (visible only when staff is selected) ── */}
            {role === 'staff' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <p style={{ fontSize: '0.75rem', letterSpacing: '0.05em', fontWeight: 500, color: '#6b7a99' }}>
                  SELECT YOUR WORK DOMAINS *
                </p>
                <p style={{ fontSize: '0.7rem', color: '#7c8aa5', marginTop: -6 }}>
                  Choose the categories you're qualified to handle. You'll receive complaints from these domains.
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
                  {CATEGORIES.map(({ value, label, icon, desc }) => {
                    const isSelected = selectedCategories.includes(value);
                    return (
                      <button
                        key={value}
                        type="button"
                        onClick={() => handleCategoryToggle(value)}
                        style={{
                          display: 'flex', flexDirection: 'column', alignItems: 'flex-start',
                          textAlign: 'left', gap: 4, borderRadius: 12, padding: '12px',
                          border: `1.5px solid ${isSelected ? '#00f5d4' : 'rgba(255,255,255,0.07)'}`,
                          background: isSelected ? 'rgba(0,245,212,0.12)' : 'rgba(255,255,255,0.01)',
                          color: isSelected ? '#00f5d4' : '#6b7a99',
                          cursor: 'pointer', transition: 'all 0.2s',
                        }}
                        onMouseEnter={(e) => {
                          if (!isSelected) {
                            e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                            e.currentTarget.style.borderColor = 'rgba(0,245,212,0.3)';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!isSelected) {
                            e.currentTarget.style.background = 'rgba(255,255,255,0.01)';
                            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)';
                          }
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, width: '100%' }}>
                          <span style={{ fontSize: '1rem' }}>{icon}</span>
                          <span style={{ fontWeight: 600, fontSize: '0.85rem', flex: 1 }}>{label}</span>
                          <div style={{
                            width: 16, height: 16, borderRadius: 4,
                            border: `2px solid ${isSelected ? '#00f5d4' : 'rgba(255,255,255,0.2)'}`,
                            background: isSelected ? '#00f5d4' : 'transparent',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '0.7rem', color: '#03060f'
                          }}>
                            {isSelected && '✓'}
                          </div>
                        </div>
                        <p style={{ fontSize: '0.7rem', lineHeight: 1.3, color: 'rgba(255,255,255,0.6)' }}>
                          {desc}
                        </p>
                      </button>
                    );
                  })}
                </div>
                {errors.categories && (
                  <p style={{ color: '#f87171', fontSize: '0.75rem' }}>{errors.categories}</p>
                )}
              </div>
            )}

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              style={{
                marginTop: 8, width: '100%', padding: '14px', borderRadius: 12,
                background: '#00f5d4', color: '#03060f', border: 'none',
                fontFamily: 'DM Sans, sans-serif', fontSize: '0.95rem', fontWeight: 600,
                cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1,
                transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              }}
              onMouseEnter={(e) => { if (!loading) { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,245,212,0.3)'; } }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
            >
              {loading ? (
                <>
                  <span style={{ width: 16, height: 16, borderRadius: '50%', border: '2px solid #03060f', borderTopColor: 'transparent', animation: 'spin 0.7s linear infinite', display: 'inline-block' }} />
                  Creating account…
                </>
              ) : 'Create Account →'}
            </button>

          </form>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '20px 0' }}>
            <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.07)' }} />
            <span style={{ color: '#6b7a99', fontSize: '0.75rem' }}>or</span>
            <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.07)' }} />
          </div>

          {/* Already have an account */}
          <p style={{ textAlign: 'center', fontSize: '0.9rem', color: '#6b7a99' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#00f5d4', fontWeight: 600, textDecoration: 'none' }}>
              Login →
            </Link>
          </p>
        </div>

        {/* Back to home */}
        <p style={{ textAlign: 'center', marginTop: 20, fontSize: '0.78rem', color: '#6b7a99' }}>
          <Link to="/" style={{ color: '#6b7a99', textDecoration: 'none' }}>
            ← Back to CityFix Home
          </Link>
        </p>

      </div>

      {/* Spinner keyframe */}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}