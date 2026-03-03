const Blog = require('../models/blogSchema');

const reportAiFlag = async (req, res) => {
    const { ids } = req.body;
    try {
        const result = await Blog.updateMany(
            { _id: { $in: ids } },
            { $set: { status: 'report' } }
        );
        if (result.matchedCount === 0) {
            return res.status(404).json({ error: 'No posts found to Report' });
        }
        res.json({ message: 'Posts reported' });
    } catch (err) {
        console.error('Report error:', err);
        res.status(500).json({ error: 'Server error', details: err.message });
    }
}

module.exports = { reportAiFlag };