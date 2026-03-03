const Blog = require('../models/blogSchema');

const blogController = async (req, res) => {
  try {
    const { status, sortBy, userId, search } = req.query;
    const validStatuses = ['active', 'archived', 'deleted', 'report'];

    let filter = {status: "active"};
    if (status) {
      filter.status = status;
    }
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
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
        select: 'user email',
      })
      .populate({
        path: 'comments.user',
        select: 'user email',
      })
      .populate({
        path: 'comments.reply.user',
        select: 'user email',
      })
      .sort(sortOption)
      .lean();

    const sanitizedBlogs = blogs.map(blog => ({
      ...blog,
      liked: userId ? blog.likedBy?.includes(userId) || false : false,
      saved: userId ? blog.savedBy?.includes(userId) || false : false,
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
    }));

    res.status(200).json(sanitizedBlogs);
  } catch (err) {
    console.log("Blog Controller Error:",err.message)
    res.status(500).json({ error: 'Server error', details: err.message });
  }
};

module.exports = blogController;