const mongoose = require("mongoose");

const supplySchema = new mongoose.Schema({
  request: {
    type: String,
    required: [true, "request is required"],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = supplySchema;
