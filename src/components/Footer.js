import React from "react";

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <p>&copy; {new Date().getFullYear()} PassPix. All rights reserved.</p>
        <nav className="footer-nav">
          <a href="/about">About</a> | <a href="/contact">Contact</a> |{" "}
          <a href="/privacy">Privacy Policy</a>
        </nav>
      </div>
    </footer>
  );
}

export default Footer;
