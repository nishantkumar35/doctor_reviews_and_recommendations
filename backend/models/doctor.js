const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
    specialization: String,
    summary:String,
    experience: Number,
    clinicAddress: String,

},{timestamps : true});

module.exports = mongoose.model("Doctor",doctorSchema);