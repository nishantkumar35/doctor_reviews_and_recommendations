const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true, required: true },

    email: {
      type: String,
      unique: true,
      required: true,
      match: [/^\S+@\S+\.\S+$/, "Invalid email"],
    },

    password: { type: String, trim: true },

    image: {
      type: String
    },

    googleId: String,

    role: {
      type: String,
      enum: ["user", "doctor"],
      default: "user",
    },

    twoFactorEnabled: { type: Boolean, default: true },
    otpCode: String,
    otpExpiry: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
