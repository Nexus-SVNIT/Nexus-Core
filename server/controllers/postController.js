const Post = require('../models/postModel');
const { sendEmail } = require('../utils/emailUtils');
const { postVerificationTemplate } = require('../utils/emailTemplates');

const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'fullName linkedInProfile admissionNumber')
      .populate('questions.askedBy')
      .populate('questions')
      .select('+views'); // Ensure views are included
    
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getPendingPosts = async (req, res) => {
  try {
    const posts = await Post.find({ isVerified: false })
      .populate('author', 'fullName linkedInProfile admissionNumber')
      .sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: error.message });
  }
};

const verifyPost = async (req, res) => {
  try {
    const { postId } = req.params;

    const post = await Post.findById(postId).populate('author');
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    post.isVerified = true;
    post.verifiedAt = new Date();
    await post.save();

    // Send verification email to the author
    if (post.author.personalEmail) {
      const emailContent = postVerificationTemplate(
        post.author,
        post.title,
        post._id
      );
      await sendEmail({
        to: post.author.personalEmail,
        ...emailContent
      });
    }

    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { 
  getPostById,
  getPendingPosts,
  verifyPost,
};