const Blog = require('../models/blogSchema');

const blogController = async (req, res) => {
  try {
    const { status, sortBy, userId, search } = req.query;
    const validStatuses = ['active', 'archived', 'deleted', 'report', 'flag'];

    let filter = { status: validStatuses.includes(status) ? status : "active" };
    if (status) {
      filter.status = status;
    }
    if (search) {
      const safeSearch = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      filter.$or = [
        { title: { $regex: safeSearch, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } },
      ];
    }

    let sortOption = {};
    switch (sortBy) {
      case 'liked':
        sortOption = { like: -1 };
        break;
      case 'oldest':
        sortOption = { date: 1 };
        break;
      case 'newest':
        sortOption = { date: -1 };
        break;
      case 'commented':
        sortOption = { 'comments.length': -1 };
        break;
      default:
        sortOption = { date: -1 };
    }

    const blogs = await Blog.find(filter)
      .populate({
        path: 'user',
        select: 'user email username role',
      })
      .populate({
        path: 'comments.user',
        select: 'user email username role',
      })
      .populate({
        path: 'comments.reply.user',
        select: 'user email username role',
      })
      .sort(sortOption)
      .lean();

    const sanitizedBlogs = blogs.map(blog => {
      // Convert Mongoose ObjectIds to Strings for reliable comparison
      const likedByStr = (blog.likedBy || []).map(id => id.toString());
      const savedByStr = (blog.savedBy || []).map(id => id.toString());

      return {
        ...blog,
        // Use the converted string arrays to check status
        liked: userId ? likedByStr.includes(userId.toString()) : false,
        saved: userId ? savedByStr.includes(userId.toString()) : false,
        tags: blog.tags || [],
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

    res.status(200).json(sanitizedBlogs);
  } catch (err) {
    console.log("Blog Controller Error:", err.message)
    res.status(500).json({ error: 'Server error', details: err.message });
  }
};

const findBlog = async (req, res) => {
  try {
    const { id } = req.params;

const result = await Blog.findById(id)
      .populate('user comments.user comments.reply.user', 'user email username role');

    res.status(200).json(result);
  } catch (err) {
    console.log("Failed:", err);
    res.status(500).json({ error: 'Server Error', details: err.message })
  }
}

module.exports = { blogController, findBlog };