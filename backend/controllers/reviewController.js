const Review = require("../models/review");
const Doctor = require("../models/doctor");

const CACHE_TTL = {
  DOCTOR_REVIEWS: 60 * 5,
  MY_REVIEWS: 60 * 5,
  PUBLIC_REVIEWS: 60 * 10,
};

const cacheKeys = {
  reviewsForDoctor: (doctorId) => `reviews:doctor:${doctorId}`,
  doctorOwnReviews: (doctorId) => `reviews:own:${doctorId}`,
  myReviews: (userId) => `reviews:user:${userId}`,
};

const addReview = async (req, res) => {
  try {
    const { doctorId, rating, comment } = req.body;

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });

    const review = await Review.create({
      doctor: doctorId,
      user: req.user._id,
      rating,
      comment,
    });

    const redis = req.redisClient;
    await redis.del([
      cacheKeys.reviewsForDoctor(doctorId),
      cacheKeys.doctorOwnReviews(doctor._id.toString()),
      cacheKeys.myReviews(req.user._id.toString()),
      `doctors:${doctorId}`,
      "doctors:all",
    ]);

    res.json({ message: "Review added successfully", review });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

const editReview = async (req, res) => {
  try {
    const { reviewId, comment } = req.body;
    const redis = req.redisClient;

    const review = await Review.findOne({
      _id: reviewId,
      user: req.user._id,
    });

    if (!review)
      return res.status(403).json({ message: "You cannot edit this review" });

    review.comment = comment || review.comment;
    await review.save();

    await redis.del([
      cacheKeys.reviewsForDoctor(review.doctor.toString()),
      cacheKeys.doctorOwnReviews(review.doctor.toString()),
      cacheKeys.myReviews(req.user._id.toString()),
    ]);

    res.json({ message: "Review updated", review });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

const deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const redis = req.redisClient;

    const review = await Review.findOneAndDelete({
      _id: reviewId,
      user: req.user._id,
    });

    if (!review)
      return res.status(403).json({ message: "You cannot delete this review" });

    await redis.del([
      cacheKeys.reviewsForDoctor(review.doctor.toString()),
      cacheKeys.doctorOwnReviews(review.doctor.toString()),
      cacheKeys.myReviews(req.user._id.toString()),
      `doctors:${review.doctor.toString()}`, 
      "doctors:all", 
    ]);

    res.json({ message: "Review deleted successfully" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

const addReply = async (req, res) => {
  try {
    const { reviewId, message, parentId } = req.body;
    const redis = req.redisClient;

    const review = await Review.findById(reviewId);
    if (!review) return res.status(404).json({ message: "Review not found" });

    const reply = {
      sender: req.user._id,
      role: req.user.role,
      message,
      parent: parentId || null,
      date: new Date(),
    };

    review.replies.push(reply);
    await review.save();

    await redis.del([
      cacheKeys.reviewsForDoctor(review.doctor.toString()),
      cacheKeys.doctorOwnReviews(review.doctor.toString()),
    ]);

    res.json({ message: "Reply added", review });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

const editReply = async (req, res) => {
  try {
    const { reviewId, replyId, message } = req.body;
    const redis = req.redisClient;

    const review = await Review.findById(reviewId);
    if (!review) return res.status(404).json({ message: "Review not found" });

    const reply = review.replies.find(
      (r) =>
        r._id.toString() === replyId &&
        r.sender.toString() === req.user._id.toString(),
    );

    if (!reply)
      return res.status(403).json({ message: "You cannot edit this reply" });

    reply.message = message || reply.message;

    await review.save();
    await redis.del([
      cacheKeys.reviewsForDoctor(review.doctor.toString()),
      cacheKeys.doctorOwnReviews(review.doctor.toString()),
    ]);
    res.json({ message: "Reply updated", review });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

const deleteReply = async (req, res) => {
  try {
    const { reviewId, replyId } = req.params;

    const review = await Review.findById(reviewId);
    if (!review) return res.status(404).json({ message: "Review not found" });

    const before = review.replies.length;

    review.replies = review.replies.filter(
      (r) =>
        !(
          r._id.toString() === replyId &&
          r.sender.toString() === req.user._id.toString()
        ),
    );

    if (review.replies.length === before)
      return res.status(403).json({ message: "You cannot delete this reply" });

    await review.save();
    const redis = req.redisClient;
    await redis.del([
      cacheKeys.reviewsForDoctor(review.doctor.toString()),
      cacheKeys.doctorOwnReviews(review.doctor.toString()),
    ]);
    res.json({ message: "Reply deleted" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

const getDoctorReviews = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ userId: req.user._id });
    const redis = req.redisClient;

    if (!doctor)
      return res.status(404).json({ message: "Doctor profile not found" });

    const key = cacheKeys.doctorOwnReviews(doctor._id.toString());
    const cached = await redis.get(key);
    if (cached) {
      return res.json(JSON.parse(cached));
    }

    const reviews = await Review.find({ doctor: doctor._id }).populate(
      "user",
      "name email",
    );
    await redis.setEx(key, CACHE_TTL.PUBLIC_REVIEWS, JSON.stringify(reviews));
    res.json(reviews);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

const getMyReviews = async (req, res) => {
  try {
    const redis = req.redisClient;
    const key = cacheKeys.myReviews(req.user._id.toString());
    const cached = await redis.get(key);
    if (cached) {
      return res.json(JSON.parse(cached));
    }
    const reviews = await Review.find({ user: req.user._id }).populate(
      "doctor",
      "specialization",
    );
    console.log("FOUND REVIEWS:", reviews.length);
    await redis.setEx(key, CACHE_TTL.MY_REVIEWS, JSON.stringify(reviews));
    res.json(reviews);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

const getReviewsForDoctor = async (req, res) => {
  try {
    const { doctorId } = req.params;

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });

    const redis = req.redisClient;
    const key = cacheKeys.reviewsForDoctor(doctorId);
    const cached = await redis.get(key);
    if (cached) {
      return res.json(JSON.parse(cached));
    }

    const reviews = await Review.find({ doctor: doctorId })
      .populate("user", "name email")
      .populate("doctor", "specialization");

    await redis.setEx(key, CACHE_TTL.DOCTOR_REVIEWS, JSON.stringify(reviews));

    res.json(reviews);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

module.exports = {
  addReview,
  editReview,
  deleteReview,
  addReply,
  editReply,
  deleteReply,
  getDoctorReviews,
  getReviewsForDoctor,
  getMyReviews,
};
