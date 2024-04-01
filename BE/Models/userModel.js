const mongoose = require("mongoose");

// Định nghĩa schema cho model User
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    default: function() {
        return this.username; // Giá trị mặc định là giá trị của trường username
    }
  },
});

// Tạo model User từ schema
const User = mongoose.model("User", userSchema);

module.exports = User;
