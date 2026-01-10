const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { JWT_SECRET } = require("../utils/config");
const {
  BAD_REQUEST,
  NOT_FOUND,
  CONFLICT,
  UNAUTHORIZED,
  SERVER_ERROR,
} = require("../utils/errors");

// SIGN UP
const createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;

  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({ name, avatar, email, password: hash }))
    .then((user) => {
      const userObj = user.toObject();
      delete userObj.password; // hide password
      res.status(201).send(userObj);
    })
    .catch((err) => {
      console.error(err);

      if (err.code === 11000)
        return res.status(CONFLICT).send({ message: "Email already exists" });
      if (err.name === "ValidationError")
        return res.status(BAD_REQUEST).send({ message: err.message });

      res
        .status(SERVER_ERROR)
        .send({ message: "An error has occurred on the server" });
    });
};

// SIGN IN
const login = (req, res) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.send({ token });
    })
    .catch((err) => {
      console.error(err);
      res.status(UNAUTHORIZED).send({ message: "Invalid email or password" });
    });
};

// GET CURRENT USER
const getCurrentUser = (req, res) => {
  User.findById(req.user._id)
    .orFail(() => {
      const err = new Error("User not found");
      err.statusCode = NOT_FOUND;
      throw err;
    })
    .then((user) => res.send(user))
    .catch((err) => {
      console.error(err);
      const status = err.statusCode || SERVER_ERROR;
      res
        .status(status)
        .send({
          message: err.message || "An error has occurred on the server",
        });
    });
};

// UPDATE CURRENT USER
const updateUser = (req, res) => {
  const { name, avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, avatar },
    { new: true, runValidators: true }
  )
    .orFail(() => {
      const err = new Error("User not found");
      err.statusCode = NOT_FOUND;
      throw err;
    })
    .then((user) => res.send(user))
    .catch((err) => {
      console.error(err);

      if (err.name === "ValidationError")
        return res.status(BAD_REQUEST).send({ message: err.message });

      res
        .status(SERVER_ERROR)
        .send({ message: "An error has occurred on the server" });
    });
};

module.exports = { createUser, login, getCurrentUser, updateUser };
