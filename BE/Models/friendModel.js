const mongoose = require("mongoose");

// Định nghĩa schema cho model User
const friendSchema = new mongoose.Schema({
  user_uuid: {
    type: String,
    required: true,
  },
  friend_uuid: {
    type: String,
    required: true,
  },
  status:{
    type:String,
    default: "Confirming"
  }
  
});

// Tạo model User từ schema
const Friend = mongoose.model("Friend", friendSchema);

module.exports = Friend;
