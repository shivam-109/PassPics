const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const cors = require("cors");
const User = require("./models/users");
const Image = require("./models/image");

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose
  .connect(
    "mongodb+srv://jainesh:jainesh000@cluster1.6e9yv2w.mongodb.net/PASSPORTPHOTO?retryWrites=true&w=majority&appName=Cluster1",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("Error connecting to MongoDB:", error));

// User Schema and Model
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const User = mongoose.model("User", userSchema);

// Image Schema and Model
const imageSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  imagePath: { type: String, required: true },
  uploadDate: { type: Date, default: Date.now },
});

const Image = mongoose.model("Image", imageSchema);

// Routes
// SignUp Route
app.post("/signup", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({ email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// SignIn Route
app.post("/signin", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Successful login without JWT
    res.status(200).json({ message: "Login successful" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Image Upload Route (example for uploading passport photo)
app.post("/upload-image", async (req, res) => {
  const { userId, imagePath } = req.body;

  try {
    // Check if the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Create new image entry
    const newImage = new Image({ userId, imagePath });
    await newImage.save();

    res
      .status(201)
      .json({ message: "Image uploaded successfully", image: newImage });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Image Deletion Route (for auto-deleting images after 5 days)
app.delete("/delete-image/:imageId", async (req, res) => {
  const { imageId } = req.params;

  try {
    // Find the image to delete
    const image = await Image.findById(imageId);
    if (!image) {
      return res.status(404).json({ message: "Image not found" });
    }

    // Delete the image
    await Image.deleteOne({ _id: imageId });

    res.status(200).json({ message: "Image deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Auto-delete images after 5 days
setInterval(async () => {
  const fiveDaysAgo = new Date();
  fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);

  try {
    // Find and delete images older than 5 days
    const expiredImages = await Image.find({
      uploadDate: { $lt: fiveDaysAgo },
    });
    expiredImages.forEach(async (image) => {
      await Image.deleteOne({ _id: image._id });
      console.log(`Deleted image with ID: ${image._id}`);
    });
  } catch (error) {
    console.error("Error deleting old images:", error);
  }
}, 24 * 60 * 60 * 1000); // Runs once a day

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
