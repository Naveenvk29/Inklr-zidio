import asyncHandler from "../utils/asyncHandler.js";
import User from "../Models/userModel.js";
import { uploadUserAvatar, deleteUserAvatar } from "../utils/Cloudinary.js";
import crypto from "crypto";
import { sendEmail } from "../libs/sendEmail.js";
import admin from "../libs/firebaseAdmin.js";
import Notification from "../Models/Notification.js";
import { sendNotification } from "../utils/socket.js";

const registerUser = asyncHandler(async (req, res) => {
  const { fullName, email, password } = req.body;

  if (!fullName?.firstName || !fullName?.lastName || !email || !password) {
    return res.status(400).json({ message: "All fields are required." });
  }

  const existingEmail = await User.findOne({ email });
  if (existingEmail) {
    return res
      .status(400)
      .json({ message: "User already exists or Email already in use" });
  }

  const { firstName, lastName } = fullName;

  const user = new User({
    fullName: { firstName, lastName },
    email,
    password,
  });

  await user.save();

  const token = user.generateAuthToken(user._id);
  res.cookie("jwt", token, {
    maxAge: 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV !== "development",
  });

  res.status(201).json({
    message: "User registered successfully.",
    user: {
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      userName: user.userName,
      bio: user.bio,
      avatar: user.avatar,
      role: user.role,
    },
  });
});

const loginUser = asyncHandler(async (req, res) => {
  const { identifier, password, remeberMe } = req.body;

  const user = await User.findOne({
    $or: [{ email: identifier }, { userName: identifier }],
  }).select("+password");

  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  if (user.isBanned) {
    return res.status(403).json({ message: "Account is banned" });
  }

  const token = user.generateAuthToken(user._id);

  res.cookie("jwt", token, {
    maxAge: remeberMe ? 7 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV !== "development",
  });

  res.status(200).json({
    message: "User logged in successfully.",
    user: {
      id: user._id,
      userName: user.userName,
      fullName: user.fullName,
      email: user.email,
      bio: user.bio,
      avatar: user.avatar,
      role: user.role,
      createdAt: user.createdAt,
    },
  });
});

const logoutUser = asyncHandler(async (req, res) => {
  res.cookie("jwt", "", {
    maxAge: 0,
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV !== "development",
  });
  res.status(200).json({ message: "User logged out successfully." });
});

const completeUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) return res.status(404).json({ message: "User not found." });

  const { userName, bio } = req.body;

  if (userName) {
    const existingUserName = await User.findOne({ userName });
    if (
      existingUserName &&
      existingUserName._id.toString() !== user._id.toString()
    ) {
      return res.status(400).json({ message: "Username already taken." });
    }
    user.userName = userName;
  }

  if (bio) user.bio = bio;

  if (req.file) {
    const avatarImg = await uploadUserAvatar(req.file);
    if (user?.avatar?.public_id) {
      await deleteUserAvatar(user.avatar.public_id);
    }
    user.avatar = avatarImg;
  }

  await user.save();
  res.status(201).json({
    message: "Profile updated successfully.",
    user: {
      id: user._id,
      userName: user.userName,
      fullName: user.fullName,
      email: user.email,
      bio: user.bio,
      avatar: user.avatar,
      role: user.role,
      createdAt: user.createdAt,
    },
  });
});

const modityCurrentUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // 1. Avatar upload
  if (req.file) {
    if (user.avatar?.public_id) {
      await deleteUserAvatar(user.avatar.public_id);
    }
    const avatarImg = await uploadUserAvatar(req.file);
    if (!avatarImg) {
      return res
        .status(400)
        .json({ message: "Failed to upload profile picture" });
    }
    user.avatar = avatarImg;
  }

  // 2. Username check (only if present)
  if (req.body?.userName) {
    const existingUserName = await User.findOne({
      userName: req.body.userName,
    });
    if (
      existingUserName &&
      existingUserName._id.toString() !== user._id.toString()
    ) {
      return res.status(400).json({ message: "Username already taken." });
    }
    user.userName = req.body.userName;
  }

  // 3. Full name update (if both parts present)
  if (req.body?.fullName) {
    user.fullName = req.body.fullName;
  } else if (req.body?.firstName || req.body?.lastName) {
    user.fullName = {
      firstName: req.body.firstName || user.fullName.firstName,
      lastName: req.body.lastName || user.fullName.lastName,
    };
  }

  // 4. Optional fields
  if (req.body?.bio) user.bio = req.body.bio;
  if (req.body?.email) user.email = req.body.email;

  const updatedUser = await user.save();

  res.status(200).json({
    message: "User profile updated successfully.",
    user: {
      id: updatedUser._id,
      fullName: updatedUser.fullName,
      userName: updatedUser.userName,
      email: updatedUser.email,
      avatar: updatedUser.avatar,
      bio: updatedUser.bio,
      role: updatedUser.role,
    },
  });
});

const changeCurrentUserPassword = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select("+password");

  if (!user) {
    return res.status(404).json({ message: "User not found." });
  }

  user.password = req.body.password || user.password;

  const updatedUser = await user.save();
  res.status(200).json({
    message: "User profile updated successfully.",
    user: {
      id: updatedUser._id,
      fullName: updatedUser.fullName,
      userName: updatedUser.userName,
      email: updatedUser.email,
      avatar: updatedUser.avatar,
      bio: updatedUser.bio,
      role: updatedUser.role,
    },
  });
});

const deleteCurrentUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) {
    return res.status(404).json({ message: "User not found." });
  }
  if (user.profilePicture?.public_id) {
    await deleteProfilePicture(user.profilePicture?.public_id);
  }
  await user.deleteOne();
  res.status(200).json({ message: "User profile deleted successfully." });
});

const fetchCurrentUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) return res.status(404).json({ message: "User not found." });
  res.status(200).json(user);
});

const fetchAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find();
  res.status(200).json(users);
});

const fetchUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: "User not found." });
  res.status(200).json(user);
});

const getFollowers = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).populate(
    "followers",
    "userName fullName avatar email"
  );
  if (!user) return res.status(404).json({ message: "User not found" });
  res.status(200).json({ followers: user.followers });
});

const getFollowing = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).populate(
    "following",
    "userName fullName avatar email"
  );
  if (!user) return res.status(404).json({ message: "User not found" });
  res.status(200).json({ following: user.following });
});

const toggleFollowUser = asyncHandler(async (req, res) => {
  const userToToggle = await User.findById(req.params.id);
  const currentUser = await User.findById(req.user.id);

  if (!userToToggle) {
    return res.status(404).json({ message: "User not found" });
  }

  if (userToToggle._id.equals(currentUser._id)) {
    return res.status(400).json({ message: "You can't follow yourself" });
  }

  const isAlreadyFollowing = currentUser.following.includes(userToToggle._id);

  if (isAlreadyFollowing) {
    currentUser.following = currentUser.following.filter(
      (id) => !id.equals(userToToggle._id)
    );
    userToToggle.followers = userToToggle.followers.filter(
      (id) => !id.equals(currentUser._id)
    );
  } else {
    currentUser.following.push(userToToggle._id);
    userToToggle.followers.push(currentUser._id);

    // Save to DB
    await Notification.create({
      sender: currentUser._id,
      receiver: userToToggle._id,
      type: "follow",
    });

    sendNotification(userToToggle._id.toString(), {
      sender: currentUser._id,
      type: "follow",
    });
  }
  await currentUser.save();
  await userToToggle.save();

  res.status(200).json({
    message: isAlreadyFollowing
      ? `You unfollowed ${userToToggle.userName}`
      : `You are now following ${userToToggle.userName}`,
    isFollowing: !isAlreadyFollowing,
  });
});

const toggleSaveBlog = asyncHandler(async (req, res) => {
  const blogId = req.params.id;

  const user = await User.findById(req.user.id);

  if (!user) return res.status(404).json({ message: "User not found" });

  const savedBlog = user.savedBlogs.includes(blogId);

  if (savedBlog) {
    user.savedBlogs = user.savedBlogs.filter((id) => id.toString() !== blogId);
  } else {
    user.savedBlogs.push(blogId);
  }

  await user.save();
  res.status(200).json({
    message: savedBlog
      ? "Blog removed from saved list."
      : "Blog saved successfully.",
    isSaved: !savedBlog,
  });
});

const fetchSavedBlogs = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).populate({
    path: "savedBlogs",
    populate: {
      path: "author",
      select: "userName fullName avatar",
    },
  });
  if (!user) return res.status(404).json({ message: "User not found" });

  res.status(200).json({
    savedBlogs: user.savedBlogs,
  });
});

const fetchBlogSaveCount = asyncHandler(async (req, res) => {
  const blogId = req.params.id;

  const saveCount = await User.countDocuments({
    savedBlogs: blogId,
  });

  res.status(200).json({ blogId, saveCount });
});

const oAuthLogin = asyncHandler(async (req, res) => {
  const { firebaseIdToken } = req.body;

  if (!firebaseIdToken) {
    return res.status(400).json({ message: "Firebase ID token is missing" });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(firebaseIdToken);
    const { email, name, picture, uid } = decodedToken;

    if (!email) {
      return res.status(400).json({ message: "Email not found in token." });
    }

    let user = await User.findOne({ email });

    if (!user) {
      // Split full name from Firebase into first and last
      const nameParts = name?.split(" ") || [];
      const firstName = nameParts[0] || "User";
      const lastName = nameParts.slice(1).join(" ") || "Account";

      user = new User({
        fullName: {
          firstName,
          lastName,
        },
        email,
        password: crypto.randomBytes(20).toString("hex"), // dummy password
        avatar: picture ? { url: picture } : undefined,
      });

      await user.save();
    }

    // Generate token
    const token = user.generateAuthToken(user._id);

    res.cookie("jwt", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV !== "development",
    });

    res.status(200).json({
      message: "OAuth login successful",
      user: {
        id: user._id,
        userName: user.userName,
        fullName: user.fullName,
        email: user.email,
        avatar: user.avatar,
        bio: user.bio,
        role: user.role,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("🔥 Google OAuth Error:", error);
    res.status(500).json({
      message: "Google login failed",
      error: error.message,
    });
  }
});

const forgetPassword = asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  user.resetPasswordToken = crypto.randomBytes(32).toString("hex");
  user.resetPasswordExpires = Date.now() + 5 * 60 * 1000;
  await user.save();

  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${user.resetPasswordToken}`;

  const subject = "Reset Your Password";

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2>Hello ${user.userName || "there"},</h2>
      <p>We received a request to reset your password. Click the button below to choose a new one:</p>

      <a href="${resetUrl}" 
         style="display: inline-block; margin: 20px 0; padding: 12px 20px; background-color: #4f46e5; color: white; text-decoration: none; border-radius: 5px;">
         Reset Password
      </a>

      <p>If the button doesn't work, copy and paste this URL into your browser:</p>
      <p><a href="${resetUrl}" style="color: #4f46e5;">${resetUrl}</a></p>

      <p><strong>Note:</strong> This link will expire in 5 minutes for your security.</p>

      <p>If you didn’t request this, please ignore this email.</p>

      <p>Thanks,<br/>The ${process.env.APP_NAME || "Support"} Team</p>
    </div>
  `;

  const text = `
Hello ${user.userName || "there"},

We received a request to reset your password.

Reset it here: ${resetUrl}

This link will expire in 5 minutes.

If you did not request this, you can ignore this email.

Thanks,  
The ${process.env.APP_NAME || "Support"} Team
`;

  await sendEmail(user.email, subject, html, text);

  res.status(200).json({
    message: "Password reset link sent to your email",
  });
});

const resetPassword = asyncHandler(async (req, res) => {
  const { token, newPassword } = req.body;

  if (!token || !newPassword) {
    return res.status(400).json({
      message: "Token and new password are required",
    });
  }

  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(400).json({
      message: "Invalid or expired password reset token",
    });
  }

  user.password = newPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;

  await user.save();

  res.status(200).json({
    message: "Password has been reset successfully",
  });
});

const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch notifications" });
  }
};

export {
  registerUser,
  loginUser,
  logoutUser,
  completeUserProfile,
  modityCurrentUserProfile,
  deleteCurrentUserProfile,
  fetchAllUsers,
  fetchUserById,
  fetchCurrentUser,
  getFollowers,
  getFollowing,
  toggleFollowUser,
  changeCurrentUserPassword,
  toggleSaveBlog,
  fetchSavedBlogs,
  fetchBlogSaveCount,
  forgetPassword,
  resetPassword,
  oAuthLogin,
  getNotifications,
};
