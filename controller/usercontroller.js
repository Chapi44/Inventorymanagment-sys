const User = require("../model/user");
const CustomError = require("../errors");
const { StatusCodes } = require("http-status-codes");
const { createTokenUser, attachCookiesToResponse } = require("../utils");

require("dotenv").config();

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

const getUserById = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

const deleteuser = async (req, res) => {
  try {
    const { id } = req.params;
    const finduser = await User.findByIdAndDelete({ _id: id });
    if (!finduser) {
      return res.status(400).json({ error: "no such user found" });
    }
    return res.status(200).json({ message: "deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "something went wrong" });
  }
};

const updateUser = async (req, res) => {
  const { fullname, email } = req.body;
  console.log(req.body);
  console.log("Request Body:", req.body);
  console.log("Email:", email);
  console.log("Fullname:", fullname);

  try {
    // Get the user by userId
    const user = await User.findOne({ _id: req.user.userId });

    // Check if at least one property is provided in the request body
    if (!(email || fullname )) {
      return res
        .status(400)
        .json({ error: "Please provide at least one value to update" });
    }

    // Update user properties if provided in the request body
    if (email) user.email = email;
    if (fullname) user.fullname = fullname;


    // Save the updated user
    await user.save();

    // Create a new tokenUser with the updated user information
    const tokenUser = createTokenUser(user);

    // Attach cookies to the response
    attachCookiesToResponse({ res, user: tokenUser });

    // Respond with the updated user information
    return res.status(200).json({ user: tokenUser });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const updateUserPassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword) {
    throw new CustomError.BadRequestError("Please provide both values");
  }
  try {
    const user = await User.findOne({ _id: req.user.userId });

    const isPasswordCorrect = await user.comparePassword(oldPassword);
    if (!isPasswordCorrect) {
      throw new CustomError.UnauthenticatedError("Invalid Credentials");
    }
    user.password = newPassword;

    await user.save();
    res.status(200).json({ msg: "Success! Password Updated." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  deleteuser,
  updateUser,
  updateUserPassword,
};
