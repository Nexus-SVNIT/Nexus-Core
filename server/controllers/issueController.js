const Issue = require("../models/issueModel.js");

exports.getIssues = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const [issues, total] = await Promise.all([
      Issue.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
      Issue.countDocuments()
    ]);
    res.json({
      issues,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch issues.' });
  }
};
