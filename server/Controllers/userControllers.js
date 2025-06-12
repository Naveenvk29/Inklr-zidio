import asyncHandler from "../utils/asyncHandler.js";
import User from "../Models/userModel.js";
import { uploadUserAvatar, deleteUserAvatar } from "../utils/Cloudinary.js";

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
    return res.status(404).json({
      message: "User not found",
    });
  }

  if (req.file) {
    if (user.avatar?.public_id) {
      console.log("Deleting public_id:", user.avatar?.public_id);
      await deleteUserAvatar(user.avatar.public_id);
    }
    const avatarImg = await uploadUserAvatar(req.file);
    if (!avatarImg) {
      res.status(400);
      throw new Error("Failed to upload profile picture");
    }
    user.avatar = avatarImg;
  }
  const { userName, bio, email } = req.body;

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
  if (email) user.email = email;

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
    "userName fullName avatar"
  );
  if (!user) return res.status(404).json({ message: "User not found" });
  res.status(200).json({ followers: user.followers });
});

const getFollowing = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).populate(
    "following",
    "userName fullName avatar"
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
};
