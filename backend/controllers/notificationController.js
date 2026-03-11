const Notification = require("../models/notificationSchema");
const Blog = require("../models/blogSchema");

const createNotification = async (data ,res) => {
  try {
    const newNotification = new Notification({
      recipient: data.recipientId,
      sender: data.senderId,
      type: data.type,
      blog: data.blogId,
      link: data.link,
      content: data.notifyContent,
    });

    const savednotification = await newNotification.save();
    return savednotification;
  } catch (err) {
    console.error("Notification Error:", err);
    throw new Error("Failed to create notification: " + err.message);
  }
}

const notificationAddController = async (req, res) => {
  try {
    const { type, recipientId, blogId, link, senderId, notifyContent } = req.body;


    const newNotification = new Notification({
      recipient: recipientId,
      sender: senderId,
      type,
      blog: blogId,
      link,
      content: notifyContent,
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

const DeleteNotification = async (req, res) => {
  try {
    const { id } = req.body;

    const result = await Notification.deleteOne({ _id: { $in: id } });
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'No Notification found' });
    }
    res.json({ message: 'Notification Removed' });

  } catch (err) {
    console.log("Error", err);
  }
}

module.exports = { notificationAddController, getNotifications, DeleteNotification, createNotification }