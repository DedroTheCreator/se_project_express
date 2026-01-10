const router = require("express").Router();
const usersRouter = require("./users");
const itemsRouter = require("./clothingitem");
const { login, createUser } = require("../controllers/users");
const auth = require("../middlewares/auth");

// public routes
router.post("/signin", login);
router.post("/signup", createUser);

// protect everything below
router.use(auth);
router.use("/users", usersRouter);
router.use("/items", itemsRouter);

module.exports = router;
