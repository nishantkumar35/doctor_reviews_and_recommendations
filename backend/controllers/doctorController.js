const Doctor = require("../models/doctor.js");
const User = require("../models/user.js");
const Review = require("../models/review.js");
const uploadToCloudinary = require("../utils/cloudinaryUpload");

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

    res.json({
      message: "Doctor profile updated successfully",
      doctor,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getAllDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find().populate("userId", "name email image");
    
    // Add rating stats to each doctor
    const doctorsWithStats = await Promise.all(doctors.map(async (doc) => {
       const stats = await Review.aggregate([
         { $match: { doctor: doc._id } },
         { $group: { 
             _id: "$doctor", 
             averageRating: { $avg: "$rating" },
             reviewCount: { $sum: 1 }
           } 
         }
       ]);
       
       return {
         ...doc.toObject(),
         averageRating: stats.length > 0 ? Number(stats[0].averageRating.toFixed(1)) : 0,
         reviewCount: stats.length > 0 ? stats[0].reviewCount : 0
       };
    }));

    res.json(doctorsWithStats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getSingleDoctor = async (req, res) => {
  try {
    const { doctorId } = req.params;

    const doctor = await Doctor.findById(doctorId).populate(
      "userId",
      "name email image"
    );

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    // Add rating stats
    const stats = await Review.aggregate([
      { $match: { doctor: doctor._id } },
      { $group: { 
          _id: "$doctor", 
          averageRating: { $avg: "$rating" },
          reviewCount: { $sum: 1 }
        } 
      }
    ]);

    const doctorData = {
      ...doctor.toObject(),
      averageRating: stats.length > 0 ? Number(stats[0].averageRating.toFixed(1)) : 0,
      reviewCount: stats.length > 0 ? stats[0].reviewCount : 0
    };

    res.json(doctorData);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getMyDoctorProfile,
  updateDoctorProfile,
  getAllDoctors,
  getSingleDoctor,
};
