const blogSchemaModel = require("../models/blogSchema.js");

const myPostController = async (req, res) => {
    try {
        const { userId } = req.body;
        const result = await blogSchemaModel
            .find({ user: userId })
            .populate("user", "user email")
            .populate("comments.user", "user email")
            .populate("comments.reply.user", "user email");

        res.status(200).json(result);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Error"});
    }

}

module.exports = myPostController;