import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  User,
  Briefcase,
  MapPin,
  FileText,
  Save,
  CheckCircle,
  Camera,
  Loader2,
  MessageSquare,
  Star,
  Settings,
  History,
  Trash
} from "lucide-react";
import { doctorAPI, reviewAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";

const FeedbackItem = ({ review, user, fetchDoctorReviews }) => {
  const [isReplying, setIsReplying] = useState(false);
  const [replyMsg, setReplyMsg] = useState("");
  const [editingReply, setEditingReply] = useState(null);
  const [editMsg, setEditMsg] = useState("");

  const onAddReply = async () => {
    try {
      await reviewAPI.addReply({ reviewId: review._id, message: replyMsg });
      setReplyMsg("");
      setIsReplying(false);
      fetchDoctorReviews();
    } catch (err) {
      alert("Failed to add reply");
    }
  };

  const onEditReply = async (replyId) => {
    try {
      await reviewAPI.editReply({
        reviewId: review._id,
        replyId,
        message: editMsg,
      });
      setEditingReply(null);
      fetchDoctorReviews();
    } catch (err) {
      alert("Failed to update reply");
    }
  };

  const onDeleteReply = async (replyId) => {
    if (!window.confirm("Delete this reply?")) return;
    try {
      await reviewAPI.removeReply(review._id, replyId);
      fetchDoctorReviews();
    } catch (err) {
      alert("Failed to delete reply");
    }
  };

  return (
    <div className="bg-white/5 p-4 rounded-2xl border border-white/5 space-y-3 font-sans">
      <div className="flex justify-between items-center text-sans">
        <span className="text-xs font-bold text-white uppercase tracking-wider">
          {review.user?.name}
        </span>
        <div className="flex gap-0.5">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={10}
              className={
                i < review.rating
                  ? "text-yellow-500 fill-yellow-500"
                  : "text-slate-700"
              }
            />
          ))}
        </div>
      </div>
      <p className="text-sm text-slate-300 italic">"{review.comment}"</p>

      {review.replies?.length > 0 && (
        <div className="space-y-2 pl-4 border-l-2 border-white/5">
          {review.replies.map((reply) => (
            <div key={reply._id} className="text-xs">
              <div className="flex justify-between items-center mb-1">
                <span className="font-bold text-primary uppercase text-[10px]">
                  {reply.role}
                </span>
                {reply.sender === user?._id && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditingReply(reply._id);
                        setEditMsg(reply.message);
                      }}
                      className="text-slate-500 hover:text-white"
                    >
                      <Settings size={10} />
                    </button>
                    <button
                      onClick={() => onDeleteReply(reply._id)}
                      className="text-slate-500 hover:text-red-500"
                    >
                      <Trash size={10} />
                    </button>
                  </div>
                )}
              </div>
              {editingReply === reply._id ? (
                <div className="space-y-1">
                  <input
                    className="w-full bg-white/10 rounded-md p-1 focus:outline-none"
                    value={editMsg}
                    onChange={(e) => setEditMsg(e.target.value)}
                  />
                  <div className="flex gap-1">
                    <button
                      onClick={() => onEditReply(reply._id)}
                      className="text-primary text-[10px] font-bold"
                    >
                      SAVE
                    </button>
                    <button
                      onClick={() => setEditingReply(null)}
                      className="text-slate-500 text-[10px]"
                    >
                      CANCEL
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-slate-400">{reply.message}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {!isReplying ? (
        <button
          onClick={() => setIsReplying(true)}
          className="text-[10px] font-bold text-primary uppercase tracking-widest hover:text-white transition-colors"
        >
          + Add Reply
        </button>
      ) : (
        <div className="space-y-2">
          <textarea
            className="w-full bg-white/10 border border-white/10 rounded-xl p-2 text-xs text-white focus:outline-none focus:border-primary"
            placeholder="Write a reply..."
            value={replyMsg}
            onChange={(e) => setReplyMsg(e.target.value)}
          />
          <div className="flex gap-2">
            <button
              onClick={onAddReply}
              className="text-[10px] bg-primary text-white px-3 py-1 rounded-lg font-bold"
            >
              REPLY
            </button>
            <button
              onClick={() => setIsReplying(false)}
              className="text-[10px] text-slate-500 font-bold"
            >
              CANCEL
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const DoctorDashboard = () => {
  const { user, fetchUserProfile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [formData, setFormData] = useState({
    specialization: "",
    experience: "",
    clinicAddress: "",
    summary: "",
  });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    fetchDoctorProfile();
    fetchDoctorReviews();
  }, []);

  const fetchDoctorProfile = async () => {
    try {
      const { data } = await doctorAPI.getProfile();
      setFormData({
        specialization: data.specialization || "",
        experience: data.experience || "",
        clinicAddress: data.clinicAddress || "",
        summary: data.summary || "",
      });
      setPreview(user?.image);
    } catch (err) {
      console.error("No doctor profile found, please apply.");
    } finally {
      setLoading(false);
    }
  };

  const fetchDoctorReviews = async () => {
    try {
      const { data } = await reviewAPI.getDoctorReviews();
      setReviews(data);
    } catch (err) {
      console.error(err);
    }
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
    setSaving(true);
    setSuccess(false);

    const data = new FormData();
    Object.keys(formData).forEach((key) => data.append(key, formData[key]));
    if (image) data.append("image", image);

    try {
      await doctorAPI.updateProfile(data);
      setSuccess(true);
      fetchUserProfile();
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      alert("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <div className="py-20 text-center animate-pulse text-slate-400">
        Loading Dashboard...
      </div>
    );

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">
              Doctor Dashboard
            </h1>
            <p className="text-slate-400">
              Manage your professional profile and patient engagement.
            </p>
          </div>
          {success && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-2 bg-green-500/10 text-green-500 px-4 py-2 rounded-xl border border-green-500/20"
            >
              <CheckCircle size={18} />
              Profile updated successfully!
            </motion.div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar: Profile Summary */}
          <div className="space-y-6">
            <div className="glass p-6 rounded-3xl text-center">
              <div className="relative inline-block mb-4">
                <img
                  src={
                    preview || `https://ui-avatars.com/api/?name=${user?.name}`
                  }
                  alt={user?.name}
                  className="w-32 h-32 rounded-[2rem] object-cover border-4 border-white/5"
                />
                <input
                  type="file"
                  id="doctor-img"
                  className="hidden"
                  onChange={handleImageChange}
                />
                <label
                  htmlFor="doctor-img"
                  className="absolute bottom-0 right-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white cursor-pointer hover:scale-110 transition-transform shadow-lg"
                >
                  <Camera size={16} />
                </label>
              </div>
              <h2 className="text-xl font-bold text-white">{user?.name}</h2>
              <p className="text-slate-500 text-sm mb-6">{user?.email}</p>

              <div className="pt-6 border-t border-white/5 space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Tier</span>
                  <span className="text-primary font-bold">Specialist</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Reviews</span>
                  <span className="text-white">{reviews.length} Total</span>
                </div>
              </div>
            </div>

            <div className="glass p-7 rounded-3xl">
              {/* Header */}
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-lg font-bold text-white flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-primary/10 border border-primary/20">
                    <MessageSquare className="text-primary" size={16} />
                  </div>
                  Patient Feedback
                </h3>

                <span className="text-xs text-slate-500">
                  {reviews.length} {reviews.length === 1 ? "review" : "reviews"}
                </span>
              </div>

              {/* Divider */}
              <div className="border-t border-white/10 mb-5" />

              {/* Scroll Area */}
              <div className="space-y-5 max-h-[400px] overflow-y-auto pr-2 custom-scroll">
                {reviews.length > 0 ? (
                  reviews.map((review) => (
                    <div
                      key={review._id}
                      className="bg-white/5 border border-white/5 hover:border-white/10 transition rounded-2xl"
                    >
                      <FeedbackItem
                        review={review}
                        user={user}
                        fetchDoctorReviews={fetchDoctorReviews}
                      />
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <div className="mx-auto w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-3">
                      <MessageSquare size={18} className="text-slate-500" />
                    </div>
                    <p className="text-sm text-slate-500">No feedback yet.</p>
                    <p className="text-xs text-slate-600 mt-1">
                      Reviews from patients will appear here.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Main Content: Edit Form */}
          <div className="lg:col-span-2">
            <form
              onSubmit={handleSubmit}
              className="glass p-8 rounded-[2.5rem] space-y-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Specialization"
                  value={formData.specialization}
                  onChange={(e) =>
                    setFormData({ ...formData, specialization: e.target.value })
                  }
                  icon={Briefcase}
                  placeholder="e.g. Cardiologist"
                  className="!bg-white/5"
                />
                <Input
                  label="Years of Experience"
                  type="number"
                  value={formData.experience}
                  onChange={(e) =>
                    setFormData({ ...formData, experience: e.target.value })
                  }
                  icon={User}
                  placeholder="e.g. 10"
                  className="!bg-white/5 w-full"
                />
              </div>

              <Input
                label="Clinic Address"
                value={formData.clinicAddress}
                onChange={(e) =>
                  setFormData({ ...formData, clinicAddress: e.target.value })
                }
                icon={MapPin}
                placeholder="123 Health St, Med City"
                className="!bg-white/5 w-full"
              />

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-400 flex items-center gap-2">
                  <FileText size={16} /> Professional Summary
                </label>
                <textarea
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-slate-50 focus:border-primary focus:ring-4 focus:ring-primary/20 transition-all outline-none min-h-[150px]"
                  placeholder="Briefly describe your medical expertise and practice goals..."
                  value={formData.summary}
                  onChange={(e) =>
                    setFormData({ ...formData, summary: e.target.value })
                  }
                />
              </div>

              <div className="pt-4">
                <Button
                  type="submit"
                  disabled={saving}
                  className="w-full h-12 md:w-auto px-12 rounded-2xl"
                >
                  {saving ? (
                    <>
                      <Loader2 className="animate-spin mr-2" size={18} />{" "}
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2" size={18} /> Save Profile Changes
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
