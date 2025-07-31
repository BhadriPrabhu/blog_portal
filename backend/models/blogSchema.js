const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'auth' },
  email: { type: String, required: true },
  title: { type: String, required: true },
  desc: { type: String, required: true },
  date: { type: Date, default: Date.now },
  like: { type: Number, default: 0 },
  likedBy: [{ type: String }],
  savedBy: [{ type: String }],  
  tags: [{ type: String }],  
  comments: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'auth' },
      value: { type: String, required: true },
      liked: { type: Boolean, default: false },
      disliked: { type: Boolean, default: false },
      isReply: { type: Boolean, default: false },
      replyText: { type: String },
      status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
      reply: [
        {
          user: { type: mongoose.Schema.Types.ObjectId, ref: 'auth' },
          value: { type: String, required: true },
          liked: { type: Boolean, default: false },
          disliked: { type: Boolean, default: false },
        },
      ],
    },
  ],
  status: { type: String, enum: ['active', 'deleted', 'archived'], default: 'active' },
});

module.exports = mongoose.model('Blog', blogSchema);