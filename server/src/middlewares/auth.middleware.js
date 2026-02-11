// middleware/auth.middleware.js
import jwt from "jsonwebtoken";
// import User from "../models/user.model.js";
import User from "../models/user.model.js"
import dotenv from "dotenv";
dotenv.config();


export const authMiddleware = async (req, res, next) => {
  try{
    const header = req.headers.authorization;
    if (!header || !header.startsWith("Bearer ")) return res.status(401).json({ message: "Unauthorized from header " });

    const token = header.split(" ")[1];

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    console.log("payload is",payload)
    const user = await User.findById(payload.userId).select("-passwordHash");
    console.log("user is ",user)
    if (!user) return res.status(401).json({ message: "Unauthorized from user" });

    req.user = user;
    console.log("req user is",req.user._id)
    next();
  }
  catch (err) {
    console.error(err);
    return res.status(401).json({ message: "Invalid token" });
  }
};


