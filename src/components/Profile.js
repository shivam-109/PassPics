import React, { useEffect, useState } from "react";
import "../Styles.css"; 

function Profile() {
  const [userEmail, setUserEmail] = useState("");
  const [profileImage, setProfileImage] = useState("");

  useEffect(() => {
    // Fetch user data (email and profile image) from local storage or an API
    const storedEmail = localStorage.getItem("userEmail");
    const storedProfileImage = localStorage.getItem("profileImage");

    if (storedEmail) setUserEmail(storedEmail);
    if (storedProfileImage) {
      setProfileImage(storedProfileImage);
    } else {
      // Placeholder image URL
      setProfileImage(`${process.env.PUBLIC_URL}/images/profile.png`);
    }
  }, []);

  return (
    <div className="profile-container">
      <div className="profile-card">
        <img
          src={profileImage}
          alt="User Profile"
          className="profile-image"
        />
        <h3 className="profile-email">{userEmail}</h3>
      </div>
    </div>
  );
}

export default Profile;
