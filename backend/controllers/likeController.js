const Blog = require('../models/blogSchema');

const likeController = async (req, res) => {
  const { blogId, userId } = req.body;

  try {
    if (!userId) return res.status(400).json({ message: 'userId is required' });
    const blog = await Blog.findById(blogId);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });

    const alreadyLiked = blog.likedBy.includes(userId);

    if (alreadyLiked) {
      blog.likedBy = blog.likedBy.filter(id => id !== userId);
      blog.like -= 1;
    } else {
      blog.likedBy.push(userId);
      blog.like += 1;
    }

    await blog.save();
    res.status(200).json({
      message: `Blog has been ${alreadyLiked ? 'unliked' : 'liked'}`,
      likeCount: blog.like,
      liked: !alreadyLiked,
    });
  } catch (err) {
    console.error('Like blog error:', {
      message: err.message,
      stack: err.stack,
      timestamp: new Date().toISOString(),
    });
    res.status(500).json({ message: 'Error toggling like', error: err.message });
  }
};

module.exports = likeController;