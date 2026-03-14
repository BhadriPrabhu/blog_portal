const AuthSchemaModel = require("../models/authSchema.js");
const jwt = require('jsonwebtoken');

const authController = async (req, res) => {
    try {
        const { email, password } = req.body;
        // Find user by email
        const user = await AuthSchemaModel.findOne({ email });

        if (user) {
            // Note: In production, use bcrypt to compare hashed passwords!
            if (user.password === password) {
                // Use 'user' variable which contains the DB result
                const token = jwt.sign(
                    { id: user._id, username: user.username },
                    process.env.JWT_SECRET,
                    { expiresIn: "7d" }
                );
                
                // Remove password from the response for security
                const { password: _, ...userData } = user._doc;
                
                res.status(200).json({ result: userData, token });
            } else {
                res.status(401).json({ message: "Invalid Credentials" });
            }
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server Error" });
    }
};

module.exports = authController;