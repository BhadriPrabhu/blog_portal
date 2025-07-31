const Blog = require('../models/blogSchema');

const AdminBlogRestore = async (req, res) => {
  const { ids } = req.body;
  try {
    const result = await Blog.updateMany(
      { _id: { $in: ids } },
      { $set: { status: 'active' } }
    );
    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'No posts found to restore' });
    }
    res.json({ message: 'Posts restored', count: result.modifiedCount });
  } catch (err) {
    console.error('Restore error:', err);
    res.status(500).json({ error: 'Server error', details: err.message });
  }
};

const AdminBlogUnarchive = async (req, res) => {
  const { ids } = req.body;
  try {
    const result = await Blog.updateMany(
      { _id: { $in: ids } },
      { $set: { status: 'active' } }
    );
    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'No posts found to unarchive' });
    }
    res.json({ message: 'Posts unarchived', count: result.modifiedCount });
  } catch (err) {
    console.error('Unarchive error:', err);
    res.status(500).json({ error: 'Server error', details: err.message });
  }
};

const AdminBlogPermanentDelete = async (req, res) => {
  const { ids } = req.body;
  try {
    const result = await Blog.deleteMany({ _id: { $in: ids } });
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'No posts found to delete' });
    }
    res.json({ message: 'Posts permanently deleted', count: result.deletedCount });
  } catch (err) {
    console.error('Permanent delete error:', err);
    res.status(500).json({ error: 'Server error', details: err.message });
  }
};

const AdminBlogDelete = async (req, res) => {
  const { ids } = req.body;
  try {
    const result = await Blog.updateMany(
      { _id: { $in: ids } },
      { $set: { status: 'deleted' } }
    );
    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'No posts found to delete' });
    }
    res.json({ message: 'Posts deleted', count: result.modifiedCount });
  } catch (err) {
    console.error('Delete error:', err);
    res.status(500).json({ error: 'Server error', details: err.message });
  }
};

const AdminBlogArchive = async (req, res) => {
  const { ids } = req.body;
  try {
    const result = await Blog.updateMany(
      { _id: { $in: ids } },
      { $set: { status: 'archived' } }
    );
    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'No posts found to archive' });
    }
    res.json({ message: 'Posts archived', count: result.modifiedCount });
  } catch (err) {
    console.error('Archive error:', err);
    res.status(500).json({ error: 'Server error', details: err.message });
  }
};

module.exports = { AdminBlogArchive, AdminBlogDelete, AdminBlogPermanentDelete, AdminBlogRestore, AdminBlogUnarchive };