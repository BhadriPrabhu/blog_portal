const Auth = require("../models/authSchema");

const mentionController = async (req, res) => {
    const { search } = req.query;

    if (!search || search.length < 1) {
        return res.status(200).json({ message: [] });
    }

    try {
        let result = []
        if (search) {
            const safeSearch = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            result = await Auth.find({ username: { $regex: safeSearch, $options: 'i' } });
        }
        res.status(200).json({ message: result });
    } catch (err) {
        console.log("Search Error", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

module.exports = { mentionController };