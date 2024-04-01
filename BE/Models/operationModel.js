const mongoose = require("mongoose");

// Extend the existing deviceSchema for the Operation model
const operationSchema = new mongoose.Schema({
  addr: {
    type: String,
    required: true,
  },
  operation: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  // You can add additional fields specific to the Operation model here
});

// Create the Operation model from the extended schema
const Operation = mongoose.model("Operation", operationSchema);

module.exports = Operation;
