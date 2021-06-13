const mongoose = require("mongoose");
const productionSchema = require("../models/productionSchema");
const production = mongoose.model(
  "productionSchema",
  productionSchema,
  "productions"
);

async function createProduction(data) {
  const { product, state, start, duration } = data;

  return await new production({
    product,
    state,
    start,
    duration,
    created: Date.now(),
  }).save();
}

async function findProductionById(id) {
  return await production.findOne({ _id: id });
}
async function updateProduction(id, data) {
  return await production.findByIdAndUpdate(id, data, {
    useFindAndModify: false,
  });
}

async function deleteProduction(id) {
  return await production.findByIdAndDelete(id);
}

async function getProductions() {
  return await production.find().sort({ createdAt: -1 }).exec();
}

exports.create = createProduction;
exports.get = getProductions;
exports.find = findProductionById;
exports.update = updateProduction;
exports.delete = deleteProduction;
