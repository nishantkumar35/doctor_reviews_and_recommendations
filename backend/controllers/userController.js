const User = require("../models/user");
const Doctor = require("../models/doctor");

const getMyUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "No user profile found.",
      });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const applyDoctor = async (req, res) => {
  try {
    const userId = req.user._id;
    const { specialization, summary, experience, clinicAddress } = req.body;

    const existing = await Doctor.findOne({ userId });
    if (existing) {
      return res.status(400).json({ message: "Doctor profile already exists" });
    }

    const doctor = await Doctor.create({
      userId,
      specialization,
      summary,
      experience,
      clinicAddress,
    });

    await User.findByIdAndUpdate(userId, { role: "doctor" });

    res.json({
      message: "Doctor application submitted successfully",
      doctor,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { name, twoFactorEnabled } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (name) user.name = name;
    if (typeof twoFactorEnabled !== "undefined") {
      user.twoFactorEnabled = twoFactorEnabled;
    }

    await user.save();

    const safeUser = user.toObject();
    delete safeUser.password;
    delete safeUser.otpCode;
    delete safeUser.otpExpiry;

    res.json({
      message: "Profile updated successfully",
      user: safeUser,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getMyUserProfile, applyDoctor, updateProfile };
