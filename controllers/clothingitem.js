const ClothingItem = require("../models/clothingitem");
const {
  BAD_REQUEST,
  NOT_FOUND,
  SERVER_ERROR,
  FORBIDDEN,
} = require("../utils/errors");

// CREATE ITEM
const createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;
  if (!name || !weather || !imageUrl)
    return res.status(BAD_REQUEST).json({ message: "All fields are required" });

  return ClothingItem.create({ name, weather, imageUrl, owner: req.user._id })
    .then((item) => res.status(201).json({ data: item }))
    .catch((err) => {
      if (err.name === "ValidationError")
        return res.status(BAD_REQUEST).json({ message: err.message });
      return res
        .status(SERVER_ERROR)
        .json({ message: "An error has occurred on the server" });
    });
};

// GET ALL ITEMS
const getItems = (req, res) =>
  ClothingItem.find({})
    .then((items) => res.status(200).json({ data: items }))
    .catch(() =>
      res
        .status(SERVER_ERROR)
        .json({ message: "An error has occurred on the server" })
    );

// UPDATE ITEM
const updateItem = (req, res) => {
  const { itemId } = req.params;
  const { imageUrl } = req.body;

  if (!imageUrl)
    return res.status(400).json({ message: "imageUrl is required" });

  return ClothingItem.findByIdAndUpdate(
    itemId,
    { imageUrl },
    { new: true, runValidators: true }
  )
    .then((item) => {
      if (!item) return res.status(404).json({ message: "Item not found" });
      return res.status(200).json({ data: item });
    })
    .catch((err) => {
      if (err.name === "CastError")
        return res.status(400).json({ message: "Invalid item ID" });
      return res.status(500).json({ message: "Server error" });
    });
};

// DELETE ITEM
const deleteItem = (req, res) => {
  const { itemId } = req.params;
  return ClothingItem.findById(itemId)
    .orFail(() => {
      const err = new Error("Item not found");
      err.statusCode = NOT_FOUND;
      throw err;
    })
    .then((item) => {
      if (!item.owner.equals(req.user._id))
        return res
          .status(FORBIDDEN)
          .json({ message: "You cannot delete items you don't own" });
      return item
        .deleteOne()
        .then(() =>
          res.status(200).json({ message: "Item deleted successfully" })
        );
    })
    .catch((err) => {
      if (err.name === "CastError")
        return res.status(BAD_REQUEST).json({ message: "Invalid item ID" });
      return res.status(err.statusCode || SERVER_ERROR).json({
        message: err.message || "An error has occurred on the server",
      });
    });
};

// LIKE ITEM
const likeItem = (req, res) =>
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .then((item) => {
      if (!item) {
        return res.status(404).json({ message: "Item not found" });
      }
      return res.status(200).json({ data: item });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return res.status(400).json({ message: "Invalid item ID" });
      }
      return res.status(500).json({ message: "Server error" });
    });

// UNLIKE ITEM
const unlikeItem = (req, res) =>
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .then((item) => {
      if (!item) {
        return res.status(404).json({ message: "Item not found" });
      }
      return res.status(200).json({ data: item });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return res.status(400).json({ message: "Invalid item ID" });
      }
      return res.status(500).json({ message: "Server error" });
    });

module.exports = {
  createItem,
  getItems,
  updateItem,
  deleteItem,
  unlikeItem,
  likeItem,
};
