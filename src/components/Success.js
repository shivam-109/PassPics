import React, { useEffect, useState } from "react";
import Header from "./Header";
import Footer from "./Footer";

function Success() {
  const [croppedImage, setCroppedImage] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [error, setError] = useState("");
  const [backendURL, setBackendURL] = useState("");

  /* useEffect(() => {
    const imagePath = localStorage.getItem("croppedImagePath");
    const country = localStorage.getItem("selectedCountry");

    if (imagePath && country) {
      setCroppedImage(imagePath);
      setSelectedCountry(country);
    } else {
      setError("Required data is missing. Redirecting to the upload page...");
      setTimeout(() => {
        window.location.href = "/upload";
      }, 3000);
    }
  }, []); */
  useEffect(() => {
    const imagePath = localStorage.getItem("croppedImagePath");
    const country = localStorage.getItem("selectedCountry");

    if (imagePath && country) {
      setCroppedImage(`${imagePath}`);
      setSelectedCountry(country);
    } else {
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
      setBackendURL("http://localhost:3000");
      const response = await fetch(`${backendURL}/${croppedImage}`);
      const blob = await response.blob();

      // Create a download link for the image
      const link = document.createElement("a");
      const fileType = blob.type.includes("png") ? "png" : "jpg";
      link.href = URL.createObjectURL(blob);
      link.download = `passport_photo_${selectedCountry}.${fileType}`;
      link.click();

      // Revoke the object URL to free memory
      URL.revokeObjectURL(link.href);
    } catch (error) {
      console.error("Error downloading the image:", error);
      alert("Failed to download the image. Please try again.");
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
                  src={`http://localhost:8888/uploads/${croppedImage}`}
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
