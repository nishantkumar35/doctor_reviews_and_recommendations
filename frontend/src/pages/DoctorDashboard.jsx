import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  User, Briefcase, MapPin, FileText, Save, CheckCircle,
  Camera, Loader2, MessageSquare, Star, Settings, History,
  Trash, Pencil, X, Check, TrendingUp,
} from "lucide-react";
import { doctorAPI, reviewAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";

/* ─────────────────────────────────────────
   FeedbackItem
───────────────────────────────────────── */
const FeedbackItem = ({ review, user, fetchDoctorReviews }) => {
  const [isReplying, setIsReplying] = useState(false);
  const [replyMsg, setReplyMsg] = useState("");
  const [editingReply, setEditingReply] = useState(null);
  const [editMsg, setEditMsg] = useState("");

  const onAddReply = async () => {
    try {
      await reviewAPI.addReply({ reviewId: review._id, message: replyMsg });
      setReplyMsg(""); setIsReplying(false);
      fetchDoctorReviews();
    } catch { alert("Failed to add reply"); }
  };

  const onEditReply = async (replyId) => {
    try {
      await reviewAPI.editReply({ reviewId: review._id, replyId, message: editMsg });
      setEditingReply(null);
      fetchDoctorReviews();
    } catch { alert("Failed to update reply"); }
  };

  const onDeleteReply = async (replyId) => {
    if (!window.confirm("Delete this reply?")) return;
    try {
      await reviewAPI.removeReply(review._id, replyId);
      fetchDoctorReviews();
    } catch { alert("Failed to delete reply"); }
  };

  return (
    <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 12, padding: "14px 16px" }}>
      {/* Reviewer header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#eff6ff", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <User size={13} color="#1a56db" />
          </div>
          <span style={{ fontSize: 13, fontWeight: 600, color: "#1e3a5f" }}>{review.user?.name}</span>
        </div>
        <div style={{ display: "flex", gap: 2 }}>
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={11} style={{ fill: i < review.rating ? "#f59e0b" : "transparent", color: i < review.rating ? "#f59e0b" : "#cbd5e1" }} />
          ))}
        </div>
      </div>

      <p style={{ fontSize: 13, color: "#475569", fontStyle: "italic", lineHeight: 1.6, margin: "0 0 10px" }}>"{review.comment}"</p>

      {/* Replies */}
      {review.replies?.length > 0 && (
        <div style={{ paddingLeft: 12, borderLeft: "2px solid #bfdbfe", marginBottom: 10, display: "flex", flexDirection: "column", gap: 8 }}>
          {review.replies.map((reply) => (
            <div key={reply._id}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 3 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: "#1a56db", textTransform: "uppercase", letterSpacing: "0.4px" }}>
                  {reply.role}
                </span>
                {reply.sender === user?._id && (
                  <div style={{ display: "flex", gap: 4 }}>
                    <button onClick={() => { setEditingReply(reply._id); setEditMsg(reply.message); }} style={tinyIconBtn}>
                      <Pencil size={10} />
                    </button>
                    <button onClick={() => onDeleteReply(reply._id)} style={{ ...tinyIconBtn, color: "#ef4444" }}>
                      <Trash size={10} />
                    </button>
                  </div>
                )}
              </div>
              {editingReply === reply._id ? (
                <div>
                  <input
                    value={editMsg}
                    onChange={(e) => setEditMsg(e.target.value)}
                    style={{ width: "100%", boxSizing: "border-box", border: "1.5px solid #93c5fd", borderRadius: 7, padding: "5px 10px", fontSize: 12, outline: "none", fontFamily: "inherit", color: "#1e3a5f" }}
                  />
                  <div style={{ display: "flex", gap: 8, marginTop: 5 }}>
                    <button onClick={() => onEditReply(reply._id)} style={{ fontSize: 11, fontWeight: 700, color: "#1a56db", background: "none", border: "none", cursor: "pointer", padding: 0 }}>Save</button>
                    <button onClick={() => setEditingReply(null)} style={{ fontSize: 11, color: "#94a3b8", background: "none", border: "none", cursor: "pointer", padding: 0 }}>Cancel</button>
                  </div>
                </div>
              ) : (
                <p style={{ fontSize: 12, color: "#64748b", margin: 0, lineHeight: 1.5 }}>{reply.message}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add reply */}
      {!isReplying ? (
        <button onClick={() => setIsReplying(true)} style={{ fontSize: 12, fontWeight: 600, color: "#1a56db", background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex", alignItems: "center", gap: 4 }}>
          + Reply
        </button>
      ) : (
        <div>
          <textarea
            rows={2}
            placeholder="Write a reply…"
            value={replyMsg}
            onChange={(e) => setReplyMsg(e.target.value)}
            style={{ width: "100%", boxSizing: "border-box", border: "1.5px solid #93c5fd", borderRadius: 8, padding: "8px 12px", fontSize: 12, outline: "none", fontFamily: "inherit", color: "#1e3a5f", resize: "vertical", background: "#fff" }}
          />
          <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
            <button onClick={onAddReply} style={{ fontSize: 12, fontWeight: 600, background: "#1a56db", color: "#fff", border: "none", borderRadius: 7, padding: "5px 12px", cursor: "pointer", fontFamily: "inherit" }}>
              Post Reply
            </button>
            <button onClick={() => setIsReplying(false)} style={{ fontSize: 12, color: "#64748b", background: "none", border: "none", cursor: "pointer", padding: 0 }}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

/* ─────────────────────────────────────────
   DoctorDashboard
───────────────────────────────────────── */
const DoctorDashboard = () => {
  const { user, fetchUserProfile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [formData, setFormData] = useState({ specialization: "", experience: "", clinicAddress: "", summary: "" });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => { fetchDoctorProfile(); fetchDoctorReviews(); }, []);

  const fetchDoctorProfile = async () => {
    try {
      const { data } = await doctorAPI.getProfile();
      setFormData({ specialization: data.specialization || "", experience: data.experience || "", clinicAddress: data.clinicAddress || "", summary: data.summary || "" });
      setPreview(user?.image);
    } catch { console.error("No doctor profile found."); }
    finally { setLoading(false); }
  };

  const fetchDoctorReviews = async () => {
    try {
      const { data } = await reviewAPI.getDoctorReviews();
      setReviews(data.reviews);
    } catch (err) { console.error(err); }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true); setSuccess(false);
    const fd = new FormData();
    Object.keys(formData).forEach((k) => fd.append(k, formData[k]));
    if (image) fd.append("image", image);
    try {
      await doctorAPI.updateProfile(fd);
      setSuccess(true);
      fetchUserProfile();
      setTimeout(() => setSuccess(false), 3000);
    } catch { alert("Failed to update profile"); }
    finally { setSaving(false); }
  };

  const avgRating = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : "—";

  if (loading) return (
    <div style={{ minHeight: "100vh", background: "#f0f4f8", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Sans','Segoe UI',sans-serif" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ width: 40, height: 40, border: "3px solid #e0eaff", borderTopColor: "#1a56db", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 12px" }} />
        <p style={{ color: "#64748b", fontSize: 14 }}>Loading dashboard…</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#f0f4f8", fontFamily: "'DM Sans','Segoe UI',sans-serif" }}>

      {/* Top bar */}
      <div style={{ background: "#fff", borderBottom: "1px solid #e2e8f0", height: 64, display: "flex", alignItems: "center", padding: "0 2rem", gap: 12 }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: "#1a56db", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L12 22M2 12L22 12" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        </div>
        <span style={{ fontWeight: 700, fontSize: 17, color: "#1e3a5f", letterSpacing: "-0.3px" }}>MediCare Portal</span>
        <span style={{ marginLeft: "auto", fontSize: 13, color: "#64748b", background: "#f1f5f9", padding: "4px 12px", borderRadius: 20, border: "1px solid #e2e8f0" }}>
          Provider Dashboard
        </span>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "2rem 1.5rem" }}>

        {/* Page heading */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.75rem", flexWrap: "wrap", gap: 12 }}>
          <div>
            <h1 style={{ fontSize: 26, fontWeight: 700, color: "#1e3a5f", margin: 0, letterSpacing: "-0.5px" }}>Doctor Dashboard</h1>
            <p style={{ fontSize: 14, color: "#64748b", marginTop: 4 }}>Manage your professional profile and patient engagement</p>
          </div>
          {success && (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              style={{ display: "flex", alignItems: "center", gap: 8, background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 10, padding: "9px 16px", color: "#15803d", fontSize: 13, fontWeight: 600 }}>
              <CheckCircle size={16} /> Profile updated successfully!
            </motion.div>
          )}
        </motion.div>

        {/* Stat cards */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
          style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginBottom: "1.75rem" }}>
          {[
            { label: "Total Reviews", value: reviews.length, icon: <MessageSquare size={16} color="#1a56db" /> },
            { label: "Avg. Rating", value: avgRating, icon: <Star size={16} color="#f59e0b" /> },
            { label: "Experience", value: formData.experience ? `${formData.experience} yrs` : "—", icon: <TrendingUp size={16} color="#1a56db" /> },
          ].map((s, i) => (
            <div key={i} style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, padding: "16px 20px", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <span style={{ fontSize: 12, color: "#64748b", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.4px" }}>{s.label}</span>
                <div style={{ width: 28, height: 28, borderRadius: 8, background: "#eff6ff", display: "flex", alignItems: "center", justifyContent: "center" }}>{s.icon}</div>
              </div>
              <span style={{ fontSize: 26, fontWeight: 700, color: "#1e3a5f" }}>{s.value}</span>
            </div>
          ))}
        </motion.div>

        <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: "1.5rem", alignItems: "start" }}>

          {/* ── LEFT SIDEBAR ── */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>

            {/* Profile card */}
            <div style={card}>
              <div style={{ height: 6, background: "linear-gradient(90deg,#1a56db,#3b82f6)", borderRadius: "12px 12px 0 0", margin: "-1.5rem -1.5rem 1.5rem" }} />
              <div style={{ textAlign: "center" }}>
                <div style={{ position: "relative", display: "inline-block", marginBottom: 14 }}>
                  <img
                    src={preview || `https://ui-avatars.com/api/?name=${user?.name}&background=1a56db&color=fff&size=128`}
                    alt={user?.name}
                    style={{ width: 84, height: 84, borderRadius: 18, objectFit: "cover", border: "3px solid #e0eaff", display: "block" }}
                  />
                  <input type="file" id="doctor-img" style={{ display: "none" }} onChange={handleImageChange} />
                  <label htmlFor="doctor-img" style={{ position: "absolute", bottom: -4, right: -4, width: 26, height: 26, background: "#1a56db", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", border: "2px solid #fff" }}>
                    <Camera size={13} color="#fff" />
                  </label>
                </div>
                <h2 style={{ fontSize: 17, fontWeight: 700, color: "#1e3a5f", margin: "0 0 3px" }}>{user?.name}</h2>
                <p style={{ fontSize: 13, color: "#64748b", margin: "0 0 12px" }}>{user?.email}</p>
                <span style={{ display: "inline-block", padding: "4px 14px", borderRadius: 20, fontSize: 11, fontWeight: 700, letterSpacing: "0.5px", textTransform: "uppercase", background: "#eff6ff", color: "#1a56db", border: "1px solid #bfdbfe" }}>
                  {formData.specialization || "Specialist"}
                </span>
              </div>

              <div style={{ borderTop: "1px solid #e8eef6", margin: "1.25rem 0" }} />
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <InfoRow label="Clinic" value={formData.clinicAddress || "Not set"} />
                <InfoRow label="Experience" value={formData.experience ? `${formData.experience} years` : "Not set"} />
              </div>
            </div>

            {/* Patient Feedback */}
            <div style={card}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem", paddingBottom: "0.75rem", borderBottom: "1px solid #e8eef6" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 30, height: 30, borderRadius: 8, background: "#eff6ff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <MessageSquare size={14} color="#1a56db" />
                  </div>
                  <span style={{ fontSize: 14, fontWeight: 700, color: "#1e3a5f" }}>Patient Feedback</span>
                </div>
                <span style={{ fontSize: 12, color: "#94a3b8" }}>{reviews.length} {reviews.length === 1 ? "review" : "reviews"}</span>
              </div>

              <div style={{ maxHeight: 420, overflowY: "auto", display: "flex", flexDirection: "column", gap: 10, paddingRight: 2 }}>
                {reviews.length > 0 ? reviews.map((review) => (
                  <FeedbackItem key={review._id} review={review} user={user} fetchDoctorReviews={fetchDoctorReviews} />
                )) : (
                  <div style={{ textAlign: "center", padding: "2.5rem 0" }}>
                    <div style={{ width: 44, height: 44, borderRadius: "50%", background: "#eff6ff", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
                      <MessageSquare size={18} color="#93c5fd" />
                    </div>
                    <p style={{ fontSize: 13, color: "#94a3b8", fontWeight: 500, margin: 0 }}>No reviews yet</p>
                    <p style={{ fontSize: 12, color: "#cbd5e1", marginTop: 4 }}>Patient reviews will appear here</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* ── RIGHT: Edit Form ── */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}>
            <div style={card}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: "1.5rem", paddingBottom: "1rem", borderBottom: "1px solid #e8eef6" }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: "#eff6ff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Settings size={16} color="#1a56db" />
                </div>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: "#1e3a5f", margin: 0 }}>Edit Professional Profile</h3>
              </div>

              <form onSubmit={handleSubmit}>
                {/* Row 1 */}
                <SectionLabel icon={<Briefcase size={13} />} title="Professional Info" />
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem", marginBottom: "1.5rem" }}>
                  <FormField label="Specialization" placeholder="e.g. Cardiologist" value={formData.specialization} onChange={(e) => setFormData({ ...formData, specialization: e.target.value })} />
                  <FormField label="Years of Experience" type="number" placeholder="e.g. 10" value={formData.experience} onChange={(e) => setFormData({ ...formData, experience: e.target.value })} min="0" />
                </div>

                {/* Row 2 */}
                <SectionLabel icon={<MapPin size={13} />} title="Location" />
                <div style={{ marginBottom: "1.5rem" }}>
                  <FormField label="Clinic Address" placeholder="123 Health Street, Medical City" value={formData.clinicAddress} onChange={(e) => setFormData({ ...formData, clinicAddress: e.target.value })} />
                </div>

                {/* Row 3 */}
                <SectionLabel icon={<FileText size={13} />} title="Professional Summary" />
                <div style={{ marginBottom: "1.75rem" }}>
                  <label style={labelStyle}>Description</label>
                  <textarea
                    rows={5}
                    placeholder="Describe your medical background, areas of expertise, and approach to patient care…"
                    value={formData.summary}
                    onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                    style={{ width: "100%", boxSizing: "border-box", border: "1.5px solid #e2e8f0", borderRadius: 10, padding: "10px 14px", fontSize: 14, color: "#1e3a5f", background: "#fff", resize: "vertical", outline: "none", fontFamily: "inherit", lineHeight: 1.6, transition: "border-color 0.15s" }}
                    onFocus={(e) => e.target.style.borderColor = "#1a56db"}
                    onBlur={(e) => e.target.style.borderColor = "#e2e8f0"}
                  />
                </div>

                {/* Submit */}
                <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                  <button
                    type="submit"
                    disabled={saving}
                    style={{ display: "inline-flex", alignItems: "center", gap: 7, background: saving ? "#93c5fd" : "#1a56db", color: "#fff", border: "none", borderRadius: 10, padding: "10px 24px", fontSize: 14, fontWeight: 600, cursor: saving ? "not-allowed" : "pointer", fontFamily: "inherit", transition: "background 0.15s" }}>
                    {saving ? <><Loader2 size={16} style={{ animation: "spin 0.8s linear infinite" }} /> Saving…</> : <><Save size={15} /> Save Changes</>}
                  </button>
                  <span style={{ fontSize: 12, color: "#94a3b8" }}>All fields are optional except specialization</span>
                </div>
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

/* ── Shared sub-components ── */

const InfoRow = ({ label, value }) => (
  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
    <span style={{ fontSize: 12, color: "#94a3b8", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.4px" }}>{label}</span>
    <span style={{ fontSize: 13, color: "#1e3a5f", fontWeight: 500, maxWidth: 160, textAlign: "right", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{value}</span>
  </div>
);

const SectionLabel = ({ icon, title }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: "0.85rem" }}>
    <div style={{ width: 24, height: 24, borderRadius: 6, background: "#eff6ff", display: "flex", alignItems: "center", justifyContent: "center", color: "#1a56db" }}>{icon}</div>
    <span style={{ fontSize: 12, fontWeight: 700, color: "#1e3a5f", textTransform: "uppercase", letterSpacing: "0.5px" }}>{title}</span>
  </div>
);

const labelStyle = { display: "block", fontSize: 12, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 6 };

const FormField = ({ label, ...props }) => (
  <div>
    <label style={labelStyle}>{label}</label>
    <input
      {...props}
      style={{ width: "100%", boxSizing: "border-box", height: 42, border: "1.5px solid #e2e8f0", borderRadius: 10, padding: "0 14px", fontSize: 14, color: "#1e3a5f", background: "#fff", outline: "none", fontFamily: "inherit", transition: "border-color 0.15s" }}
      onFocus={(e) => e.target.style.borderColor = "#1a56db"}
      onBlur={(e) => e.target.style.borderColor = "#e2e8f0"}
    />
  </div>
);

const card = { background: "#fff", border: "1px solid #e2e8f0", borderRadius: 14, padding: "1.5rem", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" };
const tinyIconBtn = { display: "inline-flex", alignItems: "center", justifyContent: "center", width: 22, height: 22, borderRadius: 5, background: "transparent", border: "1px solid #e2e8f0", color: "#64748b", cursor: "pointer" };

export default DoctorDashboard;