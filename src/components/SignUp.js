// SignUp.js
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

function SignUp({ onSignUp }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const response = await fetch('http://localhost:5001/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        navigate("/signin");
      } else {
        const result = await response.json();
        alert(result.message);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error during signup');
    }
  };

  return (
    <>
      <Header />  
      <div className="auth-container">
        <div className="form-box">
          <h2>Sign Up</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email:</label>
              <input
                type="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Password:</label>
              <input
                type="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Confirm Password:</label>
              <input
                type="password"
                className="form-control"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary btn-block">
              Sign Up
            </button>
          </form>
          <p className="mt-3">
            Already have an account? <Link to="/signin">Sign In</Link>
          </p>
        </div>
        <div className="image-box">
          <img src={`${process.env.PUBLIC_URL}/images/signup.png`} alt="Sign Up Illustration" />
        </div>
      </div>
      <Footer />
    </>
  );
}

export default SignUp;
