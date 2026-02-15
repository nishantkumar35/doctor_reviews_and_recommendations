const Doctor = require("../models/doctor");
const Review = require("../models/review");
const { predictSpecialty } = require("../ai/aiClassifier");

const aiSearch = async (req, res) => {
  try {
    const { problem } = req.body;

    if (!problem) {
      return res.status(400).json({ message: "Problem description required" });
    }

    const specialization = await predictSpecialty(problem);

    const doctors = await Doctor.find({ specialization }).populate(
      "userId",
      "name email image"
    );

    if (doctors.length === 0) {
      return res.status(200).json({ 
        message: "No doctors found for this issue", 
        specialization,
        doctors: [] 
      });
    }

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

    res.json({
      message: "Doctors found successfully",
      specialization,
      doctors: doctorsWithStats,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: e.message });
  }
};

module.exports = aiSearch;
