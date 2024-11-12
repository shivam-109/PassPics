// SignIn.js
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

function SignIn({ onSignIn }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => { 
    e.preventDefault();
    onSignIn(email, password); // Assuming this function handles authentication
    navigate("/home"); // Redirect to the home page after sign-in
  };

  return (
    <>
      <Header />
      <div className="auth-container">
        <div className="form-box">
          <h2>Login</h2>
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
            <button type="submit" className="btn btn-primary btn-block">
              Sign In
            </button>
          </form>
          <p className="mt-3">
            Don't have an account? <Link to="/signup">Sign Up</Link>
          </p>
        </div>
        <div className="image-box">
          <img 
            src={`${process.env.PUBLIC_URL}/images/login.png`} 
            alt="Sign In Illustration" 
          />
        </div>
      </div>
      <Footer />
    </>
  );
}

export default SignIn;
