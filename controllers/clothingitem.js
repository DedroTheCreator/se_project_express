const ClothingItem = require("../models/clothingitem");
const {
  BAD_REQUEST,
  NOT_FOUND,
  SERVER_ERROR,
  FORBIDDEN,
} = require("../utils/errors");

// CREATE ITEM
const createItem = (req, res) => {
  const { name, weather, imageURL } = req.body;

  ClothingItem.create({ name, weather, imageURL, owner: req.user._id })
    .then((item) => res.status(201).send({ data: item }))
    .catch((err) => {
      console.error(err);

      if (err.name === "ValidationError")
        return res.status(BAD_REQUEST).send({ message: err.message });

      res
        .status(SERVER_ERROR)
        .send({ message: "An error has occurred on the server" });
    });
};

// GET ALL ITEMS
const getItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => res.send({ data: items }))
    .catch((err) => {
      console.error(err);
      res
        .status(SERVER_ERROR)
        .send({ message: "An error has occurred on the server" });
    });
};

// UPDATE ITEM
const updateItem = (req, res) => {
  const { itemId } = req.params;
  const { imageURL } = req.body;

  ClothingItem.findByIdAndUpdate(
    itemId,
    { imageURL },
    { new: true, runValidators: true }
  )
    .orFail(() => {
      const err = new Error("Item not found");
      err.statusCode = NOT_FOUND;
      throw err;
    })
    .then((item) => res.send({ data: item }))
    .catch((err) => {
      console.error(err);

      if (err.name === "ValidationError")
        return res.status(BAD_REQUEST).send({ message: err.message });
      if (err.name === "CastError")
        return res.status(BAD_REQUEST).send({ message: "Invalid item ID" });

      res
        .status(err.statusCode || SERVER_ERROR)
        .send({
          message: err.message || "An error has occurred on the server",
        });
    });
};

// DELETE ITEM
const deleteItem = (req, res) => {
  const { itemId } = req.params;

  ClothingItem.findById(itemId)
    .orFail(() => {
      const err = new Error("Item not found");
      err.statusCode = NOT_FOUND;
      throw err;
    })
    .then((item) => {
      // Only owner can delete
      if (!item.owner.equals(req.user._id)) {
        return res
          .status(FORBIDDEN)
          .send({ message: "You cannot delete items you don't own" });
      }
      return item.deleteOne().then(() => res.status(204).send({}));
    })
    .catch((err) => {
      console.error(err);

      if (err.name === "CastError")
        return res.status(BAD_REQUEST).send({ message: "Invalid item ID" });

      res
        .status(err.statusCode || SERVER_ERROR)
        .send({
          message: err.message || "An error has occurred on the server",
        });
    });
};

module.exports = { createItem, getItems, updateItem, deleteItem };
