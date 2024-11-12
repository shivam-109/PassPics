import React from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import Header from "./Header";
import Footer from "./Footer";
import "../Styles.css"



function LandingPage() {
  const navigate = useNavigate(); 

  const reviews = [
    {
      name: "John Doe",
      text: "PassPixx saved me hours of time! I needed photos for multiple visas, and it delivered perfect results every time.",
      rating: 5,
      profileImage: `${process.env.PUBLIC_URL}/images/profile.png`,
    },
    {
      name: "User 2",
      text: "The process was simple and the photos turned out great! Highly recommend PassPixx.",
      rating: 5,
      profileImage: `${process.env.PUBLIC_URL}/images/profile.png`,
    },
    {
      name: "User 3",
      text: "I was impressed with how quick and easy it was to get my passport photo. Will use again!",
      rating: 5,
      profileImage: `${process.env.PUBLIC_URL}/images/profile.png`,
    },
  ];

  // Function to handle the click event for "Get Started" button
  const handleGetStarted = () => {
    const isLoggedIn = localStorage.getItem("isLoggedIn"); 

    if (isLoggedIn) {
      navigate("/upload"); 
    } else {
      navigate("/signin"); 
    }
  };

  return (
    <div className="landing-page">
      <Header />
      <div className="hero-section">
        <div className="hero-text">
          <h1>Welcome to Our Application</h1>
          <p>Your one-stop solution for all your needs.</p>
          <button className="hero-button" onClick={handleGetStarted}>
            Get Started
          </button>
        </div>
      </div>
      <div className="content">
        <div className="left-section">
          <div className="intro-text">
            <h2>How It Works</h2>
            <p>
              Create your perfect passport size photo in just a few simple steps
            </p>
          </div>
          <div className="cards-section">
            <div className="card">
              <div className="card-header">
                <img
                  src={`${process.env.PUBLIC_URL}/images/upload.png`}
                  alt="Upload"
                  className="card-logo"
                />
                <h3>Upload Photo</h3>
              </div>
              <p>
                Upload any clear photo of yourself against a plain background.
              </p>
            </div>
            <div className="card">
              <div className="card-header">
                <img
                  src={`${process.env.PUBLIC_URL}/images/country.png`}
                  alt="Select Country"
                  className="card-logo"
                />
                <h3>Select Country</h3>
              </div>
              <p>Choose the country for which you need the passport photo.</p>
            </div>
            <div className="card">
              <div className="card-header">
                <img
                  src={`${process.env.PUBLIC_URL}/images/crop.png`}
                  alt="Crop"
                  className="card-logo"
                />
                <h3>Crop</h3>
              </div>
              <p>Crop your photo that you want to download.</p>
            </div>
            <div className="card">
              <div className="card-header">
                <img
                  src={`${process.env.PUBLIC_URL}/images/download.png`}
                  alt="Download"
                  className="card-logo"
                />
                <h3>Download</h3>
              </div>
              <p>
                Get the perfectly sized passport photo ready for printing or
                digital submission.
              </p>
            </div>
          </div>
        </div>
        <div className="image-section">
          <img
            src={`${process.env.PUBLIC_URL}/images/secure.png`}
            alt="Large"
          />
        </div>
      </div>
      
      <div className="reviews-section">
        <h2>What Our Users Say</h2>
        <p>Don't just take our word for it. Here's what our satisfied customers have to say about PassPixx.</p>
        <div className="review-cards">
          {reviews.map((review, index) => (
            <div className="review-card" key={index}>
              <div className="review-header">
                <img src={review.profileImage} alt={`${review.name} profile`} className="profile-image" />
                <h3>{review.name}</h3>
              </div>
              <p>{review.text}</p>
              <div className="stars">
                {[...Array(review.rating)].map((_, i) => (
                  <span key={i} className="star">★</span>
                ))}
                {[...Array(5 - review.rating)].map((_, i) => (
                  <span key={i + review.rating} className="star empty">★</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default LandingPage;
