const express = require('express');
const {
  createPost,
  getFeed,
  getPost,
  updatePost,
  deletePost,
  likePost,
  unlikePost
} = require('../controllers/postController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/', protect, createPost);
router.get('/feed', protect, getFeed);
router.get('/:postId', getPost);
router.put('/:postId', protect, updatePost);
router.delete('/:postId', protect, deletePost);
router.post('/:postId/like', protect, likePost);
router.post('/:postId/unlike', protect, unlikePost);

module.exports = router;