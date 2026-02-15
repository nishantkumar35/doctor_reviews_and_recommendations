const bcrypt = require("bcryptjs");
const User = require("../models/user");
const generateToken = require("../utils/generateToken");
const sendEmail = require("../utils/sendEmail");
const { OAuth2Client } = require("google-auth-library");
const cloudinary = require("../config/cloudinary");
const uploadToCloudinary = require("../utils/cloudinaryUpload");
require("dotenv").config();

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    console.log("BODY:", req.body);
    console.log("FILE:", req.file);
    let imageurl = null;
    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (req.file) {
      const uploadResult = await uploadToCloudinary(req.file.path);
      imageurl = uploadResult.secure_url;
    }

    const exists = await User.findOne({ email });
    if (exists)
      return res.status(400).json({ message: "Email already exists" });

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashed,
      role,
      image: imageurl,
    });

    res.json({ message: "Registered successfully" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Invalid credentials" });

    if (user.twoFactorEnabled) {
      const otp = Math.floor(100000 + Math.random() * 900000);

      user.otpCode = otp;
      user.otpExpiry = Date.now() + 5 * 60 * 1000;
      await user.save();

      await sendEmail(
        user.email,
        "Verification Code (OTP)",
        `Your OTP is ${otp}. Valid for 5 minutes.`
      );

      return res.json({
        needOTP: true,
        message: "OTP sent to email",
      });
    }

    const safeUser = user.toObject();
    delete safeUser.password;
    delete safeUser.otpCode;
    delete safeUser.otpExpiry;

    res.json({
      token: generateToken(user._id),
      user: safeUser,
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.otpCode || user.otpExpiry < Date.now())
      return res.status(400).json({ message: "OTP expired" });

    if (String(user.otpCode) !== String(otp))
      return res.status(400).json({ message: "Invalid OTP" });

    user.otpCode = null;
    user.otpExpiry = null;
    await user.save();

    const safeUser = user.toObject();
    delete safeUser.password;
    delete safeUser.otpCode;
    delete safeUser.otpExpiry;

    res.json({
      token: generateToken(user._id),
      user: safeUser,
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

const googleLogin = async (req, res) => {
  try {
    const { token } = req.body;

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const { email, name, sub, picture } = ticket.getPayload();

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        name,
        email,
        googleId: sub,
        image: picture,
        role: "user",
      });
    } else {
      if (!user.image) {
        user.image = picture;
        await user.save();
      }
    }

    const safeUser = user.toObject();
    delete safeUser.password;
    delete safeUser.otpCode;
    delete safeUser.otpExpiry;

    res.json({
      token: generateToken(user._id),
      user: safeUser,
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

module.exports = { register, login, verifyOTP, googleLogin };
