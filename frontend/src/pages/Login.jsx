import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { GoogleLogin } from '@react-oauth/google';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const { login, setOtpPending } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await authAPI.login(formData);
      if (data.needOTP) {
        setOtpPending(true);
        navigate(`/verify-otp?email=${formData.email}`);
        return;
      }
      login(data.user, data.token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setLoading(true);
      const { data } = await authAPI.googleLogin(credentialResponse.credential);
      login(data.user, data.token);
      navigate('/');
    } catch {
      setError('Google login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', background: '#f0f4f8',
      display: 'flex', fontFamily: "'DM Sans','Segoe UI',sans-serif",
    }}>

      {/* ── Left panel (decorative) ── */}
      <div style={{
        flex: '0 0 420px', background: '#1a56db',
        display: 'flex', flexDirection: 'column',
        justifyContent: 'center', padding: '3rem',
        position: 'relative', overflow: 'hidden',
      }} className="login-left-panel">
        {/* subtle pattern circles */}
        <div style={{ position: 'absolute', top: -80, right: -80, width: 320, height: 320, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
        <div style={{ position: 'absolute', bottom: -60, left: -60, width: 240, height: 240, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />

        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '3rem', position: 'relative' }}>
          <div style={{ width: 40, height: 40, borderRadius: 11, background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L12 22M2 12L22 12" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>
          <span style={{ fontWeight: 700, fontSize: 18, color: '#fff', letterSpacing: '-0.3px' }}>MediCare Portal</span>
        </div>

        <div style={{ position: 'relative' }}>
          <h1 style={{ fontSize: 32, fontWeight: 800, color: '#fff', margin: '0 0 16px', lineHeight: 1.25, letterSpacing: '-0.5px' }}>
            Your health,<br />our priority.
          </h1>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.75)', lineHeight: 1.7, margin: '0 0 2.5rem' }}>
            Access your medical dashboard, book appointments, and manage your health records in one place.
          </p>

          {/* Feature pills */}
          {['Book doctor appointments', 'View health records', 'Read patient reviews'].map((f, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                  <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.85)' }}>{f}</span>
            </div>
          ))}
        </div>

        <style>{`@media (max-width: 768px) { .login-left-panel { display: none !important; } }`}</style>
      </div>

      {/* ── Right panel (form) ── */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1.5rem' }}>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          style={{ width: '100%', maxWidth: 420 }}
        >
          {/* Header */}
          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: 26, fontWeight: 700, color: '#1e3a5f', margin: '0 0 6px', letterSpacing: '-0.5px' }}>
              Welcome back
            </h2>
            <p style={{ fontSize: 14, color: '#64748b', margin: 0 }}>
              Sign in to manage your health & reviews
            </p>
          </div>

          {/* Error */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
              style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '11px 14px', borderRadius: 10, background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', fontSize: 13, marginBottom: '1.5rem' }}
            >
              <AlertCircle size={15} style={{ flexShrink: 0 }} />
              {error}
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>

            {/* Email */}
            <div>
              <label style={labelStyle}>Email Address</label>
              <div style={{ position: 'relative' }}>
                <div style={iconWrap}><Mail size={15} color="#94a3b8" /></div>
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  autoComplete="email"
                  required
                  style={{ ...inputStyle, paddingLeft: 40 }}
                  onFocus={e => e.target.style.borderColor = '#1a56db'}
                  onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label style={labelStyle}>Password</label>
              <div style={{ position: 'relative' }}>
                <div style={iconWrap}><Lock size={15} color="#94a3b8" /></div>
                <input
                  type={showPass ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  autoComplete="current-password"
                  required
                  style={{ ...inputStyle, paddingLeft: 40, paddingRight: 42 }}
                  onFocus={e => e.target.style.borderColor = '#1a56db'}
                  onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(p => !p)}
                  style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', display: 'flex', padding: 0 }}
                >
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Forgot */}
            <div style={{ textAlign: 'right', marginTop: -4 }}>
              <Link to="/forgot-password" style={{ fontSize: 13, color: '#1a56db', textDecoration: 'none', fontWeight: 500 }}>
                Forgot password?
              </Link>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%', height: 46,
                background: loading ? '#93c5fd' : '#1a56db',
                color: '#fff', border: 'none', borderRadius: 10,
                fontSize: 15, fontWeight: 600,
                cursor: loading ? 'not-allowed' : 'pointer',
                fontFamily: 'inherit', transition: 'background 0.15s',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              }}
            >
              {loading ? (
                <>
                  <div style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                  Signing in…
                </>
              ) : 'Sign In'}
            </button>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

            {/* Divider */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '0.25rem 0' }}>
              <div style={{ flex: 1, height: 1, background: '#e2e8f0' }} />
              <span style={{ fontSize: 12, color: '#94a3b8', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.5px' }}>or</span>
              <div style={{ flex: 1, height: 1, background: '#e2e8f0' }} />
            </div>

            {/* Google */}
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => setError('Google login failed')}
                theme="outline"
                shape="rectangular"
                size="large"
                width="380"
              />
            </div>

            {/* Register link */}
            <p style={{ textAlign: 'center', fontSize: 14, color: '#64748b', margin: '0.5rem 0 0' }}>
              Don't have an account?{' '}
              <Link to="/register" style={{ color: '#1a56db', fontWeight: 600, textDecoration: 'none' }}>
                Create an account
              </Link>
            </p>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

/* ── Shared styles ── */
const labelStyle = {
  display: 'block', fontSize: 12, fontWeight: 700,
  color: '#64748b', textTransform: 'uppercase',
  letterSpacing: '0.5px', marginBottom: 6,
};

const inputStyle = {
  width: '100%', boxSizing: 'border-box',
  height: 44, border: '1.5px solid #e2e8f0',
  borderRadius: 10, padding: '0 14px',
  fontSize: 14, color: '#1e3a5f',
  background: '#fff', outline: 'none',
  fontFamily: 'inherit', transition: 'border-color 0.15s',
};

const iconWrap = {
  position: 'absolute', left: 13,
  top: '50%', transform: 'translateY(-50%)',
  display: 'flex', alignItems: 'center', pointerEvents: 'none',
};

export default Login;