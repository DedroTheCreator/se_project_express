const ClothingItem = require("../models/clothingitem");
const { BAD_REQUEST, NOT_FOUND, FORBIDDEN } = require("../utils/errors");

// CREATE ITEM
const createItem = (req, res, next) => {
  const { name, weather, imageUrl } = req.body;
  if (!name || !weather || !imageUrl) {
    return res.status(BAD_REQUEST).json({ message: "All fields are required" });
  }

  return ClothingItem.create({ name, weather, imageUrl, owner: req.user._id })
    .then((item) => res.status(201).json({ data: item }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(BAD_REQUEST).json({ message: err.message });
      }
      return next(err);
    });
};

// GET ALL ITEMS
const getItems = (req, res, next) =>
  ClothingItem.find({ owner: req.user._id })
    .then((items) => res.status(200).json({ data: items }))
    .catch(next);

// DELETE ITEM
const deleteItem = (req, res, next) => {
  const { itemId } = req.params;
  return ClothingItem.findById(itemId)
    .orFail(() => {
      const err = new Error("Item not found");
      err.statusCode = NOT_FOUND;
      throw err;
    })
    .then((item) => {
      if (!item.owner.equals(req.user._id)) {
        return res
          .status(FORBIDDEN)
          .json({ message: "You cannot delete items you don't own" });
      }
      return item
        .deleteOne()
        .then(() =>
          res.status(200).json({ message: "Item deleted successfully" }),
        );
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return res.status(BAD_REQUEST).json({ message: "Invalid item ID" });
      }
      return next(err);
    });
};

// LIKE ITEM
const likeItem = (req, res, next) =>
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((item) => {
      if (!item) {
        return res.status(NOT_FOUND).json({ message: "Item not found" });
      }
      return res.status(200).json({ data: item });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return res.status(BAD_REQUEST).json({ message: "Invalid item ID" });
      }
      return next(err);
    });

// UNLIKE ITEM
const unlikeItem = (req, res, next) =>
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((item) => {
      if (!item) {
        return res.status(NOT_FOUND).json({ message: "Item not found" });
      }
      return res.status(200).json({ data: item });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return res.status(BAD_REQUEST).json({ message: "Invalid item ID" });
      }
      return next(err);
    });

module.exports = {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  unlikeItem,
};
