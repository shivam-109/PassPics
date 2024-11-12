import React from "react";
import { Link } from "react-router-dom";
import "../Styles.css"; // Make sure the path is correct

function Header() {
  return (
    <header className="header">
      <div className="container header-container">
        <div className="logo">
          {/* <img
            src={`${process.env.PUBLIC_URL}/images/logo.png`}
            alt="Website Logo"
          /> */}
          <span className="logo-name">PassPix</span>
        </div>
        <nav className="nav-links">
          <ul>
            {/* <li>
              <Link to="/signin">Sign In</Link>
            </li>
            <li>
              <Link to="/signup">Sign Up</Link>
            </li> */}
            <li>
              <Link to="/landingpage">Home</Link>
            </li>
            <li>
              <Link to="/profile">
                <img
                  src={`${process.env.PUBLIC_URL}/images/profile.png`} // Replace with your profile icon path
                  alt="Profile"
                  className="profile-icon" // Add a class for styling if needed
                />
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Header;
