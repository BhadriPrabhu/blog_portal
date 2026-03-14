const AuthSchemaModel = require("../models/authSchema");
const Notification = require("../models/notificationSchema");

const getProfileData = async (req, res) => {
    try {
        const { username } = req.params;
        const loggedInUserId = req.user ? req.user.id : null;

        // Find user by username
        const user = await AuthSchemaModel.findOne({ username })
            .select("-password") // Never send the password
            .lean();

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Logic to determine if the logged-in user follows this profile
        // Assuming your User model has a 'followers' array of ObjectIds
        const isFollowing = loggedInUserId
            ? user.followers?.some(id => id.toString() === loggedInUserId.toString())
            : false;

        const result = {
            ...user,
            isFollowing,
            followersCount: user.followers?.length || 0,
            followingCount: user.following?.length || 0,
        };

        res.status(200).json(result);
    } catch (err) {
        console.error("Get Profile Error:", err);
        res.status(500).json({ error: "Server Error", details: err.message });
    }
};

const editProfileData = async (req, res) => {
    try {
        const updates = req.body;
        const userId = req.user ? req.user.id : null;

        // List of allowed fields to prevent malicious updates (like role or password)
        const allowedUpdates = ["user", "bio", "location", "website", "avatar", "coverImage"];
        const filteredUpdates = {};

        Object.keys(updates).forEach((key) => {
            if (allowedUpdates.includes(key)) {
                filteredUpdates[key] = updates[key];
            }
        });

        const updatedUser = await AuthSchemaModel.findByIdAndUpdate(
            userId,
            { $set: filteredUpdates },
            { new: true, runValidators: true }
        ).select("-password");

        if (!updatedUser) {
            return res.status(404).json({ error: "User not found" });
        }

        res.status(200).json({
            message: "Profile updated successfully",
            data: updatedUser
        });
    } catch (err) {
        console.error("Edit Profile Error:", err);
        res.status(500).json({ error: "Server Error", details: err.message });
    }
};


const toggleFollow = async (req, res) => {
    try {
        const { targetUserId } = req.params; // ID of person to follow
        const myId = req.user.id; // From middleware

        if (myId === targetUserId) {
            return res.status(400).json({ error: "You cannot follow yourself" });
        }

        const targetUser = await AuthSchemaModel.findById(targetUserId);
        const me = await AuthSchemaModel.findById(myId);

        const isFollowing = targetUser.followers.includes(myId);

        if (isFollowing) {
            // Unfollow
            targetUser.followers.pull(myId);
            me.following.pull(targetUserId);
            await Promise.all([targetUser.save(), me.save()]);

            res.status(200).json({ message: "Unfollowed successfully", isFollowing: false });
        } else {
            // Follow
            targetUser.followers.push(myId);
            me.following.push(targetUserId);

            // Create Notification
            await Notification.create({
                recipient: targetUserId,
                sender: myId,
                type: 'follow',
                content: `${me.username} started following you`,
                link: `/profile/${me.username}`
            });

            await Promise.all([targetUser.save(), me.save()]);

            res.status(200).json({ message: "Followed successfully", isFollowing: true });
        }
    } catch (err) {
        res.status(500).json({ error: "Server Error" });
    }
};

module.exports = { getProfileData, editProfileData, toggleFollow };