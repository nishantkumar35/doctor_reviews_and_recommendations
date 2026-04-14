import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { User, Settings, History, Briefcase, Star, Trash, Pencil, X, Check, ShieldCheck, ShieldAlert } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import { Link } from 'react-router-dom';
import { reviewAPI, userAPI } from '../services/api';

const UserDashboard = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingReview, setEditingReview] = useState(null);
  const [editComment, setEditComment] = useState('');
  const { user, fetchUserProfile } = useAuth();
  const [toggling2FA, setToggling2FA] = useState(false);

  useEffect(() => {
    if (user) fetchReviews();
  }, [user]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const { data } = await reviewAPI.getUserReviews();
      setReviews(data.reviews);
    } catch (err) {
      console.error('Fetch review error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteReview = async (id) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;
    try {
      await reviewAPI.remove(id);
      await fetchReviews();
    } catch (err) {
      alert('Failed to delete review');
    }
  };

  const handleEditReview = async (id) => {
    try {
      await reviewAPI.edit({ reviewId: id, comment: editComment });
      setEditingReview(null);
      setEditComment('');
      await fetchReviews();
    } catch (err) {
      alert('Failed to update review');
    }
  };

  const handleToggle2FA = async () => {
    try {
      setToggling2FA(true);
      await userAPI.updateProfile({ twoFactorEnabled: !user.twoFactorEnabled });
      await fetchUserProfile();
    } catch (err) {
      alert('Failed to update security settings');
    } finally {
      setToggling2FA(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f0f4f8', fontFamily: "'DM Sans', 'Segoe UI', sans-serif" }}>
      {/* Top header bar */}
      <div style={{
        background: '#fff',
        borderBottom: '1px solid #e2e8f0',
        padding: '0 2rem',
        height: 64,
        display: 'flex',
        alignItems: 'center',
        gap: 12,
      }}>
        <div style={{
          width: 36, height: 36, borderRadius: 10,
          background: '#1a56db', display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L12 22M2 12L22 12" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
          </svg>
        </div>
        <span style={{ fontWeight: 700, fontSize: 17, color: '#1e3a5f', letterSpacing: '-0.3px' }}>
          MediCare Portal
        </span>
        <span style={{
          marginLeft: 'auto', fontSize: 13, color: '#64748b',
          background: '#f1f5f9', padding: '4px 12px', borderRadius: 20,
          border: '1px solid #e2e8f0',
        }}>
          Patient Dashboard
        </span>
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '2rem 1.5rem' }}>

        {/* Page title */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ marginBottom: '2rem' }}
        >
          <h1 style={{ fontSize: 26, fontWeight: 700, color: '#1e3a5f', margin: 0, letterSpacing: '-0.5px' }}>
            My Account
          </h1>
          <p style={{ color: '#64748b', fontSize: 14, marginTop: 4 }}>
            Manage your profile and review history
          </p>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '1.5rem', alignItems: 'start' }}>

          {/* ── LEFT PANEL ── */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            {/* Profile card */}
            <div style={cardStyle}>
              {/* Blue accent top bar */}
              <div style={{
                height: 6, background: 'linear-gradient(90deg, #1a56db, #3b82f6)',
                borderRadius: '12px 12px 0 0', margin: '-1.5rem -1.5rem 1.5rem',
              }} />

              <div style={{ textAlign: 'center' }}>
                <div style={{ position: 'relative', display: 'inline-block', marginBottom: 16 }}>
                  <img
                    src={user?.image || `https://ui-avatars.com/api/?name=${user?.name}&background=1a56db&color=fff&size=128`}
                    alt={user?.name}
                    style={{
                      width: 88, height: 88, borderRadius: '50%',
                      objectFit: 'cover',
                      border: '3px solid #e0eaff',
                      display: 'block',
                    }}
                  />
                  <div style={{
                    position: 'absolute', bottom: 2, right: 2,
                    width: 18, height: 18, borderRadius: '50%',
                    background: '#22c55e', border: '2px solid #fff',
                  }} />
                </div>

                <h2 style={{ fontSize: 18, fontWeight: 700, color: '#1e3a5f', margin: '0 0 4px' }}>
                  {user?.name}
                </h2>
                <p style={{ fontSize: 13, color: '#64748b', margin: '0 0 14px' }}>
                  {user?.email}
                </p>

                <span style={{
                  display: 'inline-block',
                  padding: '4px 14px',
                  borderRadius: 20,
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: '0.6px',
                  textTransform: 'uppercase',
                  background: user?.role === 'doctor' ? '#eff6ff' : '#f0fdf4',
                  color: user?.role === 'doctor' ? '#1a56db' : '#15803d',
                  border: `1px solid ${user?.role === 'doctor' ? '#bfdbfe' : '#bbf7d0'}`,
                }}>
                  {user?.role === 'doctor' ? 'Doctor' : 'Patient'}
                </span>
              </div>

              {/* Divider */}
              <div style={{ borderTop: '1px solid #e8eef6', margin: '1.5rem 0' }} />

              {/* Quick info */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <InfoRow icon={<User size={14} />} label="Account Type" value={user?.role === 'doctor' ? 'Healthcare Provider' : 'Patient'} />
                <InfoRow icon={<History size={14} />} label="Reviews" value={`${reviews.length} submitted`} />
              </div>

              {/* Divider */}
              <div style={{ borderTop: '1px solid #e8eef6', margin: '1.5rem 0' }} />

              {user?.role === 'user' && (
                <div>
                  <p style={{ fontSize: 13, color: '#475569', marginBottom: 10, lineHeight: 1.5 }}>
                    Are you a healthcare professional? Join our provider network.
                  </p>
                  <Link to="/apply-doctor" style={{ textDecoration: 'none' }}>
                    <button style={outlineBtnStyle}>
                      <Briefcase size={14} />
                      Apply as Doctor
                    </button>
                  </Link>
                </div>
              )}

              {user?.role === 'doctor' && (
                <Link to="/dashboard" style={{ textDecoration: 'none' }}>
                  <button style={primaryBtnStyle}>
                    <History size={14} />
                    Professional Dashboard
                  </button>
                </Link>
              )}
            </div>
          </motion.div>

          {/* ── RIGHT PANEL ── */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
          >

            {/* Profile Settings */}
            <div style={cardStyle}>
              <SectionHeader icon={<Settings size={16} color="#1a56db" />} title="Profile Settings" />

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.5rem' }}>
                <FieldDisplay label="Full Name" value={user?.name} />
                <FieldDisplay label="Email Address" value={user?.email} />
              </div>

              <div style={{ display: 'flex', gap: 10 }}>
                <button style={primaryBtnStyle}>Edit Profile</button>
                <button style={outlineBtnStyle}>Change Password</button>
              </div>
            </div>

            {/* Security Settings */}
            <div style={cardStyle}>
              <SectionHeader icon={<ShieldCheck size={16} color="#1a56db" />} title="Security & Privacy" />
              
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                padding: '1rem',
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: 12
              }}>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <div style={{ 
                    width: 40, height: 40, borderRadius: '50%', 
                    background: user?.twoFactorEnabled ? '#f0fdf4' : '#fff1f2',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    border: `1px solid ${user?.twoFactorEnabled ? '#bbf7d0' : '#fecaca'}`
                  }}>
                    {user?.twoFactorEnabled ? <ShieldCheck size={20} color="#16a34a" /> : <ShieldAlert size={20} color="#e11d48" />}
                  </div>
                  <div>
                    <h4 style={{ fontSize: 14, fontWeight: 700, color: '#1e3a5f', margin: 0 }}>Two-Step Verification</h4>
                    <p style={{ fontSize: 12, color: '#64748b', margin: '2px 0 0' }}>
                      {user?.twoFactorEnabled 
                        ? 'Your account is protected with OTP codes' 
                        : 'Enable OTP for extra login security'}
                    </p>
                  </div>
                </div>
                
                <button 
                  onClick={handleToggle2FA}
                  disabled={toggling2FA}
                  style={{
                    padding: '8px 16px',
                    borderRadius: 8,
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: toggling2FA ? 'not-allowed' : 'pointer',
                    transition: 'all 0.15s',
                    background: user?.twoFactorEnabled ? '#fff' : '#1a56db',
                    color: user?.twoFactorEnabled ? '#e11d48' : '#fff',
                    border: user?.twoFactorEnabled ? '1.5px solid #fecaca' : 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6
                  }}
                >
                  {toggling2FA ? (
                    <div style={{ width: 14, height: 14, border: '2px solid rgba(0,0,0,0.1)', borderTopColor: 'currentColor', borderRadius: '50%', animation: 'spin 0.6s linear infinite' }} />
                  ) : user?.twoFactorEnabled ? 'Disable 2FA' : 'Enable 2FA'}
                </button>
              </div>
            </div>

            {/* My Reviews */}
            <div style={cardStyle}>
              <SectionHeader icon={<Star size={16} color="#1a56db" />} title="My Reviews" />

              {loading ? (
                <div style={{ textAlign: 'center', padding: '3rem 0' }}>
                  <div style={{
                    width: 36, height: 36, border: '3px solid #e0eaff',
                    borderTopColor: '#1a56db', borderRadius: '50%',
                    animation: 'spin 0.8s linear infinite',
                    margin: '0 auto 12px',
                  }} />
                  <p style={{ color: '#94a3b8', fontSize: 13 }}>Loading reviews...</p>
                  <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                </div>
              ) : reviews.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {reviews.map((review, index) => (
                    <motion.div
                      key={review._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      style={{
                        background: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        borderRadius: 10,
                        padding: '14px 16px',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                        <div>
                          <p style={{ fontSize: 13, fontWeight: 600, color: '#1e3a5f', margin: '0 0 6px' }}>
                            {review.doctor?.name || 'Doctor'} —{' '}
                            <span style={{ fontWeight: 400, color: '#64748b' }}>
                              {review.doctor?.specialization || 'Specialist'}
                            </span>
                          </p>
                          <div style={{ display: 'flex', gap: 2 }}>
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                size={12}
                                style={{
                                  fill: i < review.rating ? '#f59e0b' : 'transparent',
                                  color: i < review.rating ? '#f59e0b' : '#cbd5e1',
                                }}
                              />
                            ))}
                            <span style={{ fontSize: 11, color: '#94a3b8', marginLeft: 4 }}>
                              {review.rating}/5
                            </span>
                          </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <span style={{ fontSize: 11, color: '#94a3b8' }}>
                            {new Date(review.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </span>
                          <button
                            onClick={() => { setEditingReview(review._id); setEditComment(review.comment); }}
                            style={iconBtnStyle}
                            title="Edit"
                          >
                            <Pencil size={13} />
                          </button>
                          <button
                            onClick={() => handleDeleteReview(review._id)}
                            style={{ ...iconBtnStyle, color: '#ef4444' }}
                            title="Delete"
                          >
                            <Trash size={13} />
                          </button>
                        </div>
                      </div>

                      {editingReview === review._id ? (
                        <div style={{ marginTop: 8 }}>
                          <textarea
                            value={editComment}
                            onChange={(e) => setEditComment(e.target.value)}
                            rows={3}
                            style={{
                              width: '100%', boxSizing: 'border-box',
                              border: '1.5px solid #93c5fd', borderRadius: 8,
                              padding: '8px 12px', fontSize: 13, color: '#1e3a5f',
                              background: '#fff', resize: 'vertical',
                              outline: 'none', fontFamily: 'inherit',
                              lineHeight: 1.6,
                            }}
                          />
                          <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                            <button
                              onClick={() => handleEditReview(review._id)}
                              style={{ ...primaryBtnStyle, padding: '6px 14px', fontSize: 12 }}
                            >
                              <Check size={12} /> Save
                            </button>
                            <button
                              onClick={() => setEditingReview(null)}
                              style={{ ...outlineBtnStyle, padding: '6px 14px', fontSize: 12 }}
                            >
                              <X size={12} /> Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <p style={{
                          fontSize: 13, color: '#475569', lineHeight: 1.6,
                          margin: '8px 0 0', fontStyle: 'italic',
                          display: '-webkit-box', WebkitLineClamp: 3,
                          WebkitBoxOrient: 'vertical', overflow: 'hidden',
                        }}>
                          "{review.comment}"
                        </p>
                      )}
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '3rem 0' }}>
                  <div style={{
                    width: 52, height: 52, borderRadius: '50%',
                    background: '#eff6ff', display: 'flex',
                    alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 14px',
                  }}>
                    <Star size={22} color="#93c5fd" />
                  </div>
                  <p style={{ color: '#94a3b8', fontSize: 14, fontWeight: 500 }}>No reviews yet</p>
                  <p style={{ color: '#cbd5e1', fontSize: 13, marginTop: 4 }}>
                    Your submitted reviews will appear here
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

/* ── Small sub-components ── */

const InfoRow = ({ icon, label, value }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
    <div style={{
      width: 28, height: 28, borderRadius: 8,
      background: '#eff6ff', display: 'flex',
      alignItems: 'center', justifyContent: 'center', color: '#1a56db', flexShrink: 0,
    }}>
      {icon}
    </div>
    <div>
      <p style={{ fontSize: 11, color: '#94a3b8', margin: 0, textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600 }}>
        {label}
      </p>
      <p style={{ fontSize: 13, color: '#1e3a5f', margin: 0, fontWeight: 500 }}>
        {value}
      </p>
    </div>
  </div>
);

const FieldDisplay = ({ label, value }) => (
  <div>
    <label style={{
      display: 'block', fontSize: 11, fontWeight: 700,
      color: '#94a3b8', textTransform: 'uppercase',
      letterSpacing: '0.6px', marginBottom: 6,
    }}>
      {label}
    </label>
    <div style={{
      background: '#f8fafc', border: '1px solid #e2e8f0',
      borderRadius: 8, padding: '9px 14px',
      fontSize: 14, color: '#1e3a5f', fontWeight: 500,
    }}>
      {value}
    </div>
  </div>
);

const SectionHeader = ({ icon, title }) => (
  <div style={{
    display: 'flex', alignItems: 'center', gap: 10,
    marginBottom: '1.5rem', paddingBottom: '1rem',
    borderBottom: '1px solid #e8eef6',
  }}>
    <div style={{
      width: 32, height: 32, borderRadius: 8,
      background: '#eff6ff', display: 'flex',
      alignItems: 'center', justifyContent: 'center',
    }}>
      {icon}
    </div>
    <h3 style={{ fontSize: 15, fontWeight: 700, color: '#1e3a5f', margin: 0 }}>
      {title}
    </h3>
  </div>
);

/* ── Shared styles ── */

const cardStyle = {
  background: '#ffffff',
  border: '1px solid #e2e8f0',
  borderRadius: 14,
  padding: '1.5rem',
  boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
};

const primaryBtnStyle = {
  display: 'inline-flex', alignItems: 'center', gap: 6,
  background: '#1a56db', color: '#fff',
  border: 'none', borderRadius: 8,
  padding: '9px 18px', fontSize: 13, fontWeight: 600,
  cursor: 'pointer', transition: 'background 0.15s',
  fontFamily: 'inherit',
};

const outlineBtnStyle = {
  display: 'inline-flex', alignItems: 'center', gap: 6,
  background: '#fff', color: '#1a56db',
  border: '1.5px solid #93c5fd', borderRadius: 8,
  padding: '9px 18px', fontSize: 13, fontWeight: 600,
  cursor: 'pointer', transition: 'all 0.15s',
  fontFamily: 'inherit',
};

const iconBtnStyle = {
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
  width: 28, height: 28, borderRadius: 6,
  background: 'transparent', border: '1px solid #e2e8f0',
  color: '#64748b', cursor: 'pointer',
  transition: 'all 0.15s',
};

export default UserDashboard;