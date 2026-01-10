const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { JWT_SECRET } = require("../utils/config");

// SIGN UP
const createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;
  if (!name || !avatar || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  return bcrypt
    .hash(password, 10)
    .then((hash) => User.create({ name, avatar, email, password: hash }))
    .then((user) => {
      const userObj = user.toObject();
      delete userObj.password;
      return res.status(201).json({ data: userObj });
    })
    .catch((err) => {
      if (err.code === 11000)
        return res.status(409).json({ message: "Email already exists" });
      if (err.name === "ValidationError")
        return res.status(400).json({ message: err.message });
      return res.status(404).json({ message: "User not found" });
    });
};

// SIGN IN
const login = (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: "Email and password required" });

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      return res.status(200).json({ token });
    })
    .catch(() =>
      res.status(401).json({ message: "Invalid email or password" })
    );
};

// GET CURRENT USER
const getCurrentUser = (req, res) =>
  User.findById(req.user._id)
    .then((user) => {
      if (!user) return res.status(404).json({ message: "User not found" });
      return res.status(200).json({ data: user });
    })
    .catch(() => res.status(404).json({ message: "User not found" }));

// UPDATE CURRENT USER
const updateUser = (req, res) => {
  const { name, avatar } = req.body;
  if (!name && !avatar)
    return res.status(400).json({ message: "At least one field required" });

  return User.findByIdAndUpdate(
    req.user._id,
    { name, avatar },
    { new: true, runValidators: true }
  )
    .then((user) => {
      if (!user) return res.status(404).json({ message: "User not found" });
      return res.status(200).json({ data: user });
    })
    .catch(() => res.status(404).json({ message: "User not found" }));
};

module.exports = { createUser, login, getCurrentUser, updateUser };
