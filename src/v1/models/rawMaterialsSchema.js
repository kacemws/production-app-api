const mongoose = require("mongoose");

const rawMaterialsSchema = new mongoose.Schema({
  designation: {
    type: String,
    required: [true, "designation is required"],
  },
  quantity: {
    type: Number,
    required: [true, "quantity is required"],
  },
  disponibility: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = rawMaterialsSchema;
