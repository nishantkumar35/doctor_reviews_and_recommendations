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
      setReviews(reviewData);
      setSimilarDoctors(similarDoctorsData);
    } catch (err) {
      console.log(err.response?.data);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleReviewSubmit = async (newReview) => {
    try {
      await reviewAPI.add({
        doctorId: id,
        ...newReview,
      });
      fetchData();
    } catch (err) {
      alert("Failed to add review");
    }
  };

  const handleReplySubmit = async (reviewId, activeReply, message) => {
    try {
      if (activeReply?.type === "editReply") {
        await reviewAPI.editReply({
          reviewId,
          replyId: activeReply.replyId,
          message,
        });
      } else {
        await reviewAPI.addReply({ reviewId, message });
      }
      fetchData();
    } catch (err) {
      alert("Failed to process reply");
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm("Delete this review?")) return;
    try {
      await reviewAPI.remove(reviewId);
      fetchData();
    } catch (err) {
      alert("Failed to delete review");
    }
  };

  const handleEditReview = async (reviewId, comment) => {
    try {
      await reviewAPI.edit({ reviewId, comment });
      fetchData();
    } catch (err) {
      alert("Failed to update review");
    }
  };

  const handleDeleteReply = async (reviewId, replyId) => {
    if (!window.confirm("Delete this reply?")) return;
    try {
      await reviewAPI.removeReply(reviewId, replyId);
      fetchData();
    } catch (err) {
      alert("Failed to delete reply");
    }
  };

  if (loading)
    return (
      <div className="py-20 text-center animate-pulse text-slate-400">
        Loading profile...
      </div>
    );
  if (!doctor)
    return (
      <div className="py-20 text-center text-accent">Doctor not found</div>
    );

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left: Profile Info */}
        <div className="lg:col-span-2 space-y-12">
          <DoctorInfo doctor={doctor} />

          <div className="space-y-8">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <MessageSquare className="text-primary" />
              Patient Reviews ({reviews.length})
            </h2>

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

        {/* Right: Booking Actions */}
        <div className="space-y-8">
          <BookingCard />
          <SimilarDoctors similarDoctors={similarDoctors} />
        </div>
      </div>
    </div>
  );
};

export default DoctorProfile;
