// App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import LandingPage from "./components/LandingPage";
import Profile from "./components/Profile";
import Upload from "./components/upload";
import "./App.css"; // Assuming you have styles in this file

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/landingpage" element={<LandingPage />} />
        <Route path="/" element={<LandingPage />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/upload" element={<Upload />} />

      </Routes>
    </Router>
  );
}

export default App;
