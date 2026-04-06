const Blog = require('../models/blogSchema');

// Increment view count
const incrementViewCount = async (req, res) => {
    try {
        const { id } = req.params;
        const doc = await Blog.findByIdAndUpdate(
            id,
            { $inc: { viewCount: 1 } },
            { new: true }
        );
        if (!doc) return res.status(404).json({ message: 'Not found' });
        res.json(doc);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Increment share count
const incrementShareCount = async (req, res) => {
    try {
        const { id } = req.params;
        const doc = await Blog.findByIdAndUpdate(
            id,
            { $inc: { shareCount: 1 } },
            { new: true }
        );
        if (!doc) return res.status(404).json({ message: 'Not found' });
        res.json(doc);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get analytics data for popupAnalytics
const getAnalyticsData = async (req, res) => {
    try {
        const { id } = req.params;
        const doc = await Blog.findById(id, 'viewCount shareCount');
        if (!doc) return res.status(404).json({ message: 'Not found' });
        res.json(doc);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { incrementViewCount, incrementShareCount, getAnalyticsData };