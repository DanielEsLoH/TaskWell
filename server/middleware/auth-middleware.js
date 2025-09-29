import jwt, { decode } from "jsonwebtoken";
import User from "../models/user.js";

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1]; // Bearer <token>
    if (!token) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }
    req.user = user;
    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({
      message: "Internal server error",
    });
  }
};

export default authMiddleware;
