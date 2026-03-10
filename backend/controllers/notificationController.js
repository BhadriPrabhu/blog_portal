const Notification = require("../models/notificationSchema");
const Blog = require("../models/blogSchema");

const notificationAddController = async (req, res) => {
  try {
    const { type, recipientId, blogId, link, senderId } = req.body;
    // const senderId = req.user._id; // Assuming you have auth middleware

    // 1. Create the notification document
    const newNotification = new Notification({
      recipient: recipientId,
      sender: senderId,
      type,
      blog: blogId,
      link
    });

    await newNotification.save();


    res.status(201).json({ 
      success: true, 
      data: newNotification 
    });
  } catch (err) {
    console.error("Notification Error:", err);
    res.status(500).json({ message: "Error occurred", error: err.message });
  }
};

const getNotifications = async (req, res) => {
  try {
    const userId = req.params.userId; // Or req.user._id from auth

    const notifications = await Notification.find({ recipient: userId })
      // .populate("sender", "username profilePic") // Get sender details automatically
      // .populate("blog", "title")               // Get blog title automatically
      .sort({ createdAt: -1 })                 // Newest first
      .limit(20);                              // Don't overload the frontend

    res.status(200).json({ success: true, data: notifications });
  } catch (err) {
    res.status(500).json({ message: "Error fetching notifications" });
  }
};

module.exports = { notificationAddController, getNotifications }