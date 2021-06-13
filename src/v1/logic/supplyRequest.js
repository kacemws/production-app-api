const mongoose = require("mongoose");
const supplyRequestSchema = require("../models/supplyRequestSchema");
const supplyRequest = mongoose.model(
  "supplyRequest",
  supplyRequestSchema,
  "supplyRequests"
);

async function createRequest(data) {
  const { quantity, rawMaterial, vendor, price } = data;

  return await new supplyRequest({
    quantity,
    rawMaterial,
    vendor,
    price,
    created: Date.now(),
  }).save();
}

async function findRequestById(id) {
  return await supplyRequest.findOne({ _id: id });
}
async function updateRequest(id, data) {
  return await supplyRequest.findByIdAndUpdate(id, data, {
    useFindAndModify: false,
  });
}

async function deleteRequest(id) {
  return await supplyRequest.findByIdAndDelete(id);
}

async function getRequests() {
  return await supplyRequest.find().sort({ createdAt: -1 }).exec();
}

exports.create = createRequest;
exports.get = getRequests;
exports.find = findRequestById;
exports.update = updateRequest;
exports.delete = deleteRequest;
