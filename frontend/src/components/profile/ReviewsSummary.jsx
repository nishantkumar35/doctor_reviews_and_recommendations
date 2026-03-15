import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Send } from 'lucide-react';
import Button from '../ui/Button';
import Input from '../ui/Input';

const ReviewsSummary = ({ doctor, reviews, user, onReviewSubmit }) => {
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!user) return alert('Please login to leave a review');
    if (!newReview.comment.trim()) return;
    onReviewSubmit(newReview);
    setNewReview({ rating: 5, comment: '' });
  };

  return (
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
                  star <= Math.round(doctor.averageRating || 0)
                    ? 'currentColor'
                    : 'none'
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
            const count = reviews.filter((r) => r.rating === star).length;
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
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-slate-400">
              Your Rating:
            </span>

            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setNewReview({ ...newReview, rating: num })}
                  className={
                    num <= newReview.rating
                      ? 'text-yellow-500'
                      : 'text-slate-600'
                  }
                >
                  <Star
                    size={22}
                    className={num <= newReview.rating ? 'fill-yellow-500' : ''}
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

            <Button type="submit" disabled={!newReview.comment.trim()}>
              <Send size={18} />
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};

export default ReviewsSummary;
