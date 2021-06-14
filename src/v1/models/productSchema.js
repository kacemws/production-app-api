const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  code: {
    type: String,
    required: [true, "code is required"],
  },
  designation: {
    type: String,
    required: [true, "designation is required"],
  },
  price: {
    type: Number,
    default: 0,
  },
  mesureUnit: {
    type: String,
    required: [true, "mesure unit is required"],
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

module.exports = productSchema;
