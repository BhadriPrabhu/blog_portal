require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;
const mongoose = require('mongoose');
const authController = require("./controllers/authController.js");
const registerController = require('./controllers/registerController.js');
const blogController = require('./controllers/blogController.js');
const blogAddController = require('./controllers/blogAddController.js');
const likeController = require('./controllers/likeController.js');
const { addCommentBlog, addReplyComment } = require('./controllers/blogCommentController.js');
const saveController = require('./controllers/saveController.js');
const savedController = require('./controllers/savedController.js');
const likedBlogController = require('./controllers/likedBlogController.js');
const myPostController = require('./controllers/myPostController.js');
const { CommentDeleteController, CommentFlagController, CommentReplyController, CommentApproveController } = require('./controllers/adminController.js');
const { AdminBlogRestore, AdminBlogUnarchive, AdminBlogPermanentDelete, AdminBlogDelete, AdminBlogArchive } = require('./controllers/adminStatusController.js');

const corsOptions = {
  origin: 'https://my-app-frontend-g1f2.onrender.com',
  methods: ['GET', 'POST', 'PUT', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
};
app.use(cors(corsOptions));
app.use(express.json());

const URI = process.env.MONGO_URI || "mongodb+srv://bhadriprabhu:bhadri%402006@bhadri.osdxvju.mongodb.net/blog_portal?retryWrites=true&w=majority&appName=bhadri";

const connectDB = async () => {
  try {
    await mongoose.connect(URI);
    console.log("DB connected successfully");
  } catch (error) {
    console.log("MongoDB connection error:", error);
  }
};

app.post("/", authController);
app.post("/register", registerController);
app.put("/blog/like", likeController);
app.get("/blog", blogController);
app.post("/blog/add", blogAddController);
app.post("/blog/:id/comment", addCommentBlog);
app.post("/blog/:id/comment/:commentId/reply", addReplyComment);
app.post("/blog/save", saveController);
app.post("/blog/mypost", myPostController);
app.get("/blog/saved", savedController);
app.get("/blog/liked", likedBlogController);
app.post("/blog/comments/delete", CommentDeleteController);
app.post("/blog/comments/flag", CommentFlagController);
app.post("/blog/comments/reply", CommentReplyController);
app.post("/blog/comments/approve", CommentApproveController);
app.post("/blog/restore", AdminBlogRestore);
app.post("/blog/unarchive", AdminBlogUnarchive);
app.post("/blog/permanent-delete", AdminBlogPermanentDelete);
app.post("/blog/delete", AdminBlogDelete);
app.post("/blog/archive", AdminBlogArchive);

app.listen(PORT, () => {
  connectDB();
  console.log(`Server is running in the port ${PORT}`);
});