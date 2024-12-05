import React, { useEffect, useState } from "react";
import Header from "./Header";
import Footer from "./Footer";

function Success() {
  const [croppedImage, setCroppedImage] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [error, setError] = useState("");

  // Retrieve S3 URL and country from localStorage
  useEffect(() => {
    const s3Url = localStorage.getItem("s3ImageURL");
    const country = localStorage.getItem("selectedCountry");

    if (s3Url && country) {
      setCroppedImage(s3Url);
      setSelectedCountry(country);
    } else {
      console.error("Missing S3 URL or country in localStorage.");
      setError("Required data is missing. Redirecting to the upload page...");
      setTimeout(() => {
        window.location.href = "/upload";
      }, 3000);
    }
  }, []);

  const handleDownload = async () => {
    if (!croppedImage) {
      alert("No image available to download.");
      return;
    }

    try {
      const response = await fetch(croppedImage);
      if (!response.ok) {
        throw new Error("Failed to fetch the image. Please try again.");
      }
      const blob = await response.blob();
      const link = document.createElement("a");
      const fileType = blob.type.includes("png") ? "png" : "jpg";
      link.href = URL.createObjectURL(blob);
      link.download = `passport_photo_${selectedCountry}.${fileType}`;
      link.click();
      URL.revokeObjectURL(link.href);
    } catch (error) {
      console.error("Error downloading the image:", error);
      alert("Downloading Your Image...");
      // Retry logic
      setTimeout(() => {
        handleDownload();
      }, 1000);
    }
  };

  return (
    <div className="success-page">
      <Header />
      <main className="main-content">
        {error ? (
          <div className="error-message">
            <h1>Error</h1>
            <p>{error}</p>
          </div>
        ) : (
          <>
            <h1>Payment Successful!</h1>
            <p>Thank you for your payment.</p>
            <div className="user-info">
              <h4>Selected Country:</h4>
              <p>{selectedCountry}</p>
              <h4>Your Cropped Photo:</h4>
              {croppedImage ? (
                <img
                  src={croppedImage} // Use S3 URL here
                  alt="Cropped"
                  className="uploaded-image"
                  style={{ objectFit: "cover" }}
                />
              ) : (
                <p>No cropped photo available.</p>
              )}
            </div>
            <button onClick={handleDownload} className="btn btn-download">
              Download Photo
            </button>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}

export default Success;
