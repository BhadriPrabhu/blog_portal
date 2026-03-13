const mongoose = require("mongoose");

const AuthSchema = new mongoose.Schema({
    // --- AUTHENTICATION CORE ---
    user: { type: String, required: true, trim: true }, // Full Name
    username: { type: String, unique: true, required: true, lowercase: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["user", "admin", "moderator"], default: "user" },

    // --- PROFILE INFO ---
    avatar: {
        type: String,
        default: ""
    },
    bio: { type: String, maxlength: 250 },
    location: { type: String },
    website: { type: String },
    socials: {
        twitter: String,
        github: String,
        linkedin: String
    },

    // --- ACCOUNT STATUS ---
    isVerified: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true }, // For deactivating accounts
    lastLogin: Date,

    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "auth" }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: "auth" }],

    coverImage: { type: String, default: "" },

    // --- SECURITY ---
    resetPasswordToken: String,
    resetPasswordExpires: Date,

}, {
    timestamps: true
});

const AuthSchemaModel = mongoose.model("auth", AuthSchema);
module.exports = AuthSchemaModel;