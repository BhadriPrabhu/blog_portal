const AuthSchemaModel = require("../models/authSchema.js");

const registerController = async (req, res) => {
  try {
    const { user, email, password, username } = req.body;

    const newItem = new AuthSchemaModel({
      user,
      email,
      password,
      username
    });

    await newItem.save();
    const result = await AuthSchemaModel.findOne({ email });

    res.status(200).json(result);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

module.exports = registerController;
