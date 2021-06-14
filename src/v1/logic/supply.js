const mongoose = require("mongoose");
const supplySchema = require("../models/supplySchema");
const supplies = mongoose.model("supplySchema", supplySchema, "supplies");

async function createSupply(data) {
  const { request } = data;

  return await new supplies({
    request,
    created: Date.now(),
  }).save();
}

async function findsSupplyById(id) {
  return await supplies.findOne({ _id: id });
}
async function updateSupply(id, data) {
  return await supplies.findByIdAndUpdate(id, data, {
    useFindAndModify: false,
  });
}

async function deleteSupply(id) {
  return await supplies.findByIdAndDelete(id);
}

async function getSupplies() {
  return await supplies.find().sort({ createdAt: -1 }).exec();
}

exports.create = createSupply;
exports.get = getSupplies;
exports.find = findsSupplyById;
exports.update = updateSupply;
exports.delete = deleteSupply;
