const express = require('express');
const { getPostById, getPendingPosts, verifyPost } = require('../controllers/postController');
const coreAuthMiddleware = require('../middlewares/coreAuthMiddleware');
const router = express.Router();

router.get('/pending', coreAuthMiddleware, getPendingPosts);
router.get('/:id', getPostById);
router.post('/:postId/verify', coreAuthMiddleware, verifyPost);


module.exports = router;