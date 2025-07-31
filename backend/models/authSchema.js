const mongoose = require("mongoose");
// const blogSchema = require("./blogSchema");

const AuthSchema = new mongoose.Schema({
    user: String,
    email: String,
    password: {
        type: String,
        required: true,
        lowercase: true,
    },
    role: {
        type: String,
        default: "user",
    },
    createdAt: {
        type: Date,
        immutable: true,
        default: () => Date.now(),
    },
})


const AuthSchemaModel = mongoose.model("auth",AuthSchema);

module.exports = AuthSchemaModel;