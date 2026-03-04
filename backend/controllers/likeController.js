const Blog = require('../models/blogSchema');

const likeController = async (req, res) => {
  try {
    if (!req || !req.body) return res.status(400).json({ message: 'Request body is required' });
    const { blogId, userId } = req.body;

    if (!userId) return res.status(400).json({ message: 'userId is required' });
    if (!blogId) return res.status(400).json({ message: 'blogId is required' });

    // Load the blog document and operate on its arrays safely
    const blog = await Blog.findById(blogId).exec();
    if (!blog) return res.status(404).json({ message: 'Blog not found' });

    const likedByArr = Array.isArray(blog.likedBy) ? blog.likedBy.map(id => id && id.toString()) : [];
    const userIdStr = userId.toString();
    const alreadyLiked = likedByArr.includes(userIdStr);

    if (alreadyLiked) {
      // remove like and decrement safely
      blog.likedBy = (blog.likedBy || []).filter(id => id && id.toString() !== userIdStr);
      blog.like = Math.max(0, (blog.like || 0) - 1);
      await blog.save();
      return res.status(200).json({ message: 'Blog has been unliked', likeCount: blog.like, liked: false });
    }

    // add like
    blog.likedBy = blog.likedBy || [];
    blog.likedBy.push(userId);
    blog.like = (blog.like || 0) + 1;
    await blog.save();
    return res.status(200).json({ message: 'Blog has been liked', likeCount: blog.like || 0, liked: true });
  } catch (err) {
    console.error('Like blog error:', {
      message: err.message,
      stack: err.stack,
      timestamp: new Date().toISOString(),
      body: req.body,
    });
    res.status(500).json({ message: 'Error toggling like', error: err.message });
  }
};

module.exports = likeController;