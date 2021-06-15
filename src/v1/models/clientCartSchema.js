const mongoose = require("mongoose");

const clientCartSchema = new mongoose.Schema({
  product: {
    type: String,
    required: [true, "product is required"],
  },
  quantity: {
    type: Number,
    required: [true, "quantity is required"],
  },
  client: {
    type: String,
    required: [true, "designation is required"],
  },
  price: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    required: [true, "status is required"],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = clientCartSchema;
