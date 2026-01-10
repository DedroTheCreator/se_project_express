const express = require("express");

const router = express.Router();
const usersRouter = require("./users");
const itemsRouter = require("./clothingitem");
const { login, createUser } = require("../controllers/users");
const auth = require("../middlewares/auth");

// Public
router.post("/signin", login);
router.post("/signup", createUser);

// Protected
router.use(auth);
router.use("/users", usersRouter);
router.use("/items", itemsRouter);

module.exports = router;
