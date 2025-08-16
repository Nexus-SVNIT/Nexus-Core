const express = require('express');
const coreAuthMiddleware = require('../middlewares/coreAuthMiddleware.js');
const authMiddleware = require('../middlewares/authMiddleware.js');
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
router.get('/pending', coreAuthMiddleware, pendingAchievements);
router.patch('/verify/:id', coreAuthMiddleware, verifyAchievement);
router.patch('/unverify/:id', coreAuthMiddleware, unverifyAchievement);
router.delete('/:id', coreAuthMiddleware, deleteAchievement); // New endpoint for deletion

module.exports = router;
