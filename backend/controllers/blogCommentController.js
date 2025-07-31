const blogSchemaModel = require("../models/blogSchema");
const mongoose = require("mongoose");

const addCommentBlog = async (req, res) => {
    const { id } = req.params;
    const { userId, value } = req.body;

    try {
        const blog = await blogSchemaModel.findById(id);
        if (!blog) return res.status(404).json({ message: "Blog not found" });

        const newComment = {
            user: new mongoose.Types.ObjectId(userId),
            value,
        };

        console.log(newComment);
        blog.comments.push(newComment);
        await blog.save();

        const addedComment = blog.comments[blog.comments.length - 1];
        const populatedBlog = await blogSchemaModel
            .findById(id)
            .populate("comments.user");

        const updatedComment = populatedBlog.comments.id(addedComment._id);

        res.status(201).json({ message: "Comment added", newComment: updatedComment });
    } catch (err) {
        res.status(500).json({ message: "Error adding comment", error: err.message });
    }
};


const addReplyComment = async (req, res) => {
    const { id, commentId } = req.params;
    const { userId, value } = req.body;

    try {
        const blog = await blogSchemaModel.findById(id);
        if (!blog) return res.status(404).json({ message: "Blog not found" });

        const comment = blog.comments.id(commentId);
        if (!comment) return res.status(404).json({ message: "Comment not found" });

        const newReply = {
            user: new mongoose.Types.ObjectId(userId),
            value,
        };

        comment.reply.push(newReply);
        await blog.save();

        const updatedBlog = await blogSchemaModel
            .findById(id)
            .populate({
                path: "comments.user"
            })
            .populate({
                path: "comments.reply.user"
            });

        const updatedComment = updatedBlog.comments.id(commentId);
        const addedReply = updatedComment.reply[updatedComment.reply.length - 1];

        res.status(201).json({ message: "Reply added", newReply: addedReply });
    } catch (err) {
        console.error("Reply Error:", err);
        res.status(500).json({ message: "Error adding reply", error: err.message });
    }
};


module.exports = { addCommentBlog, addReplyComment };
