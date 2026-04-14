import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { MessageSquare } from "lucide-react";
import { doctorAPI, reviewAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";

import DoctorInfo from "../components/profile/DoctorInfo";
import BookingCard from "../components/profile/BookingCard";
import SimilarDoctors from "../components/profile/SimilarDoctors";
import ReviewsSummary from "../components/profile/ReviewsSummary";
import ReviewList from "../components/profile/ReviewList";

const DoctorProfile = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [doctor, setDoctor] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [similarDoctors, setSimilarDoctors] = useState([]);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const { data: doctorData } = await doctorAPI.getSingle(id);
      const { data: reviewData } = await reviewAPI.getForDoctor(id);
      const { data: similarDoctorsData } = await doctorAPI.getSimilarDoctors(id);
      setDoctor(doctorData);
      setReviews(reviewData.reviews);
      setSimilarDoctors(similarDoctorsData.doctors);
    } catch (err) {
      console.log(err.response?.data);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleReviewSubmit = async (newReview) => {
    try {
      await reviewAPI.add({ doctorId: id, ...newReview });
      fetchData();
    } catch {
      alert("Failed to add review");
    }
  };

  const handleReplySubmit = async (reviewId, activeReply, message) => {
    try {
      if (activeReply?.type === "editReply") {
        await reviewAPI.editReply({ reviewId, replyId: activeReply.replyId, message });
      } else {
        await reviewAPI.addReply({ reviewId, message });
      }
      fetchData();
    } catch {
      alert("Failed to process reply");
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm("Delete this review?")) return;
    try {
      await reviewAPI.remove(reviewId);
      fetchData();
    } catch {
      alert("Failed to delete review");
    }
  };

  const handleEditReview = async (reviewId, comment) => {
    try {
      await reviewAPI.edit({ reviewId, comment });
      fetchData();
    } catch {
      alert("Failed to update review");
    }
  };

  const handleDeleteReply = async (reviewId, replyId) => {
    if (!window.confirm("Delete this reply?")) return;
    try {
      await reviewAPI.removeReply(reviewId, replyId);
      fetchData();
    } catch {
      alert("Failed to delete reply");
    }
  };

  /* ── Loading state ── */
  if (loading) return (
    <div style={pageWrap}>
      <TopBar />
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{
            width: 44, height: 44,
            border: "3px solid #e0eaff",
            borderTopColor: "#1a56db",
            borderRadius: "50%",
            animation: "spin 0.8s linear infinite",
            margin: "0 auto 14px",
          }} />
          <p style={{ color: "#64748b", fontSize: 14, fontWeight: 500 }}>Loading doctor profile…</p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    </div>
  );

  /* ── Not found state ── */
  if (!doctor) return (
    <div style={pageWrap}>
      <TopBar />
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{
            width: 56, height: 56, borderRadius: "50%",
            background: "#fef2f2", display: "flex",
            alignItems: "center", justifyContent: "center",
            margin: "0 auto 16px",
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="#ef4444" strokeWidth="2" />
              <path d="M12 8v4M12 16h.01" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: "#1e3a5f", margin: "0 0 6px" }}>Doctor Not Found</h2>
          <p style={{ fontSize: 14, color: "#94a3b8" }}>The profile you're looking for doesn't exist or has been removed.</p>
        </div>
      </div>
    </div>
  );

  /* ── Main profile ── */
  return (
    <div style={pageWrap}>
      <TopBar />

      {/* Breadcrumb */}
      <div style={{ background: "#fff", borderBottom: "1px solid #e2e8f0" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "10px 1.5rem", display: "flex", alignItems: "center", gap: 6 }}>
          <a href="/" style={{ fontSize: 13, color: "#64748b", textDecoration: "none" }}>Home</a>
          <span style={{ color: "#cbd5e1", fontSize: 13 }}>/</span>
          <a href="/doctors" style={{ fontSize: 13, color: "#64748b", textDecoration: "none" }}>Doctors</a>
          <span style={{ color: "#cbd5e1", fontSize: 13 }}>/</span>
          <span style={{ fontSize: 13, color: "#1a56db", fontWeight: 600 }}>{doctor?.name}</span>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "2rem 1.5rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: "1.75rem", alignItems: "start" }}>

          {/* ── Left: profile info + reviews ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1.75rem" }}>

            {/* DoctorInfo wrapped in a card */}
            <div style={card}>
              <DoctorInfo doctor={doctor} />
            </div>

            {/* Reviews section */}
            <div style={card}>
              <div style={{
                display: "flex", alignItems: "center", gap: 10,
                marginBottom: "1.5rem", paddingBottom: "1rem",
                borderBottom: "1px solid #e8eef6",
              }}>
                <div style={{
                  width: 34, height: 34, borderRadius: 9,
                  background: "#eff6ff", display: "flex",
                  alignItems: "center", justifyContent: "center",
                }}>
                  <MessageSquare size={16} color="#1a56db" />
                </div>
                <h2 style={{ fontSize: 16, fontWeight: 700, color: "#1e3a5f", margin: 0 }}>
                  Patient Reviews
                </h2>
                <span style={{
                  marginLeft: "auto", fontSize: 12, fontWeight: 600,
                  color: "#1a56db", background: "#eff6ff",
                  border: "1px solid #bfdbfe", borderRadius: 20,
                  padding: "3px 10px",
                }}>
                  {reviews.length} {reviews.length === 1 ? "review" : "reviews"}
                </span>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                <ReviewsSummary
                  doctor={doctor}
                  reviews={reviews}
                  user={user}
                  onReviewSubmit={handleReviewSubmit}
                />
                <ReviewList
                  reviews={reviews}
                  user={user}
                  onDeleteReview={handleDeleteReview}
                  onEditReview={handleEditReview}
                  onReplySubmit={handleReplySubmit}
                  onDeleteReply={handleDeleteReply}
                />
              </div>
            </div>
          </div>

          {/* ── Right: booking + similar doctors ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", position: "sticky", top: "1.5rem" }}>
            <div style={card}>
              <BookingCard />
            </div>
            <div style={card}>
              <SimilarDoctors similarDoctors={similarDoctors} />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

/* ── Shared layout pieces ── */

const TopBar = () => (
  <div style={{
    background: "#fff", borderBottom: "1px solid #e2e8f0",
    height: 64, display: "flex", alignItems: "center",
    padding: "0 2rem", gap: 12,
  }}>
    <div style={{ width: 36, height: 36, borderRadius: 10, background: "#1a56db", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path d="M12 2L12 22M2 12L22 12" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    </div>
    <span style={{ fontWeight: 700, fontSize: 17, color: "#1e3a5f", letterSpacing: "-0.3px" }}>
      MediCare Portal
    </span>
    <span style={{
      marginLeft: "auto", fontSize: 13, color: "#64748b",
      background: "#f1f5f9", padding: "4px 12px",
      borderRadius: 20, border: "1px solid #e2e8f0",
    }}>
      Doctor Profile
    </span>
  </div>
);

const card = {
  background: "#ffffff",
  border: "1px solid #e2e8f0",
  borderRadius: 14,
  padding: "1.5rem",
  boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
};

const pageWrap = {
  minHeight: "100vh",
  background: "#f0f4f8",
  fontFamily: "'DM Sans','Segoe UI',sans-serif",
};

export default DoctorProfile;