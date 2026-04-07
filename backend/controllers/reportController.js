const Blog = require('../models/blogSchema');

const flagPost = async (req, res) => {
    const { ids } = req.body;
    try {
        const result = await Blog.updateMany(
            { _id: { $in: ids } },
            { $set: { status: 'flag' } }
        );
        if (result.matchedCount === 0) {
            return res.status(404).json({ error: 'No posts found to Flag' });
        }
        res.json({ message: 'Posts flagged' });
    } catch (err) {
        console.error('Flag error:', err);
        res.status(500).json({ error: 'Server error', details: err.message });
    }
}

const reportPost = async (req, res) => {
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

const unReportAiFlag = async (req, res) => {
    const { ids } = req.body;
    try{
        const result = await Blog.updateMany(
            { _id: { $in: ids }},
            {$set: { status: 'active' }}
        );
        if(result.matchedCount === 0){
            return res.status(404).json({ error: 'No posts found to Unreport' });
        }
        res.json({ message: 'Posts Unreported'});
    }catch(err){
        console.log('Report Error:',err);
        res.status(500).json({ error: 'Server Error', details: err.message });
    }
}

module.exports = { flagPost, reportPost, unReportAiFlag };