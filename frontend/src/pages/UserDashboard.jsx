import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { User, Settings, History, Briefcase, Star, Trash  } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import { Link } from 'react-router-dom';
import { reviewAPI } from '../services/api'; 

const UserDashboard = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingReview, setEditingReview] = useState(null);
  const [editComment, setEditComment] = useState("");
  const { user } = useAuth();

  useEffect(() => {
    if (user) fetchReviews();
  }, [user]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const { data } = await reviewAPI.getUserReviews();
      setReviews(data);
    } catch (err) {
      console.error("Fetch review error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteReview = async (id) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;

    try {
      await reviewAPI.remove(id);
      await fetchReviews();
    } catch (err) {
      alert("Failed to delete review");
    }
  };

  const handleEditReview = async (id) => {
    try {
      await reviewAPI.edit({ reviewId: id, comment: editComment });
      setEditingReview(null);
      setEditComment("");
      await fetchReviews();
    } catch (err) {
      alert("Failed to update review");
    }
  };

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">My Account</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT PANEL */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass p-8 rounded-3xl text-center"
          >
            <div className="mb-6">
              <img
                src={user?.image || `https://ui-avatars.com/api/?name=${user?.name}`}
                alt={user?.name}
                className="w-32 h-32 rounded-full mx-auto object-cover border-4 border-white/5 shadow-2xl"
              />
            </div>

            <h2 className="text-2xl font-bold text-white mb-2">{user?.name}</h2>
            <p className="text-slate-400 mb-6">{user?.email}</p>

            <div className={`inline-flex px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest ${
              user?.role === 'doctor'
                ? 'bg-primary/20 text-primary'
                : 'bg-secondary/20 text-secondary'
            }`}>
              {user?.role} Account
            </div>

            {user?.role === 'user' && (
              <div className="mt-8 pt-8 border-t border-white/5">
                <p className="text-sm text-slate-400 mb-4 text-left">
                  Are you a healthcare professional?
                </p>
                <Link to="/apply-doctor" className="w-full">
                  <Button variant="outline" className="w-full gap-2">
                    <Briefcase size={16} /> Apply for Doctor
                  </Button>
                </Link>
              </div>
            )}

            {user?.role === 'doctor' && (
              <div className="mt-8 pt-8 border-t border-white/5">
                <Link to="/dashboard" className="w-full">
                  <Button variant="primary" className="w-full gap-2">
                    <History size={16} /> Professional Dashboard
                  </Button>
                </Link>
              </div>
            )}
          </motion.div>

          {/* RIGHT PANEL */}
          <div className="lg:col-span-2 space-y-6">
            {/* SETTINGS */}
            <div className="glass p-8 rounded-3xl space-y-8">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Settings className="text-primary" size={20} />
                Profile Settings
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-1">
                  <label className="text-xs uppercase font-bold text-slate-500 tracking-wider">
                    Full Name
                  </label>
                  <div className="text-white font-medium bg-white/5 px-4 py-3 rounded-xl border border-white/5">
                    {user?.name}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs uppercase font-bold text-slate-500 tracking-wider">
                    Email Address
                  </label>
                  <div className="text-white font-medium bg-white/5 px-4 py-3 rounded-xl border border-white/5">
                    {user?.email}
                  </div>
                </div>
              </div>

              <div className="pt-4 flex gap-4">
                <Button variant="primary">Edit Profile</Button>
                <Button variant="outline">Change Password</Button>
              </div>
            </div>

            {/* REVIEWS */}
            <div className="glass p-8 rounded-3xl">
              <h3 className="text-xl font-bold text-white flex items-center gap-2 mb-6">
                <History className="text-primary" size={20} />
                My Reviews
              </h3>

              <div className="space-y-4">
                {loading ? (
                  <div className="text-center py-8 animate-pulse text-slate-500">
                    Loading reviews...
                  </div>
                ) : reviews.length > 0 ? (
                  reviews.map((review) => (
                    <div key={review._id} className="bg-white/5 p-4 rounded-2xl border border-white/5">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="text-white font-medium mb-1 line-clamp-1">
                            For: {review.doctor?.specialization || 'Specialist'}
                          </p>

                          <div className="flex gap-0.5 mt-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                size={10}
                                className={
                                  i < review.rating
                                    ? 'text-yellow-500 fill-yellow-500'
                                    : 'text-slate-700'
                                }
                              />
                            ))}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-slate-600 whitespace-nowrap">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </span>

                          <div className="flex gap-1">
                            <button
                              onClick={() => {
                                setEditingReview(review._id);
                                setEditComment(review.comment);
                              }}
                              className="p-1 hover:text-primary text-slate-500"
                            >
                              <Settings size={14} />
                            </button>

                            <button
                              onClick={() => handleDeleteReview(review._id)}
                              className="p-1 hover:text-red-500 text-slate-500"
                            >
                              <Trash size={14} />
                            </button>
                          </div>
                        </div>
                      </div>

                      {editingReview === review._id ? (
                        <div className="space-y-2 mt-2">
                          <textarea
                            className="w-full bg-white/10 border border-white/10 rounded-lg p-2 text-sm text-white focus:outline-none focus:border-primary"
                            value={editComment}
                            onChange={(e) => setEditComment(e.target.value)}
                          />
                          <div className="flex gap-2">
                            <Button size="sm" onClick={() => handleEditReview(review._id)}>
                              Save
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => setEditingReview(null)}>
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <p className="text-sm text-slate-400 italic line-clamp-3">
                          "{review.comment}"
                        </p>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 text-slate-500 italic">
                    No reviews to show.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
