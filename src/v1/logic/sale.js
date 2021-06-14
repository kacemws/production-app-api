const mongoose = require("mongoose");
const saleSchema = require("../models/saleSchema");
const sales = mongoose.model("saleSchema", saleSchema, "sales");

async function createSale(data) {
  const { cart, confirmed, saleDate } = data;

  return await new sales({
    cart,
    confirmed,
    saleDate,
    created: Date.now(),
  }).save();
}

async function findSaleById(id) {
  return await sales.findOne({ _id: id });
}
async function updateSale(id, data) {
  return await sales.findByIdAndUpdate(id, data, {
    useFindAndModify: false,
  });
}

async function deleteSale(id) {
  return await sales.findByIdAndDelete(id);
}

async function getSales() {
  return await sales.find().sort({ createdAt: -1 }).exec();
}

exports.create = createSale;
exports.get = getSales;
exports.find = findSaleById;
exports.update = updateSale;
exports.delete = deleteSale;
