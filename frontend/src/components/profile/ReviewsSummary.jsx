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
    <div className="bg-white border border-blue-100 rounded-2xl p-6 space-y-6">

      {/* Rating overview */}
      <div>
        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4">
          Rating overview
        </p>

        {/* Average score row */}
        <div className="flex items-center gap-3 bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 mb-5">
          <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                size={17}
                className={
                  star <= Math.round(doctor.averageRating || 0)
                    ? 'text-amber-400 fill-amber-400'
                    : 'text-slate-200 fill-slate-200'
                }
              />
            ))}
          </div>
          <span className="text-sm font-semibold text-slate-600">
            {doctor.averageRating || 0} out of 5
          </span>
        </div>

        {/* Bar breakdown */}
        <div className="space-y-2.5">
          {[5, 4, 3, 2, 1].map((star) => {
            const count = reviews.filter((r) => r.rating === star).length;
            const percentage =
              reviews.length > 0 ? (count / reviews.length) * 100 : 0;

            return (
              <div key={star} className="flex items-center gap-3">
                <span className="text-[11px] font-semibold text-slate-400 min-w-[42px]">
                  {star} star
                </span>
                <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    className="h-full bg-amber-400 rounded-full"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Leave a review */}
      {user && (
        <>
          <div className="border-t border-slate-100" />

          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-slate-500">
                Your rating
              </span>
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setNewReview({ ...newReview, rating: num })}
                    className="p-0.5 transition-transform hover:scale-110"
                  >
                    <Star
                      size={20}
                      className={
                        num <= newReview.rating
                          ? 'text-amber-400 fill-amber-400'
                          : 'text-slate-300 fill-slate-300'
                      }
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <Input
                placeholder="Share your experience..."
                value={newReview.comment}
                onChange={(e) =>
                  setNewReview({ ...newReview, comment: e.target.value })
                }
                className="w-full"
              />
              <Button
                type="submit"
                size="md"
                disabled={!newReview.comment.trim()}
                className="flex-shrink-0 px-3.5"
              >
                <Send size={15} />
              </Button>
            </div>
          </form>
        </>
      )}
    </div>
  );
};

export default ReviewsSummary;