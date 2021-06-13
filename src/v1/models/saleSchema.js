const mongoose = require("mongoose");

const saleSchema = new mongoose.Schema({
  cart: {
    type: String,
    required: [true, "cart is required"],
  },
  confirmed: {
    type: Boolean,
    default: false,
  },
  saleDate: {
    type: String,
    required: [true, "code is required"],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = saleSchema;
