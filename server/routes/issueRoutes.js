const express = require("express");
const router = express.Router();
const { getIssues } = require("../controllers/issueController");
const coreAuthMiddleware = require('../middlewares/coreAuthMiddleware');

router.get("/admin", coreAuthMiddleware, getIssues);

module.exports = router;
