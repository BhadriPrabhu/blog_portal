const mongoose = require('mongoose');
const Blog = require('../models/blogSchema');
const Auth = require('../models/authSchema');

const savedController = async (req, res) => {
  const { userId } = req.query;

  try {
    if (!userId) {
      console.log('Missing userId in likedBlogController');
      return res.status(400).json({ message: 'userId is required' });
    }

    // Resolve email -> ObjectId if necessary
    let queryUserId = userId;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      const userDoc = await Auth.findOne({ email: userId }).select('_id').lean();
      if (!userDoc) {
        console.log('No user found for provided userId/email');
        return res.status(200).json([]);
      }
      queryUserId = userDoc._id;
    }

    const result = await Blog
      .find({ likedBy: queryUserId, status: 'active' })
      .populate({
        path: 'user',
        select: 'user email',
        strictPopulate: false,
      })
      .populate({
        path: 'comments.user',
        select: 'user email',
        strictPopulate: false,
      })
      .populate({
        path: 'comments.reply.user',
        select: 'user email',
        strictPopulate: false,
      })
      .lean();

    const sanitizedResult = result.map(blog => {
      const likedByStr = (blog.likedBy || []).map(id => id.toString());
      const savedByStr = (blog.savedBy || []).map(id => id.toString());
      const userIdStr = queryUserId ? queryUserId.toString() : (userId ? userId.toString() : '');

      return {
        ...blog,
        status: blog.status || 'active',
        liked: userIdStr ? likedByStr.includes(userIdStr) : false,
        saved: userIdStr ? savedByStr.includes(userIdStr) : false,
        comments: (blog.comments || []).map(comment => ({
          ...comment,
          status: comment.status || 'pending',
          user: comment.user && comment.user._id ? comment.user : { user: 'Unknown', email: 'unknown@example.com' },
          reply: (comment.reply || []).map(reply => ({
            ...reply,
            user: reply.user && reply.user._id ? reply.user : { user: 'Unknown', email: 'unknown@example.com' },
          })),
        })),
      };
    });

    console.log(`Fetched ${sanitizedResult.length} liked blogs for userId: ${userId}`);
    res.status(200).json(sanitizedResult);
  } catch (err) {
    console.error('Liked blog error:', {
      message: err.message,
      stack: err.stack,
      query: req.query,
      timestamp: new Date().toISOString(),
    });
    res.status(500).json({ message: 'Error fetching liked blogs', error: err.message });
  }
};

module.exports = savedController;