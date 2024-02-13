import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";

const protect = asyncHandler(async (req, res, next) => {
  let token = req.cookies.jwt;
  if (token) {
    try {
      const decode = jwt.verify(token, process.env.SECRET_ACCESS_TOKEN);
      req.user = await User.findById(decode.userId).select("-hashPassword");
      next();
    } catch (error) {
      console.log(error);
      res.status(401);
      throw new Error("Not authorized, fail in token");
    }
  } else {
    res.status(401);
    throw new Error("Not authorized, no token");
  }
});

export { protect };
