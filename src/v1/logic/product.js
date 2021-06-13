const mongoose = require("mongoose");
const productSchema = require("../models/productSchema");
const product = mongoose.model("productSchema", productSchema, "products");

async function createProduct(data) {
  const { code, designation, price, mesureUnit, disponibility } = data;

  return await new product({
    code,
    designation,
    price,
    mesureUnit,
    disponibility,
  }).save();
}

async function findProductById(id) {
  return await product.findOne({ _id: id });
}
async function updateProduct(id, data) {
  return await product.findByIdAndUpdate(id, data, {
    useFindAndModify: false,
  });
}

async function deleteProduct(id) {
  return await product.findByIdAndDelete(id);
}

async function getProducts() {
  return await product.find().exec();
}

exports.create = createProduct;
exports.get = getProducts;
exports.find = findProductById;
exports.update = updateProduct;
exports.delete = deleteProduct;
