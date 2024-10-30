import React, {useEffect, useState} from "react";
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
    navigate("/signin"); // Redirect to sign-in page
  };

  return (
    <header className="header">
      <div className="container header-container">
        <div className="logo">
          <span className="logo-name">PassPix</span>
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
              <Link to="/profile">
                <img
                  src={`${process.env.PUBLIC_URL}/images/profile.png`} 
                  alt="Profile"
                  className="profile-icon" 
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
