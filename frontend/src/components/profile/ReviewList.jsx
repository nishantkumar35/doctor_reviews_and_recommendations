import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, User, Settings, Trash, Reply, Send } from 'lucide-react';
import Button from '../ui/Button';
import Input from '../ui/Input';

const ReviewList = ({
  reviews,
  user,
  onDeleteReview,
  onEditReview,
  onReplySubmit,
  onDeleteReply,
}) => {
  const [activeReply, setActiveReply] = useState(null);
  const [replyText, setReplyText] = useState({});

  const handleReplySubmit = (reviewId) => {
    if (!replyText[reviewId]?.trim()) return;
    onReplySubmit(reviewId, activeReply, replyText[reviewId]);
    setReplyText((prev) => ({ ...prev, [reviewId]: '' }));
    setActiveReply(null);
  };

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <motion.div
          key={review._id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-blue-100 rounded-2xl px-6 py-5"
        >
          {/* Header */}
          <div className="flex justify-between items-start">
            <div className="flex items-start gap-3">
              {/* Avatar */}
              <div className="h-10 w-10 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center flex-shrink-0">
                <User size={16} className="text-blue-500" strokeWidth={2} />
              </div>

              <div>
                <p className="text-sm font-semibold text-slate-900">
                  {review.user?.name || 'Anonymous'}
                </p>
                <div className="flex gap-0.5 mt-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={12}
                      className={
                        i < review.rating
                          ? 'text-amber-400 fill-amber-400'
                          : 'text-slate-200 fill-slate-200'
                      }
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">
                {new Date(review.createdAt).toLocaleDateString()}
              </span>

              {user?._id === review.user?._id && (
                <div className="flex gap-1">
                  <button
                    onClick={() => {
                      setActiveReply({ id: review._id, type: 'edit-review' });
                      setReplyText((p) => ({ ...p, [review._id]: review.comment }));
                    }}
                    className="p-1.5 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                  >
                    <Settings size={13} />
                  </button>
                  <button
                    onClick={() => onDeleteReview(review._id)}
                    className="p-1.5 rounded-md text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                  >
                    <Trash size={13} />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Review body / edit */}
          {activeReply?.id === review._id && activeReply?.type === 'edit-review' ? (
            <div className="mt-4 space-y-2.5">
              <Input
                value={replyText[review._id] || ''}
                onChange={(e) =>
                  setReplyText((p) => ({ ...p, [review._id]: e.target.value }))
                }
              />
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() => {
                    onEditReview(review._id, replyText[review._id]);
                    setActiveReply(null);
                  }}
                >
                  Update
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setActiveReply(null)}>
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <p className="mt-3 text-sm text-slate-500 leading-relaxed">
              {review.comment}
            </p>
          )}

          {/* Reply trigger */}
          <button
            onClick={() => setActiveReply({ id: review._id, type: 'reply' })}
            className="mt-3 text-xs font-semibold text-blue-600 flex items-center gap-1.5 hover:text-blue-700 transition-colors"
          >
            <Reply size={13} />
            Reply
          </button>

          {/* Replies */}
          {review.replies?.length > 0 && (
            <div className="mt-4 space-y-3 pl-4 border-l-2 border-blue-100">
              {review.replies.map((reply) => (
                <div
                  key={reply._id}
                  className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-3"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2.5">
                      <div className="h-7 w-7 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center flex-shrink-0">
                        <User size={12} className="text-blue-500" strokeWidth={2} />
                      </div>
                      <div>
                        <span className="text-[11px] font-bold text-blue-700 uppercase tracking-wide">
                          {reply.role}
                        </span>
                        <span className="text-[10px] text-slate-400 ml-2">
                          {new Date(reply.date).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    {user?._id === reply.sender && (
                      <div className="flex gap-1">
                        <button
                          onClick={() => {
                            setActiveReply({ id: review._id, replyId: reply._id, type: 'editReply' });
                            setReplyText((p) => ({ ...p, [review._id]: reply.message }));
                          }}
                          className="p-1 rounded text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
                        >
                          <Settings size={11} />
                        </button>
                        <button
                          onClick={() => onDeleteReply(review._id, reply._id)}
                          className="p-1 rounded text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                        >
                          <Trash size={11} />
                        </button>
                      </div>
                    )}
                  </div>

                  {activeReply?.replyId === reply._id && activeReply?.type === 'editReply' ? (
                    <div className="mt-2.5 space-y-2">
                      <Input
                        value={replyText[review._id] || ''}
                        onChange={(e) =>
                          setReplyText((p) => ({ ...p, [review._id]: e.target.value }))
                        }
                      />
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => handleReplySubmit(review._id)}>
                          Save
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => setActiveReply(null)}>
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                      {reply.message}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Reply input */}
          {activeReply?.id === review._id && activeReply?.type === 'reply' && (
            <div className="mt-3 flex gap-2 pl-4">
              <Input
                placeholder="Write a reply..."
                value={replyText[review._id] || ''}
                onChange={(e) =>
                  setReplyText((p) => ({ ...p, [review._id]: e.target.value }))
                }
              />
              <Button size="sm" onClick={() => handleReplySubmit(review._id)}>
                <Send size={13} />
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setActiveReply(null)}>
                Cancel
              </Button>
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
};

export default ReviewList;