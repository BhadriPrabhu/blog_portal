const Blog = require('../models/blogSchema');

const saveController = async (req, res) => {
  const { blogId, userId } = req.body;

  try {
    if (!userId) return res.status(400).json({ message: 'userId is required' });
    const blog = await Blog.findById(blogId);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });

    const alreadySaved = blog.savedBy.includes(userId);

    if (alreadySaved) {
      blog.savedBy = blog.savedBy.filter(id => id !== userId);
    } else {
      blog.savedBy.push(userId);
    }

    await blog.save();
    res.status(200).json({
      message: `Blog has been ${alreadySaved ? 'unsaved' : 'saved'}`,
      saved: !alreadySaved,
    });
  } catch (err) {
    console.error('Save blog error:', {
      message: err.message,
      stack: err.stack,
      timestamp: new Date().toISOString(),
    });
    res.status(500).json({ message: 'Error toggling save', error: err.message });
  }
};

module.exports = saveController;