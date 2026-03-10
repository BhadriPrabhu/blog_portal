const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  // 1. THE TARGET: Who is receiving this notification?
  recipient: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true,
    index: true // Important for fast "unread" queries
  },

  // 2. THE ACTOR: Who performed the action?
  sender: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },

  // 3. THE ACTION: What happened?
  type: { 
    type: String, 
    enum: ['like', 'comment', 'follow', 'new_post'], 
    required: true 
  },

  // 4. THE CONTEXT: Which blog does this refer to? (Optional for follows)
  blog: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Blog' 
  },

  // 5. THE CONTENT: Useful for showing a snippet of a comment
  content: { 
    type: String, 
    trim: true 
  },

  // 6. THE STATUS: Has the user seen it yet?
  isRead: { 
    type: Boolean, 
    default: false 
  },

  isAccept: {
    type: Boolean,
    default: false,
  },

  // 7. THE TIMESTAMP: When did it happen?
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
}, { timestamps: true });

module.exports = mongoose.model("Notification", notificationSchema);