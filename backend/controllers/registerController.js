const AuthSchemaModel = require("../models/authSchema.js");
const jwt = require('jsonwebtoken'); // Added missing import

const registerController = async (req, res) => {
  try {
    const { user, email, password, username } = req.body;

    // Check if user already exists
    const existingUser = await AuthSchemaModel.findOne({ email });
    if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
    }

    const newUser = new AuthSchemaModel({
      user, // This is the display name (e.g., Bhadri)
      email,
      password,
      username
    });

    const savedUser = await newUser.save();

    // Generate token using the newly saved user's data
    const token = jwt.sign(
      { id: savedUser._id, username: savedUser.username },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Send both user data and token so the frontend can log them in immediately
    res.status(201).json({ result: savedUser, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

module.exports = registerController;