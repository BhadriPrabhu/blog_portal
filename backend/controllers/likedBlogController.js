const Blog = require('../models/blogSchema');

const savedController = async (req, res) => {
  const { userId } = req.query;

  try {
    if (!userId) {
      console.log('Missing userId in likedBlogController');
      return res.status(400).json({ message: 'userId is required' });
    }

    const result = await Blog
      .find({ likedBy: userId, status: 'active' })
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

    const sanitizedResult = result.map(blog => ({
      ...blog,
      status: blog.status || 'active',
      liked: userId ? blog.likedBy?.includes(userId) || false : false,
      saved: userId ? blog.savedBy?.includes(userId) || false : false,
      comments: (blog.comments || []).map(comment => ({
        ...comment,
        status: comment.status || 'pending',
        user: comment.user && comment.user._id ? comment.user : { user: 'Unknown', email: 'unknown@example.com' },
        reply: (comment.reply || []).map(reply => ({
          ...reply,
          user: reply.user && reply.user._id ? reply.user : { user: 'Unknown', email: 'unknown@example.com' },
        })),
      })),
    }));

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