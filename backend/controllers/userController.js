import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import generateToken from "../utils/generateToken.js";

// #desc Auth user & get Token
// #route POST /api/users/auth
// #access public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  const matchPassword = await bcrypt.compare(password, user.hashPassword);
  if (user && matchPassword) {
    generateToken(res, user._id);
    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
    });
  } else {
    res.status(401);
    throw new Error("Invalid Email or PassWord");
  }
});

// #desc Register a new user
// #route POST /api/users/register
// #access public
const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  const isUserExist = await User.findOne({ email });
  if (isUserExist) {
    res.status(400);
    throw new Error("User already exists with this mail");
  }
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(password, salt);
  const user = await User.create({
    username,
    email,
    hashPassword,
  });
  if (user) {
    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

// #desc Logout user & clear cookies
// #route POST /api/users/logout
// #access public
const logoutUser = asyncHandler(async (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ msg: "Logged out successfully" });
});

// #desc Get user profile
// #route POST /api/users/profile
// #access Private
const getUserProfile = asyncHandler(async (req, res) => {
  if (req.user) {
    res.json({
      _id: req.user._id,
      username: req.user.username,
      email: req.user.email,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// #desc update user profile
// #route PUT /api/users/profile
// #access Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    user.username = req.body.username || user.username;
    user.email = req.body.email || user.email;
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      const newHashPassword = await bcrypt.hash(req.body.password, salt);
      user.hashPassword = newHashPassword;
    }

    const updatedUser = await user.save();
    res.json({
      _id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// #desc Get all users from the MoongooseDB
// #route GET /api/users/all
// #Private
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find();
  res.status(200).json({ users });
});

export {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  getAllUsers,
};
