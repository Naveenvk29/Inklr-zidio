import User from "../Models/userModel.js";
import asyncHandler from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";

const authenticate = asyncHandler(async (req, res, next) => {
  let token;
  token = req.cookies.jwt;
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id);

      next();
    } catch (error) {
      res.status(401);
      throw new Error("Not authorized, token failed.");
    }
  } else {
    return res.status(401).json({
      message: "No token, authorization denied",
    });
  }
});

const authorizedAsAdmin = (req, res, next) => {
  if (req.user && req.user.role == "admin") {
    next();
  } else {
    res.status(401).send("Not authorized as an admin.");
  }
};

export { authenticate, authorizedAsAdmin };
