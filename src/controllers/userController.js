const User = require('../models/User');

exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
      .populate('social.followers', 'username profile.avatar')
      .populate('social.following', 'username profile.avatar')
      .populate({
        path: 'posts',
        options: { sort: { createdAt: -1 }, limit: 10 }
      });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, bio, location, website, avatar, coverImage } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        $set: {
          'profile.firstName': firstName,
          'profile.lastName': lastName,
          'profile.bio': bio,
          'profile.location': location,
          'profile.website': website,
          'profile.avatar': avatar,
          'profile.coverImage': coverImage,
          updatedAt: new Date()
        }
      },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.followUser = async (req, res) => {
  try {
    const { userId } = req.params;

    if (userId === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'You cannot follow yourself'
      });
    }

    const targetUser = await User.findById(userId);
    const currentUser = await User.findById(req.user.id);

    if (!targetUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (currentUser.social.following.includes(userId)) {
      return res.status(400).json({
        success: false,
        message: 'You are already following this user'
      });
    }

    currentUser.social.following.push(userId);
    currentUser.social.followingCount = currentUser.social.following.length;

    targetUser.social.followers.push(req.user.id);
    targetUser.social.followerCount = targetUser.social.followers.length;

    await currentUser.save();
    await targetUser.save();

    res.status(200).json({
      success: true,
      message: 'User followed successfully',
      data: {
        followingCount: currentUser.social.followingCount,
        followerCount: targetUser.social.followerCount
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.unfollowUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const targetUser = await User.findById(userId);
    const currentUser = await User.findById(req.user.id);

    if (!targetUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (!currentUser.social.following.includes(userId)) {
      return res.status(400).json({
        success: false,
        message: 'You are not following this user'
      });
    }

    currentUser.social.following = currentUser.social.following.filter(
      id => id.toString() !== userId
    );
    currentUser.social.followingCount = currentUser.social.following.length;

    targetUser.social.followers = targetUser.social.followers.filter(
      id => id.toString() !== req.user.id
    );
    targetUser.social.followerCount = targetUser.social.followers.length;

    await currentUser.save();
    await targetUser.save();

    res.status(200).json({
      success: true,
      message: 'User unfollowed successfully',
      data: {
        followingCount: currentUser.social.followingCount,
        followerCount: targetUser.social.followerCount
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.getFollowers = async (req, res) => {
  try {
    const { skip = 0, limit = 20 } = req.query;

    const user = await User.findById(req.params.userId)
      .populate({
        path: 'social.followers',
        select: 'username profile',
        options: {
          skip: parseInt(skip),
          limit: parseInt(limit)
        }
      });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      count: user.social.followers.length,
      totalCount: user.social.followerCount,
      data: user.social.followers
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.getFollowing = async (req, res) => {
  try {
    const { skip = 0, limit = 20 } = req.query;

    const user = await User.findById(req.params.userId)
      .populate({
        path: 'social.following',
        select: 'username profile',
        options: {
          skip: parseInt(skip),
          limit: parseInt(limit)
        }
      });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      count: user.social.following.length,
      totalCount: user.social.followingCount,
      data: user.social.following
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};