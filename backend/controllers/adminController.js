const Blog = require('../models/blogSchema');

const CommentApproveController = async (req, res) => {
  const { commentId, blogId } = req.body;
  try {
    const blog = await Blog.findById(blogId);
    if (!blog) return res.status(404).json({ error: 'Blog not found' });

    const comment = blog.comments.id(commentId);
    if (!comment) return res.status(404).json({ error: 'Comment not found' });

    comment.status = 'approved';
    await blog.save();
    res.json({ message: 'Comment approved', comment });
  } catch (err) {
    console.error('Approve comment error:', err);
    res.status(500).json({ error: 'Server error', details: err.message });
  }
};

const CommentDeleteController = async (req, res) => {
  const { commentId, blogId } = req.body;
  try {
    const blog = await Blog.findById(blogId);
    if (!blog) return res.status(404).json({ error: 'Blog not found' });

    blog.comments.id(commentId).remove();
    await blog.save();
    res.json({ message: 'Comment deleted' });
  } catch (err) {
    console.error('Delete comment error:', err);
    res.status(500).json({ error: 'Server error', details: err.message });
  }
};

const CommentFlagController = async (req, res) => {
  const { commentId, blogId } = req.body;
  try {
    const blog = await Blog.findById(blogId);
    if (!blog) return res.status(404).json({ error: 'Blog not found' });

    const comment = blog.comments.id(commentId);
    if (!comment) return res.status(404).json({ error: 'Comment not found' });

    comment.status = 'flagged';
    await blog.save();
    res.json({ message: 'Comment flagged', comment });
  } catch (err) {
    console.error('Flag comment error:', err);
    res.status(500).json({ error: 'Server error', details: err.message });
  }
};

const CommentReplyController = async (req, res) => {
  const { commentId, blogId, replyText, userId } = req.body;
  try {
    const blog = await Blog.findById(blogId);
    if (!blog) return res.status(404).json({ error: 'Blog not found' });

    const comment = blog.comments.id(commentId);
    if (!comment) return res.status(404).json({ error: 'Comment not found' });

    comment.reply.push({
      user: userId,
      value: replyText,
      liked: false,
      disliked: false,
    });
    await blog.save();
    res.json({ message: 'Reply added', comment });
  } catch (err) {
    console.error('Reply comment error:', err);
    res.status(500).json({ error: 'Server error', details: err.message });
  }
};

module.exports = { CommentApproveController, CommentDeleteController, CommentReplyController, CommentFlagController };