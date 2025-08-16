const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const coreAuthMiddleware = require('../middlewares/coreAuthMiddleware.js');
const {
  getAllUsers,
  getUserStats,
  notifyBatch,
} = require('../controllers/userController.js');
const Post = require('../models/postModel');

router.get('/get/all', coreAuthMiddleware, getAllUsers);
router.post('/notify-batch', coreAuthMiddleware, notifyBatch);
router.get('/stats', coreAuthMiddleware, getUserStats);

module.exports = router;

