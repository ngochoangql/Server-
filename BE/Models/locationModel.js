const mongoose = require("mongoose");

// Định nghĩa schema cho model User
const locationSchema = new mongoose.Schema({
  time: {
    type: String,
    required: true,
  },
  x:{
    type: String,
    required: true,
  },
  y:{
    type: String,
    required: true,
  },
  z:{
    type: String,
    required: true,
  }
});

// Tạo model User từ schema
const Location = mongoose.model("Location", locationSchema);

module.exports = Location;
