const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
    specialization: { type: String, index: true },
    summary: String,
    experience: Number,
    clinicAddress: { type: String, index: true },

},{timestamps : true});

module.exports = mongoose.model("Doctor",doctorSchema);