import React, { useEffect, useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import "../Styles.css";

function Profile() {
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [profileImage, setProfileImage] = useState("");

  useEffect(() => {
    // Fetch the user's email from local storage
    const storedEmail = localStorage.getItem("userEmail");

    if (storedEmail) {
      // Fetch user data from the API
      fetch(`http://localhost:5001/profile/${storedEmail}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to fetch user profile");
          }
          return response.json();
        })
        .then((data) => {
          setUserName(data.name || "Guest");
          setUserEmail(data.email || "No email provided");
        })
        .catch((error) => {
          console.error("Error fetching user profile:", error);
        });
    }

    // Set profile image from local storage or a placeholder
    const storedProfileImage = localStorage.getItem("profileImage");
    setProfileImage(
      storedProfileImage || `${process.env.PUBLIC_URL}/images/profile.png`
    );
  }, []);

  return (
    <>
      <Header /> {/* Add Header */}
      <div className="profile-container">
        <div className="profile-card">
          <img
            src={profileImage}
            alt="User Profile"
            className="profile-image"
          />
          <h3 className="profile-name">{userName}</h3>
          <p className="profile-email">{userEmail}</p>
        </div>
      </div>
      <Footer /> {/* Add Footer */}
    </>
  );
}

export default Profile;
