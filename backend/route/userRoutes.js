const router = require("express").Router();
const protect = require("../middleware/authMiddleware");
const allowRole = require('../middleware/roleMiddleware');
const { getMyUserProfile, applyDoctor } = require("../controllers/userController");

router.get('/profile', protect, allowRole("user", "doctor"), getMyUserProfile);

router.post('/apply', protect, allowRole("user"), applyDoctor);

module.exports = router;
