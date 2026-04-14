import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, MapPin, FileText, User, Save, Loader2, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { userAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const ApplyDoctor = () => {
  const [formData, setFormData] = useState({
    specialization: '',
    experience: '',
    clinicAddress: '',
    summary: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const { fetchUserProfile } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await userAPI.applyDoctor(formData);
      setSuccess(true);
      await fetchUserProfile();
      setTimeout(() => navigate('/dashboard'), 2500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit application.');
    } finally {
      setLoading(false);
    }
  };

  const update = (field) => (e) => setFormData({ ...formData, [field]: e.target.value });

  /* ── Success screen ── */
  if (success) {
    return (
      <div style={{ minHeight: '100vh', background: '#f0f4f8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'DM Sans','Segoe UI',sans-serif" }}>
        <motion.div
          initial={{ scale: 0.92, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4 }}
          style={{ background: '#fff', borderRadius: 20, padding: '3rem 2.5rem', textAlign: 'center', maxWidth: 400, width: '90%', border: '1px solid #e2e8f0', boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}
        >
          <div style={{ width: 72, height: 72, borderRadius: '50%', background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
            <CheckCircle size={36} color="#16a34a" />
          </div>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: '#1e3a5f', margin: '0 0 10px' }}>Application Submitted!</h2>
          <p style={{ fontSize: 14, color: '#64748b', lineHeight: 1.6, margin: 0 }}>
            Your doctor profile is now active. Redirecting you to the dashboard…
          </p>
          <div style={{ marginTop: 24, height: 4, borderRadius: 99, background: '#e0eaff', overflow: 'hidden' }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ duration: 2.5, ease: 'linear' }}
              style={{ height: '100%', background: '#1a56db', borderRadius: 99 }}
            />
          </div>
        </motion.div>
      </div>
    );
  }

  /* ── Main form ── */
  return (
    <div style={{ minHeight: '100vh', background: '#f0f4f8', fontFamily: "'DM Sans','Segoe UI',sans-serif" }}>

      {/* Top bar */}
      <div style={{ background: '#fff', borderBottom: '1px solid #e2e8f0', height: 64, display: 'flex', alignItems: 'center', padding: '0 2rem', gap: 12 }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: '#1a56db', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L12 22M2 12L22 12" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        </div>
        <span style={{ fontWeight: 700, fontSize: 17, color: '#1e3a5f', letterSpacing: '-0.3px' }}>MediCare Portal</span>
        <Link to="/user-dashboard" style={{ marginLeft: 'auto', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#1a56db', fontWeight: 500 }}>
          <ArrowLeft size={14} /> Back to Account
        </Link>
      </div>

      <div style={{ maxWidth: 720, margin: '0 auto', padding: '2.5rem 1.5rem' }}>

        {/* Page header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 8 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Briefcase size={20} color="#1a56db" />
            </div>
            <div>
              <h1 style={{ fontSize: 24, fontWeight: 700, color: '#1e3a5f', margin: 0, letterSpacing: '-0.4px' }}>
                Doctor Application
              </h1>
              <p style={{ fontSize: 13, color: '#64748b', margin: 0 }}>
                Complete your professional profile to start interacting with patients
              </p>
            </div>
          </div>
        </motion.div>

        {/* Steps indicator */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} style={{ display: 'flex', gap: 8, marginBottom: '1.75rem' }}>
          {['Professional Info', 'Location', 'Summary'].map((step, i) => (
            <div key={i} style={{ flex: 1, textAlign: 'center' }}>
              <div style={{ height: 4, borderRadius: 99, background: i === 0 ? '#1a56db' : i === 1 ? '#93c5fd' : '#dbeafe', marginBottom: 6 }} />
              <span style={{ fontSize: 11, color: i === 0 ? '#1a56db' : '#94a3b8', fontWeight: i === 0 ? 600 : 400 }}>{step}</span>
            </div>
          ))}
        </motion.div>

        {/* Error banner */}
        {error && (
          <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', borderRadius: 10, background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', fontSize: 13, marginBottom: '1.5rem' }}>
            <AlertCircle size={16} style={{ flexShrink: 0 }} />
            {error}
          </motion.div>
        )}

        {/* Form card */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 16, padding: '2rem', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>

          <form onSubmit={handleSubmit}>

            {/* Section: Professional Info */}
            <SectionLabel icon={<Briefcase size={14} />} title="Professional Information" />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.75rem' }}>
              <FormField
                label="Specialization"
                placeholder="e.g. Cardiologist"
                value={formData.specialization}
                onChange={update('specialization')}
                required
              />
              <FormField
                label="Years of Experience"
                type="number"
                placeholder="e.g. 10"
                value={formData.experience}
                onChange={update('experience')}
                required
                min="0"
              />
            </div>

            {/* Section: Location */}
            <SectionLabel icon={<MapPin size={14} />} title="Clinic Location" />
            <div style={{ marginBottom: '1.75rem' }}>
              <FormField
                label="Clinic Address"
                placeholder="123 Health Street, Medical City"
                value={formData.clinicAddress}
                onChange={update('clinicAddress')}
                required
              />
            </div>

            {/* Section: Summary */}
            <SectionLabel icon={<FileText size={14} />} title="Professional Summary" />
            <div style={{ marginBottom: '2rem' }}>
              <label style={labelStyle}>Brief description of your expertise</label>
              <textarea
                value={formData.summary}
                onChange={update('summary')}
                required
                rows={5}
                placeholder="Describe your medical background, areas of expertise, approach to patient care…"
                style={{
                  width: '100%', boxSizing: 'border-box',
                  border: '1.5px solid #e2e8f0', borderRadius: 10,
                  padding: '10px 14px', fontSize: 14, color: '#1e3a5f',
                  background: '#fff', resize: 'vertical', outline: 'none',
                  fontFamily: 'inherit', lineHeight: 1.6,
                  transition: 'border-color 0.15s',
                }}
                onFocus={e => e.target.style.borderColor = '#1a56db'}
                onBlur={e => e.target.style.borderColor = '#e2e8f0'}
              />
            </div>

            {/* Notice box */}
            <div style={{ display: 'flex', gap: 12, padding: '14px 16px', background: '#eff6ff', borderRadius: 10, border: '1px solid #bfdbfe', marginBottom: '1.75rem' }}>
              <div style={{ width: 20, height: 20, borderRadius: '50%', background: '#1a56db', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                <span style={{ color: '#fff', fontSize: 11, fontWeight: 700 }}>i</span>
              </div>
              <p style={{ fontSize: 13, color: '#1e40af', margin: 0, lineHeight: 1.6 }}>
                Your application will be reviewed by our medical board. Once approved, you'll have full access to the provider dashboard and can start accepting patient appointments.
              </p>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%', height: 48,
                background: loading ? '#93c5fd' : '#1a56db',
                color: '#fff', border: 'none', borderRadius: 10,
                fontSize: 15, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                fontFamily: 'inherit', transition: 'background 0.15s',
              }}
            >
              {loading ? (
                <>
                  <Loader2 size={18} style={{ animation: 'spin 0.8s linear infinite' }} />
                  Submitting Application…
                </>
              ) : (
                <>
                  <Save size={17} />
                  Submit Application
                </>
              )}
            </button>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

/* ── Sub-components ── */

const SectionLabel = ({ icon, title }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '1rem' }}>
    <div style={{ width: 26, height: 26, borderRadius: 7, background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1a56db' }}>
      {icon}
    </div>
    <span style={{ fontSize: 13, fontWeight: 700, color: '#1e3a5f', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
      {title}
    </span>
  </div>
);

const labelStyle = {
  display: 'block', fontSize: 12, fontWeight: 700,
  color: '#64748b', textTransform: 'uppercase',
  letterSpacing: '0.5px', marginBottom: 6,
};

const FormField = ({ label, ...props }) => (
  <div>
    <label style={labelStyle}>{label}</label>
    <input
      {...props}
      style={{
        width: '100%', boxSizing: 'border-box',
        height: 42, border: '1.5px solid #e2e8f0',
        borderRadius: 10, padding: '0 14px',
        fontSize: 14, color: '#1e3a5f',
        background: '#fff', outline: 'none',
        fontFamily: 'inherit',
        transition: 'border-color 0.15s',
      }}
      onFocus={e => e.target.style.borderColor = '#1a56db'}
      onBlur={e => e.target.style.borderColor = '#e2e8f0'}
    />
  </div>
);

export default ApplyDoctor;