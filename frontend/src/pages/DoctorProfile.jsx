import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Star,
  MapPin,
  Calendar,
  Clock,
  Award,
  MessageSquare,
  Send,
  Reply,
  ChevronDown,
  User,
  Settings,
  Trash,
  ArrowRight,
  FileText,
} from "lucide-react";
import { doctorAPI, reviewAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";

const DoctorProfile = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [doctor, setDoctor] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newReview, setNewReview] = useState({ rating: 5, comment: "" });
  const [replyText, setReplyText] = useState({});
  const [activeReply, setActiveReply] = useState(null);
  const [similarDoctors, setSimilarDoctors] = useState([]);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const { data: doctorData } = await doctorAPI.getSingle(id);
      const { data: reviewData } = await reviewAPI.getForDoctor(id);
      const { data: similarDoctors } = await doctorAPI.getSimilarDoctors(id);
      setDoctor(doctorData);
      setReviews(reviewData);
      setSimilarDoctors(similarDoctors);
    } catch (err) {
      console.log(err.response?.data);   // ⭐ IMPORTANT
    console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) return alert("Please login to leave a review");
    try {
      await reviewAPI.add({
        doctorId: id,
        ...newReview,
      });
      setNewReview({ rating: 5, comment: "" });
      fetchData();
    } catch (err) {
      alert("Failed to add review");
    }
  };

  const handleReplySubmit = async (reviewId) => {
    try {
      if (activeReply?.type === "editReply") {
        await reviewAPI.editReply({
          reviewId,
          replyId: activeReply.id,
          message: replyText[reviewId],
        });
      } else {
        await reviewAPI.addReply({ reviewId, message: replyText[reviewId] });
      }
      setReplyText((prev) => ({ ...prev, [reviewId]: "" }));
      setActiveReply(null);
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
      setActiveReply(null);
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
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass p-8 rounded-[2.5rem] flex flex-col md:flex-row gap-8 items-center md:items-start"
          >
            <div className="relative">
              <img
                src={
                  doctor.userId?.image ||
                  `https://ui-avatars.com/api/?name=${doctor.userId?.name}`
                }
                alt={doctor.userId?.name}
                className="w-48 h-48 rounded-[2rem] object-cover border-4 border-white/5"
              />
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-primary px-4 py-1.5 rounded-full text-white text-sm font-bold shadow-lg flex items-center gap-2 whitespace-nowrap">
                <Star size={16} className="fill-white" />
                {doctor.averageRating || 0} ({doctor.reviewCount || 0} Reviews)
              </div>
            </div>

            <div className="flex-1 text-center md:text-left pt-2">
              <h1 className="text-4xl font-bold text-white mb-2">
                {doctor.userId?.name}
              </h1>
              <p className="text-primary font-medium text-lg mb-4">
                {doctor.specialization}
              </p>

              <div className="flex flex-wrap justify-center md:justify-start gap-4 mb-6">
                <span className="flex items-center gap-2 text-slate-400 text-sm bg-white/5 px-4 py-2 rounded-xl border border-white/5">
                  <Award size={18} className="text-primary" />
                  {doctor.experience} Yrs Experience
                </span>
                <span className="flex items-center gap-2 text-slate-400 text-sm bg-white/5 px-4 py-2 rounded-xl border border-white/5">
                  <MapPin size={18} className="text-primary" />
                  {doctor.clinicAddress}
                </span>
              </div>

              <p className="text-slate-400 leading-relaxed italic border-l-4 border-primary/20 pl-4 py-2">
                "
                {doctor.summary ||
                  "A dedicated medical professional committed to providing the best care for patients."}
                "
              </p>
            </div>
          </motion.div>
          <div className="space-y-8">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <MessageSquare className="text-primary" />
              Patient Reviews ({reviews.length})
            </h2>
            {/* Review Summary + Add Review Combined */}
            <div className="glass p-8 rounded-3xl space-y-8">
              {/* ⭐ Rating Overview */}
              <div>
                <h3 className="text-lg font-bold text-white mb-4 uppercase tracking-wider opacity-80">
                  Rating
                </h3>

                <div className="flex items-center gap-4 bg-white/5 py-4 px-5 rounded-2xl mb-6">
                  <div className="flex gap-1 text-yellow-500">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={20}
                        fill={
                          star <= Math.round(doctor.averageRating)
                            ? "currentColor"
                            : "none"
                        }
                      />
                    ))}
                  </div>
                  <span className="text-slate-400 font-bold">
                    {doctor.averageRating || 0} out of 5
                  </span>
                </div>

                <div className="space-y-3">
                  {[5, 4, 3, 2, 1].map((star) => {
                    const count = reviews.filter(
                      (r) => r.rating === star,
                    ).length;
                    const percentage =
                      reviews.length > 0 ? (count / reviews.length) * 100 : 0;

                    return (
                      <div key={star} className="flex items-center gap-4">
                        <span className="text-xs font-bold text-slate-400 min-w-[45px]">
                          {star} star
                        </span>

                        <div className="flex-1 h-2.5 bg-white/5 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${percentage}%` }}
                            className="h-full bg-yellow-500 rounded-full"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Divider */}
              {user && <div className="border-t border-white/10" />}

              {/* ⭐ Add Review */}
              {user && (
                <form onSubmit={handleReviewSubmit} className="space-y-4">
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-medium text-slate-400">
                      Your Rating:
                    </span>

                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((num) => (
                        <button
                          key={num}
                          type="button"
                          onClick={() =>
                            setNewReview({ ...newReview, rating: num })
                          }
                          className={
                            num <= newReview.rating
                              ? "text-yellow-500"
                              : "text-slate-600"
                          }
                        >
                          <Star
                            size={22}
                            className={
                              num <= newReview.rating ? "fill-yellow-500" : ""
                            }
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Input
                      placeholder="Share your experience..."
                      value={newReview.comment}
                      onChange={(e) =>
                        setNewReview({ ...newReview, comment: e.target.value })
                      }
                      className="!bg-white/5 w-full p-2"
                    />

                    <Button type="submit">
                      <Send size={18} />
                    </Button>
                  </div>
                </form>
              )}
            </div>
            <div className="space-y-6">
              {reviews.map((review) => (
                <motion.div
                  key={review._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass p-6 rounded-3xl"
                >
                  {/* Header */}
                  <div className="flex justify-between">
                    <div className="flex gap-4">
                      <div className="h-11 w-11 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                        <User size={18} className="text-primary" />
                      </div>

                      <div>
                        <h4 className="font-semibold text-white">
                          {review.user?.name || "Anonymous"}
                        </h4>

                        <div className="flex gap-1 mt-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={13}
                              className={
                                i < review.rating
                                  ? "text-yellow-500 fill-yellow-500"
                                  : "text-slate-700"
                              }
                            />
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-xs text-slate-500">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>

                      {user?._id === review.user?._id && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setActiveReply({
                                id: review._id,
                                type: "edit-review",
                              });
                              setReplyText((p) => ({
                                ...p,
                                [review._id]: review.comment,
                              }));
                            }}
                            className="text-slate-500 hover:text-primary"
                          >
                            <Settings size={14} />
                          </button>

                          <button
                            onClick={() => handleDeleteReview(review._id)}
                            className="text-slate-500 hover:text-red-500"
                          >
                            <Trash size={14} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Review Body */}
                  {activeReply?.id === review._id &&
                  activeReply?.type === "edit-review" ? (
                    <div className="mt-5 space-y-3">
                      <Input
                        value={replyText[review._id]}
                        onChange={(e) =>
                          setReplyText((p) => ({
                            ...p,
                            [review._id]: e.target.value,
                          }))
                        }
                        className="!bg-white/10"
                      />
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() =>
                            handleEditReview(review._id, replyText[review._id])
                          }
                        >
                          Update
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setActiveReply(null)}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <p className="mt-5 text-slate-300 leading-relaxed">
                      {review.comment}
                    </p>
                  )}

                  {/* Reply Trigger */}
                  <button
                    onClick={() =>
                      setActiveReply({ id: review._id, type: "reply" })
                    }
                    className="mt-4 text-xs font-semibold text-primary flex items-center gap-1 hover:gap-2 transition-all"
                  >
                    <Reply size={14} /> Reply
                  </button>

                  {/* ⭐ Replies */}
                  {review.replies?.length > 0 && (
                    <div className="mt-5 space-y-4 pl-6 border-l border-white/10">
                      {review.replies.map((reply) => (
                        <div
                          key={reply._id}
                          className="bg-white/5 p-4 rounded-2xl border border-white/5"
                        >
                          <div className="flex justify-between">
                            <div className="flex gap-3">
                              <div className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center">
                                <User size={14} />
                              </div>

                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="text-xs font-bold text-white uppercase">
                                    {reply.role}
                                  </span>
                                  <span className="text-[10px] text-slate-500">
                                    •{" "}
                                    {new Date(reply.date).toLocaleDateString()}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {user?._id === reply.sender && (
                              <div className="flex gap-2">
                                <button
                                  onClick={() => {
                                    setActiveReply({
                                      id: review._id,
                                      replyId: reply._id,
                                      type: "editReply",
                                    });
                                    setReplyText((p) => ({
                                      ...p,
                                      [review._id]: reply.message,
                                    }));
                                  }}
                                  className="text-slate-500 hover:text-primary"
                                >
                                  <Settings size={12} />
                                </button>

                                <button
                                  onClick={() =>
                                    handleDeleteReply(review._id, reply._id)
                                  }
                                  className="text-slate-500 hover:text-red-500"
                                >
                                  <Trash size={12} />
                                </button>
                              </div>
                            )}
                          </div>

                          {activeReply?.replyId === reply._id &&
                          activeReply?.type === "editReply" ? (
                            <div className="mt-3 space-y-2">
                              <Input
                                size="sm"
                                value={replyText[review._id]}
                                onChange={(e) =>
                                  setReplyText((p) => ({
                                    ...p,
                                    [review._id]: e.target.value,
                                  }))
                                }
                                className="!bg-white/10"
                              />
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  onClick={() => handleReplySubmit(review._id)}
                                >
                                  Save
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => setActiveReply(null)}
                                >
                                  Cancel
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <p className="text-sm text-slate-300 mt-2">
                              {reply.message}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Reply Input */}
                  {activeReply?.id === review._id &&
                    activeReply?.type === "reply" && (
                      <div className="mt-4 flex gap-2 pl-6">
                        <Input
                          placeholder="Write a reply..."
                          size="sm"
                          value={replyText[review._id] || ""}
                          onChange={(e) =>
                            setReplyText((p) => ({
                              ...p,
                              [review._id]: e.target.value,
                            }))
                          }
                        />
                        <Button
                          size="sm"
                          onClick={() => handleReplySubmit(review._id)}
                        >
                          <Send size={14} />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setActiveReply(null)}
                        >
                          X
                        </Button>
                      </div>
                    )}
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Booking Actions */}
        <div className="space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass p-8 rounded-[2rem] sticky top-28"
          >
            <h3 className="text-xl font-bold text-white mb-6">Consultation</h3>

            <div className="space-y-6 mb-8">
              <div className="flex justify-between items-center text-slate-400">
                <span className="flex items-center gap-2">
                  <Calendar size={18} className="text-primary" /> Availability
                </span>
                <span className="text-white font-medium">Mon - Sat</span>
              </div>
              <div className="flex justify-between items-center text-slate-400">
                <span className="flex items-center gap-2">
                  <Clock size={18} className="text-primary" /> Hours
                </span>
                <span className="text-white font-medium">10:00 - 18:00</span>
              </div>
            </div>

            <Button className="w-full py-4 rounded-2xl mb-4 text-lg">
              Book Appointment
            </Button>
            <Button
              variant="outline"
              className="w-full py-4 rounded-2xl border-white/5"
            >
              Send Message
            </Button>

            <p className="text-center text-[10px] text-slate-600 mt-6 px-4">
              * Consultation fees may vary based on specialist and treatment.
            </p>
          </motion.div>

          {/* ⭐ Similar Doctors Section Moved Here */}
          {similarDoctors?.length > 0 && (
            <div className="space-y-6 pt-4 mt-15">
              <h3 className="text-xl font-bold text-white flex items-center gap-3 px-2">
                <User size={20} className="text-primary" />
                Similar Doctors
              </h3>
              <div className="space-y-4">
                {similarDoctors.map((simDoc, idx) => (
                  <Link key={simDoc._id} to={`/doctor/${simDoc._id}`}>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="glass my-3 group rounded-2xl overflow-hidden hover:border-primary/50 transition-all p-4 border border-white/5"
                    >
                      <div className="flex gap-4">
                        <img
                          src={
                            simDoc.userId?.image ||
                            `https://ui-avatars.com/api/?name=${simDoc.userId?.name}`
                          }
                          alt={simDoc.userId?.name}
                          className="h-12 w-12 rounded-xl object-cover border border-white/10"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-bold text-white group-hover:text-primary transition-colors truncate">
                            {simDoc.userId?.name}
                          </h4>
                          <p className="text-slate-400 text-xs truncate">
                            {simDoc.specialization}
                          </p>
                          <div className="flex items-center gap-1 mt-1">
                            <Star
                              className="text-yellow-500 fill-yellow-500"
                              size={12}
                            />
                            <span className="text-[10px] font-medium text-slate-300">
                              {simDoc.averageRating || 0} ({simDoc.reviewCount || 0})
                            </span>
                          </div>
                        </div>
                        <ArrowRight
                          size={16}
                          className="text-slate-600 group-hover:text-primary transition-colors self-center"
                        />
                      </div>
                    </motion.div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorProfile;
