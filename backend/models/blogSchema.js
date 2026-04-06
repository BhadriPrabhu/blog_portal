const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'auth' },
  email: { type: String, required: true },
  title: { type: String, required: true },
  desc: { type: String, required: true },


  date: { type: Date, default: Date.now },
  updatedAt: { type: Date },


  viewCount: { type: Number, default: 0 },
  like: { type: Number, default: 0 },
  likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'auth' }],
  savedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'auth' }],


  tags: [{ type: String }],
  isFeatured: { type: Boolean, default: false },

  image: { type: String, default: "" },

  viewCount: { type: Number, default: 0 },
  shareCount: { type: Number, default: 0 },

  comments: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'auth' },
      value: { type: String, required: true },
      liked: { type: Boolean, default: false },
      disliked: { type: Boolean, default: false },
      isReply: { type: Boolean, default: false },
      replyText: { type: String },
      mention: [{ type: String }],
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


  status: { type: String, enum: ['active', 'deleted', 'archived','flag','report'], default: 'active' },
  statusReason: { type: String },

}, { timestamps: true });

module.exports = mongoose.model('Blog', blogSchema);