import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, AlertCircle, Loader2, ArrowLeft, Mail } from 'lucide-react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { authAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const VerifyOTP = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resent, setResent] = useState(false);
  const inputRefs = useRef([]);

  const { login, setOtpPending } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const email = new URLSearchParams(location.search).get('email');

  useEffect(() => {
    if (!email) navigate('/login');
    // Auto-focus first box
    inputRefs.current[0]?.focus();
  }, [email, navigate]);

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return;
    const newOtp = [...otp.map((d, idx) => (idx === index ? element.value : d))];
    setOtp(newOtp);
    if (element.value !== '' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length === 6) {
      setOtp(pasted.split(''));
      inputRefs.current[5]?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpValue = otp.join('');
    if (otpValue.length < 6) { setError('Please enter all 6 digits'); return; }
    setError(''); setLoading(true);
    try {
      const { data } = await authAPI.verifyOTP({ email, otp: otpValue });
      login(data.user, data.token);
      setOtpPending(false);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid or expired OTP. Please try again.');
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResend = () => {
    setResent(true);
    setError('');
    setTimeout(() => setResent(false), 4000);
  };

  const filled = otp.filter(Boolean).length;

  return (
    <div style={{ minHeight: '100vh', background: '#f0f4f8', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1.5rem', fontFamily: "'DM Sans','Segoe UI',sans-serif" }}>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        style={{ width: '100%', maxWidth: 440 }}
      >
        {/* Card */}
        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 18, padding: '2.5rem', boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>

          {/* Back link */}
          <Link to="/login" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#64748b', textDecoration: 'none', fontWeight: 500, marginBottom: '1.75rem' }}>
            <ArrowLeft size={14} /> Back to Login
          </Link>

          {/* Icon + heading */}
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem', border: '4px solid #dbeafe' }}>
              <ShieldCheck size={28} color="#1a56db" />
            </div>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: '#1e3a5f', margin: '0 0 8px', letterSpacing: '-0.4px' }}>
              Two-step verification
            </h2>
            <p style={{ fontSize: 14, color: '#64748b', margin: '0 0 10px', lineHeight: 1.6 }}>
              We sent a 6-digit code to your email
            </p>

            {/* Email badge */}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 20, padding: '5px 14px' }}>
              <Mail size={13} color="#1a56db" />
              <span style={{ fontSize: 13, fontWeight: 600, color: '#1a56db' }}>{email}</span>
            </div>
          </div>

          {/* Error */}
          {error && (
            <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
              style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '11px 14px', borderRadius: 10, background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', fontSize: 13, marginBottom: '1.5rem' }}>
              <AlertCircle size={15} style={{ flexShrink: 0 }} /> {error}
            </motion.div>
          )}

          {/* Resent confirmation */}
          {resent && (
            <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
              style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '11px 14px', borderRadius: 10, background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#15803d', fontSize: 13, marginBottom: '1.5rem' }}>
              <ShieldCheck size={15} style={{ flexShrink: 0 }} /> A new code has been sent to your email.
            </motion.div>
          )}

          <form onSubmit={handleSubmit}>
            {/* OTP inputs */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: 10, marginBottom: '1.75rem' }} onPaste={handlePaste}>
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={el => inputRefs.current[index] = el}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={e => handleChange(e.target, index)}
                  onKeyDown={e => handleKeyDown(e, index)}
                  style={{
                    width: 52, height: 58,
                    textAlign: 'center', fontSize: 22, fontWeight: 700,
                    color: '#1e3a5f', fontFamily: 'inherit',
                    background: digit ? '#eff6ff' : '#f8fafc',
                    border: `2px solid ${digit ? '#1a56db' : '#e2e8f0'}`,
                    borderRadius: 12, outline: 'none',
                    transition: 'all 0.15s', caretColor: '#1a56db',
                  }}
                  onFocus={e => { e.target.style.borderColor = '#1a56db'; e.target.style.boxShadow = '0 0 0 3px rgba(26,86,219,0.1)'; }}
                  onBlur={e => { e.target.style.borderColor = digit ? '#1a56db' : '#e2e8f0'; e.target.style.boxShadow = 'none'; }}
                />
              ))}
            </div>

            {/* Progress indicator */}
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontSize: 12, color: '#94a3b8' }}>{filled} of 6 digits entered</span>
                {filled === 6 && <span style={{ fontSize: 12, color: '#15803d', fontWeight: 600 }}>Ready to verify</span>}
              </div>
              <div style={{ height: 4, background: '#e2e8f0', borderRadius: 99, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${(filled / 6) * 100}%`, background: filled === 6 ? '#16a34a' : '#1a56db', borderRadius: 99, transition: 'width 0.2s, background 0.3s' }} />
              </div>
            </div>

            {/* Submit */}
            <button type="submit" disabled={loading || filled < 6}
              style={{
                width: '100%', height: 46,
                background: filled < 6 ? '#e2e8f0' : loading ? '#93c5fd' : '#1a56db',
                color: filled < 6 ? '#94a3b8' : '#fff',
                border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 600,
                cursor: filled < 6 || loading ? 'not-allowed' : 'pointer',
                fontFamily: 'inherit', transition: 'all 0.15s',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              }}>
              {loading
                ? <><div style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} /> Verifying…</>
                : 'Verify Code'}
            </button>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

            {/* Resend */}
            <p style={{ textAlign: 'center', fontSize: 13, color: '#64748b', marginTop: '1.25rem' }}>
              Didn't receive the code?{' '}
              <button type="button" onClick={handleResend}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#1a56db', fontWeight: 600, fontSize: 13, fontFamily: 'inherit', padding: 0 }}>
                Resend Code
              </button>
            </p>
          </form>
        </div>

        {/* Security note */}
        <p style={{ textAlign: 'center', fontSize: 12, color: '#94a3b8', marginTop: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}>
          <ShieldCheck size={13} /> This code expires in 10 minutes for your security
        </p>
      </motion.div>
    </div>
  );
};

export default VerifyOTP;