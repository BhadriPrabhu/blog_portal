const mongoose = require("mongoose");
const Blog = require("../models/blogSchema");

const respondToCollabRequest = async (req, res) => {
    const { blogId, status } = req.body;
    const userId = req.user.id;

    try {
        if (status === 'declined') {
            // Use the Model 'Blog', not 'blogSchema'
            await Blog.findByIdAndUpdate(blogId, {
                $pull: { collaborators: { user: userId } }
            });
            return res.status(200).json({ message: "Collaboration declined and removed" });
        }

        // Updating status using the positional operator $
        const blog = await Blog.findOneAndUpdate(
            {
                _id: new mongoose.Types.ObjectId(blogId),
                "collaborators.user": new mongoose.Types.ObjectId(userId)
            },
            {
                $set: {
                    "collaborators.$.status": status, // Use the status from req.body (accepted/declined)
                    "collaborators.$.respondedAt": new Date()
                }
            },
            { new: true }
        );

        if (!blog) {
            return res.status(404).json({ error: "Blog or invitation not found" });
        }

        res.status(200).json({ message: `Request accepted`, blog });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getCollaboratedBlogs = async (req, res) => {
    try {
        const { userId } = req.params;
        const requesterId = req.user ? req.user.id : null;

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ error: "Invalid User ID format" });
        }

        const targetObjectIdx = new mongoose.Types.ObjectId(userId);
        const isOwnProfile = requesterId && String(userId) === String(requesterId);

        // Define the status filter based on whether the requester is looking at their own profile
        const statusFilter = isOwnProfile ? { $in: ['pending', 'accepted'] } : 'accepted';

        const query = {
            collaborators: {
                $elemMatch: {
                    user: targetObjectIdx,
                    status: statusFilter
                }
            }
        };

        // CRITICAL: Ensure 'ref' in your Schema matches the string in .populate()
        // If your User model is 'User', change 'auth' to 'User' in the Schema.
        const collaboratedPosts = await Blog.find(query)
            .populate({
                path: 'user', // The owner of the blog
                select: 'username avatar user', // 'user' is the field name in your screenshot
                model: 'auth'
            })
            .populate({
                path: 'collaborators.user', // The collaborators
                select: 'username avatar user',
                model: 'auth' 
            })
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: collaboratedPosts,
        });
    } catch (err) {
        console.error("Collab Fetch Error:", err);
        res.status(500).json({ error: err.message });
    }
};


module.exports = { respondToCollabRequest, getCollaboratedBlogs };