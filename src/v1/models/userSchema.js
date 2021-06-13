const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "first name is required"],
  },
  lastName: {
    type: String,
    required: [true, "last name is required"],
  },
  phone: {
    type: String,
  },
  state: {
    type: String,
  },
  email: {
    type: String,
    required: [true, "email is required"],
  },
  role: {
    type: String,
    required: [true, "role is required"],
  },
  password: {
    type: String,
    required: [true, "password is required"],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = userSchema;
