require('dotenv').config;
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;
const mongoose = require('mongoose');
const authController = require("./controllers/authController.js")
// const AuthSchemaModel = require("./models/authSchema.js");
const registerController = require('./controllers/registerController.js');
const blogSchemaModel = require('./models/blogSchema.js');
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
// const sortByController = require('./controllers/sortByController.js');



app.use(cors());
app.use(express.json());

const URI = process.env.MONGO_URI || "mongodb+srv://bhadriprabhu:bhadri%402006@bhadri.osdxvju.mongodb.net/blog_portal?retryWrites=true&w=majority&appName=bhadri";


const connectDB = async () => {
    try {
        await mongoose.connect(URI);
        console.log("DB connected successfully")
    } catch (error) {
        console.log(error)
    }
}

// async function run() {
//     try{
//         const user = await AuthSchemaModel.create({
//             user: "Bhadri",
//             email: "bhadri@gmail.com",
//             password: "1234",
//             // role: "admin",
//         })
//         console.log(user);

//         // user.save();
//     }catch(err){
//         console.log(err);
//     }
// }

// run();

async function run() {
    try {
        const blog = await blogSchemaModel({
            user: new mongoose.Types.ObjectId("6883bf95edac67b4473ff771"),
            email: "prabhu@gmail.com",
            title: "Deep Learning with Transformers",
            desc: "This article delves into how transformers have changed NLP and other domains, covering self-attention, positional encoding, and BERT-like architectures.",
            like: 245,
            liked: false,
            saved: false,
            comments: [
                {
                    user: new mongoose.Types.ObjectId("688612d955e7e177f1c0da42"),
                    value: "Machine learning is the future.",
                    reply: [
                        {
                            user: new mongoose.Types.ObjectId("688612bc55e7e177f1c0da38"),
                            value: "Yes, definitely!",
                        },
                        {
                            user: new mongoose.Types.ObjectId("688612d955e7e177f1c0da42"),
                            value: "Absolutely agree with you.",
                        },
                    ],
                },
            ],
        });

        await blog.save();


        console.log("Blog saved:", blog);
    } catch (err) {
        console.error("Error saving blog:", err);
    }
}

// run();



app.post("/", authController);
app.post("/register", registerController);
app.put("/blog/like", likeController);
app.get("/blog", blogController);
// app.get("/blog?sortBy=saved", sortByController);
app.post("/blog/add", blogAddController);
app.post("/blog/:id/comment", addCommentBlog);
app.post("/blog/:id/comment/:commentId/reply", addReplyComment);
app.post("/blog/save", saveController);
app.post("/blog/mypost",myPostController);
app.get("/blog/saved",savedController);
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
    // studentInfo();
    console.log(`Server is running in the port ${PORT}`)
});