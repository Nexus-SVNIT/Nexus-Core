const express = require("express");
const router = express.Router();
const { getIssues } = require("../controllers/issueController");

router.get("/admin", getIssues);

module.exports = router;
