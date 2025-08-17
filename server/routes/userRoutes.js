const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  getUserStats,
  notifyBatch,
} = require('../controllers/userController.js');
const Post = require('../models/postModel');

router.get('/get/all', getAllUsers);
router.post('/notify-batch', notifyBatch);
router.get('/stats', getUserStats);

module.exports = router;

