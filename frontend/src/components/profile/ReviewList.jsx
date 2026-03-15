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
                  {review.user?.name || 'Anonymous'}
                </h4>

                <div className="flex gap-1 mt-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={13}
                      className={
                        i < review.rating
                          ? 'text-yellow-500 fill-yellow-500'
                          : 'text-slate-700'
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
                        type: 'edit-review',
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
                    onClick={() => onDeleteReview(review._id)}
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
          activeReply?.type === 'edit-review' ? (
            <div className="mt-5 space-y-3">
              <Input
                value={replyText[review._id] || ''}
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
                  onClick={() => {
                    onEditReview(review._id, replyText[review._id]);
                    setActiveReply(null);
                  }}
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
            onClick={() => setActiveReply({ id: review._id, type: 'reply' })}
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
                            • {new Date(reply.date).toLocaleDateString()}
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
                              type: 'editReply',
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
                          onClick={() => onDeleteReply(review._id, reply._id)}
                          className="text-slate-500 hover:text-red-500"
                        >
                          <Trash size={12} />
                        </button>
                      </div>
                    )}
                  </div>

                  {activeReply?.replyId === reply._id &&
                  activeReply?.type === 'editReply' ? (
                    <div className="mt-3 space-y-2">
                      <Input
                        size="sm"
                        value={replyText[review._id] || ''}
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
            activeReply?.type === 'reply' && (
              <div className="mt-4 flex gap-2 pl-6">
                <Input
                  placeholder="Write a reply..."
                  size="sm"
                  value={replyText[review._id] || ''}
                  onChange={(e) =>
                    setReplyText((p) => ({
                      ...p,
                      [review._id]: e.target.value,
                    }))
                  }
                />
                <Button size="sm" onClick={() => handleReplySubmit(review._id)}>
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
  );
};

export default ReviewList;
