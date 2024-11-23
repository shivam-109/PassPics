import React, { useState, useRef } from "react";
import Header from "./Header";
import Footer from "./Footer";
import { Cropper } from "react-cropper";
import "cropperjs/dist/cropper.css";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";
import countriesData from "./countries.json";

const stripePromise = loadStripe(
  "pk_test_51PoTqD2Kf7Wo6EqvnWI6cOsCwS1W6S2yrNIlaWmIJLFhVaAfZGqcwXmEburcFi3tojP9euIuevW4drxOM1QMyeVf00U4XFf9xx"
);

function Upload() {
  const [selectedCountry, setSelectedCountry] = useState("");
  const [countryInfo, setCountryInfo] = useState("");
  const [file, setFile] = useState(null);
  const [photoURL, setPhotoURL] = useState("");
  const [croppedImage, setCroppedImage] = useState("");
  const [imageLoading, setImageLoading] = useState(false);
  const [disableDownload, setDisableDownload] = useState(false);

  const cropperRef = useRef(null);

  const countries = countriesData.countries.reduce((acc, country) => {
    acc[country.name] = {
      info: country.info,
      passportSize: country.passportSize,
    };
    return acc;
  }, {});

  const handleCountryChange = (event) => {
    const country = event.target.value;
    setSelectedCountry(country);
    setCountryInfo(countries[country] ? countries[country].info : "");
  };

  const faceDetect = async (croppedImage) => {
    const data = new FormData();

    const croppedBlob = await fetch(croppedImage).then((res) => res.blob());
    const croppedFile = new File([croppedBlob], "cropped_image.png", {
      type: "image/png",
    });
    data.append("image", croppedFile);
    const xhr = new XMLHttpRequest();
    xhr.withCredentials = true;
    setImageLoading(true);
    return new Promise((resolve, reject) => {
      xhr.addEventListener("readystatechange", function () {
        if (this.readyState === this.DONE) {
          try {
            const response = JSON.parse(this.responseText);

            const entities = response.results[0]?.entities;
            if (entities && entities.length > 0) {
              const faceDetector = entities.find(
                (entity) => entity.name === "face-detector"
              );

              if (faceDetector) {
                const facesDetected = faceDetector.objects.some((object) =>
                  object.entities?.some((entity) => entity.name === "face")
                );
                resolve(facesDetected);
              } else {
                resolve(false);
              }
            } else {
              resolve(false);
            }
          } catch (error) {
            console.error("Error parsing the response:", error);
            reject(false);
          } finally {
            setImageLoading(false);
          }
        }
      });

      xhr.open(
        "POST",
        "https://face-detection14.p.rapidapi.com/v1/results?detection=true&embeddings=false"
      );
      // xhr.setRequestHeader(
      //   "x-rapidapi-key",
      //   "d84f3289c2msh17bd82475b65355p1aec67jsnd6fdcf9d623b"
      // );
      xhr.setRequestHeader(
        "x-rapidapi-key",
        "3323b99f07msh3bf62a46b6768a3p11a6eejsnea93802604b3"
      );
      xhr.setRequestHeader(
        "x-rapidapi-host",
        "face-detection14.p.rapidapi.com"
      );

      xhr.send(data);
    });
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
    if (selectedFile) {
      setPhotoURL(URL.createObjectURL(selectedFile));
      cropperRef.current = null; // Reset cropper reference on new file upload
    }
  };

  const handleCrop = () => {
    const cropperInstance = cropperRef.current?.cropper; // Access the cropper instance
    if (
      !cropperInstance ||
      typeof cropperInstance.getCroppedCanvas !== "function"
    ) {
      alert("Please upload an image and crop it again.");
      return;
    }

    const croppedCanvas = cropperInstance.getCroppedCanvas();
    if (croppedCanvas) {
      const croppedData = croppedCanvas.toDataURL("image/png");
      setCroppedImage(croppedData);
    } else {
      alert("Failed to crop the image.");
    }
  };

  const handleDownload = async () => {
    if (!croppedImage && !disableDownload) {
      const handleCrop = () => {
        const cropper = cropperRef.current;
        if (cropper) {
          const croppedCanvas = cropper.getCroppedCanvas();
          if (croppedCanvas) {
            const croppedData = croppedCanvas.toDataURL("image/png");
            setCroppedImage(croppedData);
          } else {
            alert("Failed to crop the image.");
          }
        } else {
          alert("Cropper instance is not available.");
        }
      };

      alert("No cropped image available to download.");
      return;
    }

    const email = localStorage.getItem("userEmail");
    if (!email) {
      alert("User email not found. Please log in.");
      return;
    }

    const stripe = await stripePromise;

    try {
      const response = await fetch(`http://localhost:5001/download/${email}`);
      if (!response.ok) {
        console.error(
          "Failed to fetch download endpoint:",
          await response.text()
        );
        alert("An error occurred while processing your download.");
        return;
      }

      const result = await response.json();

      if (result.free) {
        // Free download logic
        const blob = await fetch(croppedImage).then((res) => res.blob());
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `passport_photo_${selectedCountry}.png`;
        link.click();
        URL.revokeObjectURL(link.href);
        // window.location.href = "/success"; // Redirect to success page
      } else {
        // Paid download logic
        const { error } = await stripe.redirectToCheckout({
          sessionId: result.id,
        });

        if (error) {
          console.error("Stripe checkout error:", error);
          alert("Payment failed. Please try again.");
        }
      }
    } catch (error) {
      console.error("Error handling download request:", error);
      alert("An unexpected error occurred. Please try again.");
    }
  };

  /* const handleUpload = async () => {
    if (file && selectedCountry && croppedImage) {
      const formData = new FormData();
      const croppedBlob = await fetch(croppedImage).then((res) => res.blob());

      const croppedFile = new File(
        [croppedBlob],
        `cropped_image_${selectedCountry}.png`,
        { type: "image/png" }
      );

      const status = await faceDetect(croppedImage);
      console.log(status);
      if (status) {
        alert("Face decected!!");
        setDisableDownload(false);
      } else {
        alert("Please upload valid image, No face found!!");
        setDisableDownload(true);
      }

      if (status) {
        console.log("inside");
        localStorage.setItem(
          "croppedImagePath",
          `${croppedFile.lastModified}-${croppedFile.name}`
        );
        localStorage.setItem("selectedCountry", selectedCountry);
        formData.append("uploaded-image", croppedFile);
        formData.append("selectedCountry", selectedCountry);
        console.log("before");

        try {
          const response = await fetch("http://localhost:5001/upload", {
            method: "POST",
            body: formData,
          });

          const result = await response.json();
          console.log(result);
          alert(result.message);
        } catch (error) {
          console.error("Error uploading image:", error);
          alert("Error uploading image");
        }
      } else {
        alert("Upload Valid Image: No face detected!!");
      }
    } else {
      alert(
        "Please select a file, crop it, and select a country before uploading."
      );
    }
  }; */
  const handleUpload = async () => {
    if (file && selectedCountry && croppedImage) {
      const formData = new FormData();
      const croppedBlob = await fetch(croppedImage).then((res) => res.blob());

      const croppedFile = new File(
        [croppedBlob],
        `cropped_image_${selectedCountry}.png`,
        { type: "image/png" }
      );

      const status = await faceDetect(croppedImage);
      console.log(status);
      if (status) {
        alert("Face detected!!");
        setDisableDownload(false);
      } else {
        alert("Please upload a valid image. No face found!!");
        setDisableDownload(true);
        return;
      }

      formData.append("uploaded-image", croppedFile);
      formData.append("selectedCountry", selectedCountry);

      try {
        const response = await fetch("http://localhost:5001/upload", {
          method: "POST",
          body: formData,
        });

        const result = await response.json();
        console.log(result);

        if (response.ok) {
          alert(result.message);

          // Save backend-generated filename to localStorage
          localStorage.setItem("croppedImagePath", result.filename);
          localStorage.setItem("selectedCountry", selectedCountry);
        } else {
          alert("Error uploading image.");
        }
      } catch (error) {
        console.error("Error uploading image:", error);
        alert("Error uploading image");
      }
    } else {
      alert(
        "Please select a file, crop it, and select a country before uploading."
      );
    }
  };

  return (
    <div className="upload-page">
      <Header />

      <main className="main-content">
        <form
          action="/upload"
          method="post"
          encType="multipart/form-data"
          onSubmit={handleUpload}
        >
          <div className="country-container">
            <div className="country-selector-box">
              <label htmlFor="country">Select Country:</label>
              <select
                id="country"
                onChange={handleCountryChange}
                value={selectedCountry}
              >
                <option value="">--Select a Country--</option>
                {Object.keys(countries).map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>

              <div className="country-info">
                <h4>Country Information:</h4>
                <p>{countryInfo}</p>
                <h4>Passport Size:</h4>
                <p>
                  {selectedCountry
                    ? `${countries[selectedCountry]?.passportSize.width} x ${countries[selectedCountry]?.passportSize.height}`
                    : "Select a country to see passport size."}
                </p>
              </div>
            </div>

            <div className="photo-upload-box">
              <h4>Upload Your Photo:</h4>
              {photoURL && (
                <div>
                  <Cropper
                    src={photoURL}
                    ref={cropperRef}
                    style={{ height: 400, width: "100%" }}
                    aspectRatio={1}
                    guides={false}
                    viewMode={1}
                    onInitialized={(instance) => {
                      cropperRef.current = { cropper: instance }; // Properly set the instance
                    }}
                  />

                  <button
                    type="button"
                    onClick={handleCrop}
                    className="btn btn-crop"
                  >
                    Crop
                  </button>
                </div>
              )}
              <h4>Cropped Photo:</h4>
              {croppedImage ? (
                <img
                  src={croppedImage}
                  alt="Cropped"
                  className="uploaded-image"
                  style={{
                    width: selectedCountry
                      ? countries[selectedCountry].passportSize.width
                      : "auto",
                    height: selectedCountry
                      ? countries[selectedCountry].passportSize.height
                      : "auto",
                    objectFit: "cover",
                  }}
                />
              ) : (
                <p>No photo cropped yet.</p>
              )}
            </div>
          </div>

          <div className="file-upload-section">
            <label htmlFor="fileUpload">Choose File:</label>
            <input type="file" id="fileUpload" onChange={handleFileChange} />
          </div>

          <footer className="footer-buttons">
            {!imageLoading ? (
              <button
                type="button"
                onClick={handleUpload}
                className="btn btn-upload"
              >
                Upload
              </button>
            ) : (
              <button
                type="button"
                onClick={handleUpload}
                className=" btn-loading"
              >
                Loading...
              </button>
            )}
            <button
              disabled={disableDownload}
              type="button"
              onClick={handleDownload}
              className={
                disableDownload ? `btn btn-disabled` : `btn btn-download`
              }
            >
              Download
            </button>
          </footer>
        </form>
      </main>

      <Footer />
    </div>
  );
}

export default Upload;
