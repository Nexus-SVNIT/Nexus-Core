const express = require('express');
const { getPostById, getPendingPosts, verifyPost } = require('../controllers/postController');
const router = express.Router();

router.get('/pending', getPendingPosts);
router.get('/:id', getPostById);
router.post('/:postId/verify', verifyPost);


module.exports = router;