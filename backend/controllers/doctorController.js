const Doctor = require("../models/doctor.js");
const User = require("../models/user.js");
const Review = require("../models/review.js");
const uploadToCloudinary = require("../utils/cloudinaryUpload");

const CACHE_TTL = {
  ALL_DOCTORS: 60 * 5, 
  SINGLE_DOCTOR: 60 * 10, 
  SIMILAR_DOCTORS: 60 * 5,
};

const cacheKeys = {
  allDoctors: () => "doctors:all",
  singleDoctor: (id) => `doctors:${id}`,
  similarDoctors: (id) => `doctors:similar:${id}`,
};

const getMyDoctorProfile = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ userId: req.user._id });

    if (!doctor) {
      return res.status(404).json({
        message: "No doctor profile found. Apply first.",
      });
    }

    res.json(doctor);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateDoctorProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    let imageurl = null;

    const doctor = await Doctor.findOne({ userId });

    if (!doctor) {
      return res.status(404).json({ message: "Doctor profile not found" });
    }

    const { specialization, summary, experience, clinicAddress } = req.body;
    if (req.file) {
      const uploadResult = await uploadToCloudinary(req.file.path);
      imageurl = uploadResult.secure_url;
    }

    if (imageurl) {
      await User.findByIdAndUpdate(userId, { image: imageurl });
    }

    doctor.specialization = specialization || doctor.specialization;
    doctor.summary = summary || doctor.summary;
    doctor.experience = experience || doctor.experience;
    doctor.clinicAddress = clinicAddress || doctor.clinicAddress;

    await doctor.save();
    const redis = req.redisClient;
    await redis.del(cacheKeys.allDoctors());
    await redis.del(cacheKeys.singleDoctor(doctor._id));
    await redis.del(cacheKeys.similarDoctors(doctor._id));
    res.json({
      message: "Doctor profile updated successfully",
      doctor,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getAllDoctors = async (req, res) => {
  const redis = req.redisClient;
  const key = cacheKeys.allDoctors();
  try {
    const cached = await redis.get(key);
    if (cached) {
      return res.json(JSON.parse(cached));
    }

    const doctors = await Doctor.find().populate("userId", "name email image");

    // Add rating stats to each doctor
    const doctorsWithStats = await Promise.all(
      doctors.map(async (doc) => {
        const stats = await Review.aggregate([
          { $match: { doctor: doc._id } },
          {
            $group: {
              _id: "$doctor",
              averageRating: { $avg: "$rating" },
              reviewCount: { $sum: 1 },
            },
          },
        ]);

        return {
          ...doc.toObject(),
          averageRating:
            stats.length > 0 ? Number(stats[0].averageRating.toFixed(1)) : 0,
          reviewCount: stats.length > 0 ? stats[0].reviewCount : 0,
        };
      }),
    );

    await redis.set(
      key,
      JSON.stringify(doctorsWithStats),
      "EX",
      CACHE_TTL.ALL_DOCTORS
    );
    res.json(doctorsWithStats);
  } catch (err) {
    console.error("GetAllDoctors Error:", err);
    res.status(500).json({ error: "Failed to fetch doctors", detail: err.message });
  }
};

const getSingleDoctor = async (req, res) => {
  const redis = req.redisClient;
  const key = cacheKeys.singleDoctor(req.params.doctorId);
  try {
    const { doctorId } = req.params;
    const cached = await redis.get(key);

    if (cached) {
      return res.json(JSON.parse(cached));
    }

    const doctor = await Doctor.findById(doctorId).populate(
      "userId",
      "name email image",
    );

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    // Add rating stats
    const stats = await Review.aggregate([
      { $match: { doctor: doctor._id } },
      {
        $group: {
          _id: "$doctor",
          averageRating: { $avg: "$rating" },
          reviewCount: { $sum: 1 },
        },
      },
    ]);

    const doctorData = {
      ...doctor.toObject(),
      averageRating:
        stats.length > 0 ? Number(stats[0].averageRating.toFixed(1)) : 0,
      reviewCount: stats.length > 0 ? stats[0].reviewCount : 0,
    };

    await redis.set(key, JSON.stringify(doctorData), "EX", CACHE_TTL.SINGLE_DOCTOR);
    res.json(doctorData);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const similarDoctors = async (req, res) => {
  const redis = req.redisClient;
  const key = cacheKeys.similarDoctors(req.params.doctorId);

  try {
    const { doctorId } = req.params;
    const cached = await redis.get(key);
    if (cached) {
      return res.json(JSON.parse(cached));
    }

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    const allDoctors = await Doctor.find({
      _id: { $ne: doctor._id },
      specialization: doctor.specialization,
    })
      .populate("userId", "name image")
      .lean();
    await redis.set(key, JSON.stringify(allDoctors), "EX", CACHE_TTL.SIMILAR_DOCTORS);
    res.json(allDoctors);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const addFilter = async (req, res) => {
  try {
    const { clinicAddress, specialization } = req.query;
    let query = {};
    if (clinicAddress) {
      query.clinicAddress = { $regex: clinicAddress, $options: "i" };
    }
    if (specialization) {
      query.specialization = specialization;
    }
    const doctors = await Doctor.find(query).populate(
      "userId",
      "name email image",
    );
    res.json(doctors);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getMyDoctorProfile,
  updateDoctorProfile,
  getAllDoctors,
  getSingleDoctor,
  similarDoctors,
  addFilter,
};
