const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const cors = require("cors");
const multer = require("multer");
const fs = require("fs");
const stripe = require("stripe")(
  "sk_test_51PoTqD2Kf7Wo6EqvZ48sfohq3MmvmtUCGzaNsuZB14ANUnXK7caJxwk9lG899pFaTZLo4KPKRHXWIwvza4RWuFRM00CwE8eRNs"
);

const User = require("./models/users");
const Image = require("./models/image");

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(express.json());
app.use(cors());
app.use("/uploads", express.static("uploads"));

// MongoDB Connection
mongoose
  .connect(
    "mongodb+srv://jainesh:jainesh000@cluster1.6e9yv2w.mongodb.net/PASSPORTPHOTO?retryWrites=true&w=majority&appName=Cluster1",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("Error connecting to MongoDB:", error));

// Create uploads folder if it doesn't exist
if (!fs.existsSync("./uploads")) {
  fs.mkdirSync("./uploads");
}

// Multer Storage Configuration
/* const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage }); */
// Middleware to generate timestamp
app.use((req, res, next) => {
  req.uploadTimestamp = Date.now();
  console.log("Generated Timestamp:", req.uploadTimestamp); // Debug
  next();
});

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = "./uploads";
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    console.log("Using Timestamp for File:", req.uploadTimestamp); // Debug
    cb(null, `${req.uploadTimestamp}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// Routes

// Signup Route
app.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Signin Route
app.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    res.status(200).json({ message: "Login successful", email: user.email });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Profile Route
app.get("/profile/:email", async (req, res) => {
  try {
    const { email } = req.params;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ name: user.name, email: user.email });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// File Upload Route
/* app.post("/upload", upload.single("uploaded-image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const newImage = new Image({
      filename: req.file.filename,
      path: req.file.path,
    });

    await newImage.save();
    res.json({
      message: "File uploaded successfully",
      filePath: req.file.path,
    });
  } catch (error) {
    res.status(500).json({ message: "File upload failed", error });
  }
}); */
app.post("/upload", upload.single("uploaded-image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const newImage = new Image({
      filename: req.file.filename,
      path: req.file.path,
    });

    await newImage.save();
    res.json({
      message: "File uploaded successfully",
      filePath: req.file.path,
      filename: req.file.filename, // Include the filename in the response
    });
  } catch (error) {
    res.status(500).json({ message: "File upload failed", error });
  }
});

app.get("/download/:email", async (req, res) => {
  const { email } = req.params;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.downloadCount === 0) {
      // Allow the first download for free
      user.downloadCount += 1;
      await user.save();
      return res.json({ message: "Free download allowed", free: true });
    } else {
      // Create Stripe payment session
      try {
        const session = await stripe.checkout.sessions.create({
          payment_method_types: ["card"],
          line_items: [
            {
              price_data: {
                currency: "cad",
                product_data: {
                  name: "Image Download",
                },
                unit_amount: 200, // Price in cents
              },
              quantity: 1,
            },
          ],
          mode: "payment",
          success_url: `${req.headers.origin}/success`,
          cancel_url: `${req.headers.origin}/upload`,
        });

        res.json({ id: session.id, free: false });
      } catch (stripeError) {
        console.error("Stripe session creation error:", stripeError);
        return res
          .status(500)
          .json({ message: "Failed to create payment session." });
      }
    }
  } catch (error) {
    console.error("Error processing download request:", error);
    res.status(500).json({ message: "Error processing request." });
  }
});
// Stripe Checkout Session Route
// app.post("/create-checkout-session", async (req, res) => {
//   try {
//     const session = await stripe.checkout.sessions.create({
//       payment_method_types: ["card"],
//       line_items: [
//         {
//           price_data: {
//             currency: "usd",
//             product_data: {
//               name: "Passport Photo Download",
//             },
//             unit_amount: 500, // Amount in cents
//           },
//           quantity: 1,
//         },
//       ],
//       mode: "payment",
//       success_url: `${req.headers.origin}/success`,
//       cancel_url: `${req.headers.origin}/upload`,
//     });

//     res.json({ id: session.id });
//   } catch (error) {
//     res.status(500).json({ message: "Error creating checkout session", error });
//   }
// });

// Error Handler Middleware
app.use((err, req, res, next) => {
  console.error("Unexpected error:", err);
  res.status(500).json({ message: "Internal server error" });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
