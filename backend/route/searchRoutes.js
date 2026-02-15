const express = require("express");
const router = express.Router();
const aiSearch = require("../controllers/searchController");

router.post("/search", aiSearch);

module.exports = router;
