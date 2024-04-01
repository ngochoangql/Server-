const mongoose = require("mongoose");

// Extend the existing deviceSchema for the Localization model
const localizationSchema = new mongoose.Schema({
  status: {
    type: String,
    required: true,
  },
  // You can add additional fields specific to the Localization model here
});

// Create the Localization model from the extended schema
const Localization = mongoose.model("Localization", localizationSchema);

module.exports = Localization;
