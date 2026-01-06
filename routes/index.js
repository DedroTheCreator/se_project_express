const router = require("express").Router();
const clothingItem = require("./clothingitem");

router.use("/items", clothingItem);

router.use((req, res) => {
  res.status(500).send({ message: "Router not found" });
});

module.exports = router;
