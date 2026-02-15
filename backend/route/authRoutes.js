const router = require("express").Router();
const upload = require("../middleware/imageMiddleware");
const {
  register,
  login,
  verifyOTP,
  googleLogin,
} = require("../controllers/authController");

router.post("/register", upload.single("image"), register);
router.post("/login", login);
router.post("/verify-otp", verifyOTP);
router.post("/google-login", googleLogin); 

module.exports = router;
