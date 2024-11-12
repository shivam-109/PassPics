const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const cors = require('cors');
const path = require('path');
const User = require('./models/users');
const multer = require('multer');
const Image = require('./models/image');

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('uploads'));


// Connect to MongoDB
mongoose.connect('mongodb+srv://jainesh:jainesh000@cluster1.6e9yv2w.mongodb.net/PASSPORTPHOTO?retryWrites=true&w=majority&appName=Cluster1', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('Error connecting to MongoDB:', error));

// Routes
// SignUp Route
app.post('/signup', async (req, res) => {
  const { name, email, password } = req.body; 
  console.log("Signup Request Data:", req.body);

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// SignIn Route
app.post('/signin', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Log the email being sent
    console.log("Login successful, sending email:", user.email);

    // Successful login - include email in the response
    res.status(200).json({ message: 'Login successful', email: user.email });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: 'Server error' });
  }
});


// Profile Route 
app.get('/profile/:email', async (req, res) => {
  try {
    const { email } = req.params; // Use email 
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    
    res.status(200).json({ name: user.name, email: user.email });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ message: 'Server error' });
  }
});

const fs = require('fs');
const path = './uploads';

if (!fs.existsSync(path)){
    fs.mkdirSync(path);
}


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');  
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });


// Define the upload route
app.post('/upload', upload.single('uploaded-image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Save image details to the database (file path, filename, etc.)
    const newImage = new Image({
      filename: req.file.filename,
      path: req.file.path,
    });

    await newImage.save();
    res.json({ message: 'File uploaded successfully', filePath: req.file.path });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'File upload failed', error });
  }
});


// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
