const blogSchemaModel = require("../models/blogSchema");
const mongoose = require("mongoose");
const { notificationAddController, createNotification } = require("./notificationController");
const AuthSchemaModel = require("../models/authSchema");

const addCommentBlog = async (req, res) => {
    const { id } = req.params;
    const { userId, value, mention } = req.body;

    try {
        const blog = await blogSchemaModel.findById(id);
        if (!blog) return res.status(404).json({ message: "Blog not found" });

        const newCommentData = {
            user: new mongoose.Types.ObjectId(userId),
            value,
            mention,
        };

        const commentSubdoc = blog.comments.create(newCommentData);
        blog.comments.push(commentSubdoc);
        await blog.save();

        const populatedComment = await blog.populate({
            path: 'comments.user',
            match: { _id: commentSubdoc._id }
        });

        const finalComment = blog.comments.id(commentSubdoc._id);

        const notifications = [];

        if (mention && mention.length > 0) {
            const mentionedUsers = await AuthSchemaModel.find({
                username: { $in: mention }
            }).select('_id');

            mentionedUsers.forEach(user => {
                notifications.push(createNotification({
                    type: "comment", // Use "comment" or "mention" depending on your Schema Enum
                    senderId: userId,
                    recipientId: user._id, // This is now a valid ObjectId
                    blogId: id,
                    link: `/blog/${id}`,
                    notifyContent: "You were mentioned in a comment."
                }));
            });
        }

        if (blog.user.toString() !== userId) {
            notifications.push(createNotification({
                type: "comment",
                senderId: userId,
                recipientId: blog.user,
                blogId: id,
                link: `/blog/${id}`,
                notifyContent: "Someone commented on your post."
            }));
        }

        await Promise.all(notifications);

        res.status(201).json({
            message: "Comment added",
            newComment: finalComment
        });

    } catch (err) {
        console.error("Comment Error:", err);
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
