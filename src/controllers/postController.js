const Post = require('../models/Post');
const User = require('../models/User');

exports.createPost = async (req, res) => {
  try {
    const { content, image, visibility } = req.body;

    if (!content) {
      return res.status(400).json({
        success: false,
        message: 'Please provide post content'
      });
    }

    const post = new Post({
      author: req.user.id,
      content,
      image: image || null,
      visibility: visibility || 'public'
    });

    await post.save();
    await post.populate('author', 'username profile.avatar');

    await User.findByIdAndUpdate(req.user.id, {
      $push: { posts: post._id }
    });

    res.status(201).json({
      success: true,
      message: 'Post created successfully',
      data: post
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.getFeed = async (req, res) => {
  try {
    const { skip = 0, limit = 20 } = req.query;

    const user = await User.findById(req.user.id);
    const followingIds = [req.user.id, ...user.social.following];

    const posts = await Post.find({
      author: { $in: followingIds },
      visibility: { $in: ['public', 'followers'] }
    })
      .sort({ createdAt: -1 })
      .skip(parseInt(skip))
      .limit(parseInt(limit))
      .populate('author', 'username profile')
      .populate('comments');

    res.status(200).json({
      success: true,
      count: posts.length,
      data: posts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId)
      .populate('author', 'username profile')
      .populate({
        path: 'comments',
        populate: { path: 'author', select: 'username profile.avatar' }
      });

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    res.status(200).json({
      success: true,
      data: post
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.updatePost = async (req, res) => {
  try {
    let post = await Post.findById(req.params.postId);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this post'
      });
    }

    post = await Post.findByIdAndUpdate(req.params.postId, req.body, {
      new: true,
      runValidators: true
    }).populate('author', 'username profile');

    res.status(200).json({
      success: true,
      message: 'Post updated successfully',
      data: post
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this post'
      });
    }

    await User.findByIdAndUpdate(req.user.id, {
      $pull: { posts: req.params.postId }
    });

    await Post.findByIdAndDelete(req.params.postId);

    res.status(200).json({
      success: true,
      message: 'Post deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    if (post.likes.includes(req.user.id)) {
      return res.status(400).json({
        success: false,
        message: 'You already liked this post'
      });
    }

    post.likes.push(req.user.id);
    post.likeCount = post.likes.length;
    await post.save();

    res.status(200).json({
      success: true,
      message: 'Post liked successfully',
      data: { likeCount: post.likeCount }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.unlikePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    if (!post.likes.includes(req.user.id)) {
      return res.status(400).json({
        success: false,
        message: 'You have not liked this post'
      });
    }

    post.likes = post.likes.filter(id => id.toString() !== req.user.id);
    post.likeCount = post.likes.length;
    await post.save();

    res.status(200).json({
      success: true,
      message: 'Post unliked successfully',
      data: { likeCount: post.likeCount }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};