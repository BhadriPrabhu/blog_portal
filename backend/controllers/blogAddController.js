const { default: mongoose } = require("mongoose");
const Blog = require("../models/blogSchema");

const blogAddController = async (req, res) => {
  try {
    const { title, desc, userId, email, tags, image } = req.body;

    // Validate required fields
    if (!title || !desc || !userId || !email) {
      return res.status(400).json({ message: "Title, description, userId, and email are required" });
    }
    if (!Array.isArray(tags) || !tags.every(tag => typeof tag === 'string')) {
      return res.status(400).json({ message: "Tags must be an array of strings" });
    }

    // Validate userId as ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid userId format" });
    }

    const newBlog = new Blog({
      user: new mongoose.Types.ObjectId(userId),
      title,
      desc,
      email,
      date: new Date(),
      tags,
      status: "active",
      image: image || "https://res.cloudinary.com/dw3ksypom/image/upload/v1773495536/undraw_images_v4j9_poeelm.png",
    });

    await newBlog.save();
    console.log("Blog added:", { title, email, tags, userId });
    res.status(201).json({ message: "Blog added successfully", blog: newBlog });
  } catch (err) {
    console.error("Add Blog Error:", {
      error: err.message,
      stack: err.stack,
      body: req.body,
      timestamp: new Date().toISOString(),
    });
    res.status(500).json({ message: "Error occurred", error: err.message });
  }
};

module.exports = blogAddController;