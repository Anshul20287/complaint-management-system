import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { loginUser } from "../../services/authService";

// ─── Role options ─────────────────────────────────────────────────────────────
const ROLES = [
  { value: 'citizen', icon: '👤', label: 'Citizen' },
  { value: 'staff',   icon: '👷', label: 'Staff'   },
  { value: 'admin',   icon: '🛡️', label: 'Admin'   },
];

// ─── Shared input style (same as SignUp) ─────────────────────────────────────
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
export default function Login() {
  console.log("LOGIN COMPONENT LOADED");
  const navigate  = useNavigate();
  const { login } = useAuth();

  const [fields, setFields] = useState({ email: '', password: '' });
  const [role,    setRole]    = useState('');
  const [errors,  setErrors]  = useState({});
  const [loginError, setLoginError] = useState(null);
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setFields((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  }

  function validate() {
    const errs = {};
    if (!fields.email.trim()) errs.email = 'Email is required.';
    if (!fields.password)        errs.password = 'Password is required.';
    return errs;
  }

async function handleSubmit(e) {
  e.preventDefault();

  console.log("LOGIN BUTTON CLICKED");

  const errs = validate();

  if (Object.keys(errs).length) {
    setErrors(errs);
    return;
  }

  try {
    setLoading(true);
    setLoginError(null);

    const res = await loginUser({
      email: fields.email,
      password: fields.password
    });

    localStorage.setItem("token", res.data.token);
    localStorage.setItem("user", JSON.stringify(res.data.user));

    login(res.data.user);

    const userRole = res.data.user.role;

    if (userRole === "admin") navigate("/admin");
    else if (userRole === "staff") navigate("/staff/domain-select");
    else navigate("/citizen");

  } catch (error) {
    const message = error.response?.data?.message || "Login failed";
    setLoginError(message);
    console.error("LOGIN ERROR:", error);
  } finally {
    setLoading(false);
  }
}

  const activeRole = ROLES.find((r) => r.value === role);

  return (
    <div style={{ minHeight: '100vh', background: '#03060f', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 16px', position: 'relative' }}>

      {/* Glow orbs */}
      <div style={{ position: 'absolute', width: 500, height: 400, top: '-10%', left: '-10%', background: 'rgba(124,111,255,0.07)', filter: 'blur(90px)', borderRadius: '50%', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', width: 400, height: 350, bottom: '-10%', right: '-5%', background: 'rgba(0,245,212,0.07)', filter: 'blur(80px)', borderRadius: '50%', pointerEvents: 'none' }} />

      {/* Grid background */}
      <div style={{ position: 'fixed', inset: 0, backgroundImage: 'linear-gradient(rgba(0,245,212,.03) 1px,transparent 1px),linear-gradient(90deg,rgba(0,245,212,.03) 1px,transparent 1px)', backgroundSize: '50px 50px', pointerEvents: 'none', zIndex: 0 }} />

      <div style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: 480 }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <Link to="/" style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '1.8rem', color: '#e8edf8', textDecoration: 'none' }}>
            City<span style={{ color: '#00f5d4' }}>Fix</span>
          </Link>
          <p style={{ color: '#6b7a99', fontSize: '0.9rem', marginTop: 6 }}>
            Welcome back — sign in to continue
          </p>
        </div>

        {/* Card */}
        <div style={{ position: 'relative', background: 'rgba(11,15,30,0.95)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20, padding: 32, backdropFilter: 'blur(20px)' }}>

          {/* Top accent line — purple to differentiate from signup */}
          <div style={{ position: 'absolute', top: 0, left: '20%', right: '20%', height: 2, background: 'linear-gradient(90deg,transparent,#7c6fff,transparent)', borderRadius: '0 0 4px 4px' }} />

          <h1 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '1.3rem', color: '#e8edf8', textAlign: 'center', marginBottom: 24 }}>
            Sign In
          </h1>

          {loginError && (
            <div style={{ marginBottom: 16, padding: 14, borderRadius: 14, background: '#2b1120', border: '1px solid #c53030', color: '#feb2b2', fontSize: '0.95rem' }}>
              {loginError}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            {/* ── Role selector (same card style as SignUp) ── */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <p style={{ fontSize: '0.75rem', letterSpacing: '0.05em', fontWeight: 500, color: '#6b7a99' }}>
                SELECT YOUR ROLE (OPTIONAL)
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
                {ROLES.map(({ value, icon, label }) => {
                  const active = role === value;
                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => { setRole(value); setErrors((p) => ({ ...p, role: '' })); }}
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
                      <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '0.85rem' }}>{label}</span>
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

            {/* Username */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontSize: '0.75rem', letterSpacing: '0.05em', fontWeight: 500, color: '#6b7a99' }}>
                EMAIL *
              </label>
              <input
                name="email"
                value={fields.email}
                onChange={handleChange}
                placeholder="Enter your email"
                style={{ ...inputStyle, borderColor: errors.email ? '#f87171' : 'rgba(255,255,255,0.07)' }}
                onFocus={(e) => (e.target.style.borderColor = 'rgba(0,245,212,0.4)')}
                onBlur={(e)  => (e.target.style.borderColor = errors.email ? '#f87171' : 'rgba(255,255,255,0.07)')}
              />
              {errors.email && <p style={{ color: '#f87171', fontSize: '0.75rem' }}>{errors.email}</p>}
            </div>

            {/* Password */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontSize: '0.75rem', letterSpacing: '0.05em', fontWeight: 500, color: '#6b7a99' }}>
                PASSWORD *
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  name="password"
                  type={showPwd ? 'text' : 'password'}
                  value={fields.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  style={{ ...inputStyle, paddingRight: 56, borderColor: errors.password ? '#f87171' : 'rgba(255,255,255,0.07)' }}
                  onFocus={(e) => (e.target.style.borderColor = 'rgba(0,245,212,0.4)')}
                  onBlur={(e)  => (e.target.style.borderColor = errors.password ? '#f87171' : 'rgba(255,255,255,0.07)')}
                />
                <button
                  type="button"
                  onClick={() => setShowPwd((p) => !p)}
                  style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#6b7a99', fontSize: '0.75rem', cursor: 'pointer' }}
                >
                  {showPwd ? 'Hide' : 'Show'}
                </button>
              </div>
              {errors.password && <p style={{ color: '#f87171', fontSize: '0.75rem' }}>{errors.password}</p>}
            </div>

            {/* Forgot password */}
            <div style={{ textAlign: 'right', marginTop: -6 }}>
              <Link to="#" style={{ color: '#6b7a99', fontSize: '0.78rem', textDecoration: 'none' }}
                onMouseEnter={(e) => (e.target.style.color = '#00f5d4')}
                onMouseLeave={(e) => (e.target.style.color = '#6b7a99')}>
                Forgot password?
              </Link>
            </div>

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
                  Signing in…
                </>
              ) : (
                `Sign In${activeRole ? ` as ${activeRole.label}` : ''} →`
              )}
            </button>

          </form>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '20px 0' }}>
            <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.07)' }} />
            <span style={{ color: '#6b7a99', fontSize: '0.75rem' }}>or</span>
            <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.07)' }} />
          </div>

          {/* Don't have an account */}
          <p style={{ textAlign: 'center', fontSize: '0.9rem', color: '#6b7a99' }}>
            Don't have an account?{' '}
            <Link to="/signup" style={{ color: '#00f5d4', fontWeight: 600, textDecoration: 'none' }}>
              Sign Up →
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
