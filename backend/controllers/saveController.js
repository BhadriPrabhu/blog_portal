const Blog = require('../models/blogSchema');

const saveController = async (req, res) => {
  const { blogId, userId } = req.body;

  try {
    if (!userId) return res.status(400).json({ message: 'userId is required' });
    if (!blogId) return res.status(400).json({ message: 'blogId is required' });

    const blog = await Blog.findById(blogId);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });

    const userIdStr = userId.toString();
    const savedByStr = (blog.savedBy || []).map(id => id.toString());
    const alreadySaved = savedByStr.includes(userIdStr);

    if (alreadySaved) {
      blog.savedBy = (blog.savedBy || []).filter(id => id.toString() !== userIdStr);
    } else {
      blog.savedBy = blog.savedBy || [];
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
      body: req.body,
    });
    res.status(500).json({ message: 'Error toggling save', error: err.message });
  }
};

module.exports = saveController;