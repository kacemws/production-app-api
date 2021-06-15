const mongoose = require("mongoose");

const productionSchema = new mongoose.Schema({
  product: {
    type: String,
    required: [true, "product is required"],
  },
  quantity: {
    type: Number,
    required: [true, "quantity is required"],
    default: 1,
  },
  state: {
    type: Number,
    default: "0",
  },
  start: {
    type: Date,
    default: Date.now(),
  },
  duration: {
    type: Number,
    required: [true, "duration is required"],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = productionSchema;
