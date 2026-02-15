const router = require("express").Router();
const protect = require("../middleware/authMiddleware");
const allowRole = require("../middleware/roleMiddleware");

const {
  addReview,
  editReview,
  deleteReview,
  addReply,
  editReply,
  deleteReply,
  getDoctorReviews,
  getReviewsForDoctor,
  getMyReviews,
} = require("../controllers/reviewController");

router.post("/add", protect, allowRole("doctor", "user"), addReview);
router.post("/edit", protect, allowRole("doctor", "user"), editReview);
router.delete("/delete/:reviewId", protect, allowRole("doctor", "user"), deleteReview);

router.post("/reply/add", protect, allowRole("doctor", "user"), addReply);
router.post("/reply/edit", protect, allowRole("doctor", "user"), editReply);
router.delete(
  "/reply/delete/:reviewId/:replyId",
  protect,
  allowRole("doctor", "user"),
  deleteReply
);

router.get("/doctor/reviews", protect, allowRole("doctor"), getDoctorReviews);
router.get("/user/reviews", protect, allowRole("user", "doctor"), getMyReviews);

router.get("/reviews/:doctorId", getReviewsForDoctor);

module.exports = router;
