const router = require("express").Router();
const protect = require("../middleware/authMiddleware");
const allowRole = require('../middleware/roleMiddleware');
const { getMyUserProfile, applyDoctor, updateProfile } = require("../controllers/userController");

router.get('/profile', protect, allowRole("user", "doctor"), getMyUserProfile);
router.put('/profile', protect, allowRole("user", "doctor"), updateProfile);

router.post('/apply', protect, allowRole("user"), applyDoctor);

module.exports = router;
