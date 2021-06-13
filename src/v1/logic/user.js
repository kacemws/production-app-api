const mongoose = require("mongoose");
const userSchema = require("../models/userSchema");
const user = mongoose.model("user", userSchema, "users");

const bcrypt = require("bcryptjs");

async function createUser(data) {
  const { firstName, lastName, phone, state, email, role, password } = data;

  const salt = await bcrypt.genSalt(10);
  const psw = await bcrypt.hash(password, salt);

  return await new user({
    firstName,
    lastName,
    phone,
    state,
    email,
    role,
    password: psw,
    created: Date.now(),
  }).save();
}

async function findUser(email) {
  return await user.findOne({ email });
}

async function findUserById(id) {
  return await user.findOne({ _id: id });
}

async function matchingPasswords(psw, storedPsw) {
  return await bcrypt.compare(psw, storedPsw);
}

exports.create = createUser;
exports.find = findUser;
exports.findUserById = findUserById;
exports.matchingPasswords = matchingPasswords;
