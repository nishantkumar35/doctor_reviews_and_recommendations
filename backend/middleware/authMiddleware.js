const User = require("../models/user");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const protect = async (req, res, next) => {
  try {
    let token = null;

    if (req.headers.authorization?.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    
    const user = await User.findById(decoded.id).select(
      "-password -otpCode -otpExpiry -__v"
    );

    if (!user) {
      return res.status(401).json({ message: "User no longer exists" });
    }

    req.user = user;
    next();
  } catch (e) {
    console.log(e);
    return res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = protect;
