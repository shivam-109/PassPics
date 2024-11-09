const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema({
  email: { type: String, required: true }, // Link to the user
  imageData: { type: String, required: true }, // Base64 string of the image
  createdAt: { type: Date, default: Date.now, expires: 432000 }, // 432000 seconds = 5 days
});

const Image = mongoose.model("Image", imageSchema);

module.exports = Image;
