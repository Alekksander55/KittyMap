import jwt from "jsonwebtoken";

const generateToken = (res, userId) => {
    console.log(`Token generated for this user ${userId}`)
  const token = jwt.sign({ userId }, process.env.SECRET_ACCESS_TOKEN, {
    expiresIn: "1h",
  });

  res.cookie("jwt", token, {
    httpOnly: true,
    sameSite: "strict",
    maxAge: 3600 * 1000,
  });
};

export default generateToken;
