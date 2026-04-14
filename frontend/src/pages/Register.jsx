import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  User, Mail, Lock, AlertCircle, Camera,
  CheckCircle2, ShieldCheck, ShieldAlert, Eye, EyeOff,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { GoogleLogin } from '@react-oauth/google';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '', email: '', password: '',
    role: 'user', image: null, twoFactorEnabled: true,
  });
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    const data = new FormData();
    data.append('name', formData.name);
    data.append('email', formData.email);
    data.append('password', formData.password);
    data.append('role', formData.role);
    data.append('twoFactorEnabled', formData.twoFactorEnabled);
    if (formData.image) data.append('image', formData.image);
    try {
      await authAPI.register(data);
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2500);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.');
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

  /* ── Success screen ── */
  if (success) return (
    <div style={{ minHeight: '100vh', background: '#f0f4f8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'DM Sans','Segoe UI',sans-serif" }}>
      <motion.div initial={{ scale: 0.92, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.4 }}
        style={{ background: '#fff', borderRadius: 20, padding: '3rem 2.5rem', textAlign: 'center', maxWidth: 400, width: '90%', border: '1px solid #e2e8f0', boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>
        <div style={{ width: 72, height: 72, borderRadius: '50%', background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
          <CheckCircle2 size={36} color="#16a34a" />
        </div>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: '#1e3a5f', margin: '0 0 10px' }}>Account Created!</h2>
        <p style={{ fontSize: 14, color: '#64748b', lineHeight: 1.6, margin: 0 }}>
          Your account is ready. Redirecting you to sign in…
        </p>
        <div style={{ marginTop: 24, height: 4, borderRadius: 99, background: '#e0eaff', overflow: 'hidden' }}>
          <motion.div initial={{ width: 0 }} animate={{ width: '100%' }} transition={{ duration: 2.5, ease: 'linear' }}
            style={{ height: '100%', background: '#1a56db', borderRadius: 99 }} />
        </div>
      </motion.div>
    </div>
  );

  /* ── Main form ── */
  return (
    <div style={{ minHeight: '100vh', background: '#f0f4f8', display: 'flex', fontFamily: "'DM Sans','Segoe UI',sans-serif" }}>

      {/* ── Left decorative panel ── */}
      <div style={{ flex: '0 0 380px', background: '#1a56db', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '3rem', position: 'relative', overflow: 'hidden' }} className="reg-left-panel">
        <div style={{ position: 'absolute', top: -80, right: -80, width: 300, height: 300, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
        <div style={{ position: 'absolute', bottom: -60, left: -60, width: 220, height: 220, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '3rem', position: 'relative' }}>
          <div style={{ width: 40, height: 40, borderRadius: 11, background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L12 22M2 12L22 12" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>
          <span style={{ fontWeight: 700, fontSize: 18, color: '#fff', letterSpacing: '-0.3px' }}>MediCare Portal</span>
        </div>

        <div style={{ position: 'relative' }}>
          <h1 style={{ fontSize: 30, fontWeight: 800, color: '#fff', margin: '0 0 14px', lineHeight: 1.3, letterSpacing: '-0.5px' }}>
            Join thousands of patients & doctors.
          </h1>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.75)', lineHeight: 1.7, margin: '0 0 2.5rem' }}>
            Create your free account and start managing appointments, reviews, and health records today.
          </p>
          {['Free to create an account', 'Secure & private health data', 'Verified doctor profiles', '2-step security built in'].map((f, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 13 }}>
              <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                  <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.85)' }}>{f}</span>
            </div>
          ))}
        </div>
        <style>{`@media (max-width: 820px) { .reg-left-panel { display: none !important; } }`}</style>
      </div>

      {/* ── Right: form ── */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2.5rem 1.5rem', overflowY: 'auto' }}>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} style={{ width: '100%', maxWidth: 460 }}>

          <div style={{ marginBottom: '1.75rem' }}>
            <h2 style={{ fontSize: 24, fontWeight: 700, color: '#1e3a5f', margin: '0 0 5px', letterSpacing: '-0.4px' }}>Create your account</h2>
            <p style={{ fontSize: 14, color: '#64748b', margin: 0 }}>Join DoctorReview to find the best care</p>
          </div>

          {/* Error */}
          {error && (
            <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
              style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '11px 14px', borderRadius: 10, background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', fontSize: 13, marginBottom: '1.25rem' }}>
              <AlertCircle size={15} style={{ flexShrink: 0 }} /> {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>

            {/* Avatar upload */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '14px 16px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 12 }}>
              <div style={{ position: 'relative', flexShrink: 0 }}>
                <div style={{ width: 60, height: 60, borderRadius: '50%', background: '#eff6ff', border: '2px dashed #93c5fd', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                  {preview
                    ? <img src={preview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : <Camera size={20} color="#93c5fd" />}
                </div>
                <input type="file" id="image-upload" style={{ display: 'none' }} onChange={handleImageChange} accept="image/*" />
                <label htmlFor="image-upload" style={{ position: 'absolute', bottom: -2, right: -2, width: 22, height: 22, background: '#1a56db', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', border: '2px solid #fff' }}>
                  <Camera size={10} color="#fff" />
                </label>
              </div>
              <div>
                <p style={{ fontSize: 13, fontWeight: 600, color: '#1e3a5f', margin: '0 0 2px' }}>Profile Photo</p>
                <p style={{ fontSize: 12, color: '#94a3b8', margin: 0 }}>Optional — helps doctors recognise you</p>
              </div>
            </div>

            {/* Name + Email row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={labelStyle}>Full Name</label>
                <div style={{ position: 'relative' }}>
                  <div style={iconWrap}><User size={14} color="#94a3b8" /></div>
                  <input type="text" placeholder="John Doe" value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    autoComplete="name"
                    required style={{ ...inputStyle, paddingLeft: 38 }}
                    onFocus={e => e.target.style.borderColor = '#1a56db'}
                    onBlur={e => e.target.style.borderColor = '#e2e8f0'} />
                </div>
              </div>
              <div>
                <label style={labelStyle}>Email Address</label>
                <div style={{ position: 'relative' }}>
                  <div style={iconWrap}><Mail size={14} color="#94a3b8" /></div>
                  <input type="email" placeholder="name@example.com" value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    autoComplete="email"
                    required style={{ ...inputStyle, paddingLeft: 38 }}
                    onFocus={e => e.target.style.borderColor = '#1a56db'}
                    onBlur={e => e.target.style.borderColor = '#e2e8f0'} />
                </div>
              </div>
            </div>

            {/* Password */}
            <div>
              <label style={labelStyle}>Password</label>
              <div style={{ position: 'relative' }}>
                <div style={iconWrap}><Lock size={14} color="#94a3b8" /></div>
                 <input type={showPass ? 'text' : 'password'} placeholder="Min. 8 characters" value={formData.password}
                  onChange={e => setFormData({ ...formData, password: e.target.value })}
                  autoComplete="new-password"
                  required style={{ ...inputStyle, paddingLeft: 38, paddingRight: 42 }}
                  onFocus={e => e.target.style.borderColor = '#1a56db'}
                  onBlur={e => e.target.style.borderColor = '#e2e8f0'} />
                <button type="button" onClick={() => setShowPass(p => !p)}
                  style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', display: 'flex', padding: 0 }}>
                  {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            {/* Role + 2FA row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              {/* Role selector */}
              <div>
                <label style={labelStyle}>Register as</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  {['user', 'doctor'].map((role) => (
                    <button key={role} type="button" onClick={() => setFormData({ ...formData, role })}
                      style={{
                        padding: '9px 0', borderRadius: 9, fontSize: 13, fontWeight: 600,
                        cursor: 'pointer', border: '1.5px solid', fontFamily: 'inherit',
                        textTransform: 'capitalize', transition: 'all 0.15s',
                        background: formData.role === role ? '#eff6ff' : '#fff',
                        borderColor: formData.role === role ? '#1a56db' : '#e2e8f0',
                        color: formData.role === role ? '#1a56db' : '#64748b',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                      }}>
                      <div style={{ width: 14, height: 14, borderRadius: '50%', border: `2px solid ${formData.role === role ? '#1a56db' : '#cbd5e1'}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {formData.role === role && <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#1a56db' }} />}
                      </div>
                      {role}
                    </button>
                  ))}
                </div>
              </div>

              {/* 2FA toggle */}
              <div>
                <label style={labelStyle}>Security</label>
                <button type="button" onClick={() => setFormData({ ...formData, twoFactorEnabled: !formData.twoFactorEnabled })}
                  style={{
                    width: '100%', height: 42, borderRadius: 9, fontSize: 13, fontWeight: 600,
                    cursor: 'pointer', border: '1.5px solid', fontFamily: 'inherit',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
                    transition: 'all 0.15s',
                    background: formData.twoFactorEnabled ? '#f0fdf4' : '#fff',
                    borderColor: formData.twoFactorEnabled ? '#86efac' : '#e2e8f0',
                    color: formData.twoFactorEnabled ? '#15803d' : '#64748b',
                  }}>
                  {formData.twoFactorEnabled ? <ShieldCheck size={15} /> : <ShieldAlert size={15} />}
                  2-Step OTP {formData.twoFactorEnabled ? 'On' : 'Off'}
                </button>
                <p style={{ fontSize: 11, color: '#94a3b8', marginTop: 5 }}>
                  {formData.twoFactorEnabled ? 'Extra security enabled — recommended' : 'Click to enable 2-step login'}
                </p>
              </div>
            </div>

            {/* Submit */}
            <button type="submit" disabled={loading}
              style={{ width: '100%', height: 46, background: loading ? '#93c5fd' : '#1a56db', color: '#fff', border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'inherit', transition: 'background 0.15s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 4 }}>
              {loading ? (
                <><div style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} /> Creating account…</>
              ) : 'Create Account'}
            </button>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

            {/* Divider */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ flex: 1, height: 1, background: '#e2e8f0' }} />
              <span style={{ fontSize: 12, color: '#94a3b8', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.5px' }}>or</span>
              <div style={{ flex: 1, height: 1, background: '#e2e8f0' }} />
            </div>

            {/* Google */}
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <GoogleLogin onSuccess={handleGoogleSuccess} onError={() => setError('Google login failed')} theme="outline" shape="rectangular" size="large" width="420" />
            </div>

            {/* Sign in link */}
            <p style={{ textAlign: 'center', fontSize: 14, color: '#64748b', margin: '0.25rem 0 0' }}>
              Already have an account?{' '}
              <Link to="/login" style={{ color: '#1a56db', fontWeight: 600, textDecoration: 'none' }}>Sign in instead</Link>
            </p>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

/* ── Shared styles ── */
const labelStyle = { display: 'block', fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 6 };
const inputStyle = { width: '100%', boxSizing: 'border-box', height: 42, border: '1.5px solid #e2e8f0', borderRadius: 10, padding: '0 14px', fontSize: 14, color: '#1e3a5f', background: '#fff', outline: 'none', fontFamily: 'inherit', transition: 'border-color 0.15s' };
const iconWrap = { position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', display: 'flex', alignItems: 'center', pointerEvents: 'none' };

export default Register;