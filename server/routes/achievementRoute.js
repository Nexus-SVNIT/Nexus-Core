const express = require('express');
const {
  allAchievements,
  pendingAchievements,
  verifyAchievement,
  unverifyAchievement,
  deleteAchievement
} = require('../controllers/achievementController.js');
const multer = require('multer');
const path = require('path');

// Configure multer to store files in the writable /tmp directory
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, '/tmp'); // Use /tmp as the temporary directory for serverless environments
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });
const router = express.Router();

router.get('/', allAchievements);
router.get('/pending', pendingAchievements);
router.patch('/verify/:id', verifyAchievement);
router.patch('/unverify/:id', unverifyAchievement);
router.delete('/:id', deleteAchievement); // New endpoint for deletion

module.exports = router;
