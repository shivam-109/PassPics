import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../Styles.css";

function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  // Check login status
  useEffect(() => {
    const userLoggedIn = localStorage.getItem("isLoggedIn");
    setIsLoggedIn(userLoggedIn === "true");
  }, []);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    setIsLoggedIn(false);
    navigate("/signin");
  };

  const handleGetStarted = () => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");

    if (isLoggedIn) {
      navigate("/profile");
    } else {
      navigate("/signin");
    }
  };

  return (
    <header className="header">
      <div className="container header-container">
        <div className="logo">
          {/* Use the logo directly from the public folder */}
          <img
            src={`${process.env.PUBLIC_URL}/images/passpix.png`}
            alt="PassPix Logo"
            style={{ height: "25px" }}
          />
        </div>
        <nav className="nav-links">
          <ul>
            <li>
              <Link to="/landingpage">Home</Link>
            </li>
            <li>
              {isLoggedIn ? (
                <Link to="/signin" onClick={handleLogout}>
                  Logout
                </Link>
              ) : (
                <Link to="/signin">Sign In</Link>
              )}
            </li>
            <li>
              <img
                onClick={handleGetStarted}
                src={`${process.env.PUBLIC_URL}/images/profile.png`}
                alt="Profile"
                className="profile-icon"
              />
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Header;
