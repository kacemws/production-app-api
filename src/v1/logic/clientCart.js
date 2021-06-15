const mongoose = require("mongoose");
const clientCartSchema = require("../models/clientCartSchema");
const clientCart = mongoose.model(
  "clientCartSchema",
  clientCartSchema,
  "clientCarts"
);

async function createCart(data) {
  const { product, quantity, client, price } = data;

  return await new clientCart({
    product,
    quantity,
    client,
    price,
    status: "open",
    created: Date.now(),
  }).save();
}

async function findCartById(id) {
  return await clientCart.findOne({ _id: id });
}
async function updateCart(id, data) {
  return await clientCart.findByIdAndUpdate(id, data, {
    useFindAndModify: false,
  });
}

async function deleteCart(id) {
  return await clientCart.findByIdAndDelete(id);
}

async function getCarts() {
  return await clientCart.find().sort({ createdAt: -1 }).exec();
}

exports.create = createCart;
exports.get = getCarts;
exports.find = findCartById;
exports.update = updateCart;
exports.delete = deleteCart;
