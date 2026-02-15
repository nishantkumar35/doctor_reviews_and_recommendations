const Review = require("../models/review");
const Doctor = require("../models/doctor");

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

    res.json({ message: "Review added successfully", review });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};


const editReview = async (req, res) => {
  try {
    const { reviewId, comment } = req.body;

    const review = await Review.findOne({
      _id: reviewId,
      user: req.user._id,
    });

    if (!review)
      return res.status(403).json({ message: "You cannot edit this review" });

    review.comment = comment || review.comment;
    await review.save();

    res.json({ message: "Review updated", review });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};


const deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;

    const review = await Review.findOneAndDelete({
      _id: reviewId,
      user: req.user._id,
    });

    if (!review)
      return res.status(403).json({ message: "You cannot delete this review" });

    res.json({ message: "Review deleted successfully" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};


const addReply = async (req, res) => {
  try {
    const { reviewId, message, parentId } = req.body;

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

    res.json({ message: "Reply added", review });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};


const editReply = async (req, res) => {
  try {
    const { reviewId, replyId, message } = req.body;

    const review = await Review.findById(reviewId);
    if (!review) return res.status(404).json({ message: "Review not found" });

    const reply = review.replies.find(
      (r) =>
        r._id.toString() === replyId &&
        r.sender.toString() === req.user._id.toString()
    );

    if (!reply)
      return res.status(403).json({ message: "You cannot edit this reply" });

    reply.message = message || reply.message;

    await review.save();
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
        )
    );

    if (review.replies.length === before)
      return res.status(403).json({ message: "You cannot delete this reply" });

    await review.save();
    res.json({ message: "Reply deleted" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};


const getDoctorReviews = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ userId: req.user._id });
    if (!doctor)
      return res.status(404).json({ message: "Doctor profile not found" });

    const reviews = await Review.find({ doctor: doctor._id }).populate(
      "user",
      "name email"
    );

    res.json(reviews);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};


const getMyReviews = async (req, res) => {
  try {
    console.log("LOGGED USER:", req.user._id);
    const reviews = await Review.find({ user: req.user._id }).populate(
      "doctor",
      "specialization"
    );
    console.log("FOUND REVIEWS:", reviews.length);

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

    const reviews = await Review.find({ doctor: doctorId })
      .populate("user", "name email")
      .populate("doctor", "specialization");

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
