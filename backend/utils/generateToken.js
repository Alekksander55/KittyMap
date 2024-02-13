import jwt from "jsonwebtoken";
import cookie from "cookie";

const generateToken = (res, userId) => {
  console.log(`Token generated for this user ${userId}`);
  const token = jwt.sign({ userId }, process.env.SECRET_ACCESS_TOKEN, {
    expiresIn: "1h",
  });

  res.cookie("jwt", token, {
    secure: true,
    httpOnly: true,
    sameSite: "none",
    domain: "https://kittymap-fe.onrender.com/",
    maxAge: 3600 * 1000,
  });

  // // Set a cookie with the secure and HttpOnly flags
  // const secureCookie = true;
  // const httpOnlyCookie = true;
  // const cookieOptions = {
  //   secure: secureCookie,
  //   httpOnly: httpOnlyCookie,
  //   maxAge: 3600 * 1000,
  // };

  // const cookieString = cookie.serialize('jwtToken', token, cookieOptions);

  // // Set the cookie in the response header
  // res.setHeader('Set-Cookie', cookieString);
};

export default generateToken;
