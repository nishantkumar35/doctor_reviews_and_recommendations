const router = require("express").Router();
const protect = require("../middleware/authMiddleware");
const allowRole = require('../middleware/roleMiddleware');
const upload = require("../middleware/imageMiddleware");

const {
  getAllDoctors,
  getMyDoctorProfile,
  getSingleDoctor,
  updateDoctorProfile,
  similarDoctors,
  addFilter,
  getFilterOptions
} = require('../controllers/doctorController');

router.get('/all', getAllDoctors);
router.get('/options', getFilterOptions);
router.get('/filter', addFilter);
router.get('/profile', protect, allowRole("doctor"), getMyDoctorProfile);

router.get('/similar/:doctorId', similarDoctors);
router.get('/:doctorId', getSingleDoctor);

router.put('/update', protect, allowRole("doctor"), upload.single("image"), updateDoctorProfile);

module.exports = router;
