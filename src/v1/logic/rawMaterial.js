const mongoose = require("mongoose");
const rawMaterialsSchema = require("../models/rawMaterialsSchema");
const rawMaterial = mongoose.model(
  "rawMaterialsSchema",
  rawMaterialsSchema,
  "materials"
);

async function createMaterial(data) {
  const { designation, quantity, disponibility } = data;

  return await new rawMaterial({
    designation,
    quantity,
    disponibility,
    created: Date.now(),
  }).save();
}

async function findMaterialById(id) {
  return await rawMaterial.findOne({ _id: id });
}
async function updateMaterial(id, data) {
  return await rawMaterial.findByIdAndUpdate(id, data, {
    useFindAndModify: false,
  });
}

async function deleteMaterial(id) {
  return await rawMaterial.findByIdAndDelete(id);
}

async function getMaterials() {
  return await rawMaterial.find().sort({ createdAt: -1 }).exec();
}

exports.create = createMaterial;
exports.get = getMaterials;
exports.find = findMaterialById;
exports.update = updateMaterial;
exports.delete = deleteMaterial;
