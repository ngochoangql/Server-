const mongoose = require("mongoose");

// Định nghĩa schema cho model User
const deviceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  addr: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  operation: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  
});

// Tạo model User từ schema
const Device = mongoose.model("Device", deviceSchema);

module.exports = Device;
