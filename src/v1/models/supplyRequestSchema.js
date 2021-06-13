const mongoose = require("mongoose");

const supplyRequestSchema = new mongoose.Schema({
  quantity: {
    type: Number,
    required: [true, "quantity is required"],
  },
  rawMaterial: {
    type: String,
    required: [true, "rawMaterial is required"],
  },
  vendor: {
    type: String,
    required: [true, "vendor is required"],
  },
  price: {
    type: Number,
    required: [true, "price is required"],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = supplyRequestSchema;
