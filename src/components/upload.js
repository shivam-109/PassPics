import React, { useState, useRef } from "react";
import Header from "./Header";
import Footer from "./Footer";
import { Cropper } from "react-cropper";
import "cropperjs/dist/cropper.css";

function Upload() {
  const [selectedCountry, setSelectedCountry] = useState("");
  const [countryInfo, setCountryInfo] = useState("");
  const [file, setFile] = useState(null);
  const [photoURL, setPhotoURL] = useState("");
  const [croppedImage, setCroppedImage] = useState("");
  const cropperRef = useRef(null);

  const countries = {
    USA: {
      info: "United States of America",
      overallInfo:
        "The USA is known for its diverse culture, advanced technology, and significant global influence.",
      passportSize: { width: "51mm", height: "51mm" },
    },
    Canada: {
      info: "Canada",
      overallInfo:
        "Canada is known for its vast wilderness, multicultural population, and friendly people.",
      passportSize: { width: "50mm", height: "70mm" },
    },
    UK: {
      info: "United Kingdom",
      overallInfo:
        "The UK is known for its historical heritage, diverse population, and influential global culture.",
      passportSize: { width: "35mm", height: "45mm" },
    },
    Germany: {
      info: "Germany",
      overallInfo:
        "Germany is renowned for its engineering, beer, and historical significance in Europe.",
      passportSize: { width: "35mm", height: "45mm" },
    },
    France: {
      info: "France",
      overallInfo:
        "France is famous for its art, cuisine, and significant influence on Western culture.",
      passportSize: { width: "35mm", height: "45mm" },
    },
    Australia: {
      info: "Australia",
      overallInfo:
        "Australia is known for its natural wonders, wildlife, and outdoor lifestyle.",
      passportSize: { width: "35mm", height: "45mm" },
    },
    India: {
      info: "India",
      overallInfo:
        "India is known for its rich history, diverse culture, and rapidly growing economy.",
      passportSize: { width: "35mm", height: "45mm" },
    },
    Japan: {
      info: "Japan",
      overallInfo:
        "Japan is famous for its technology, traditional arts, and unique culture.",
      passportSize: { width: "45mm", height: "35mm" },
    },
    China: {
      info: "China",
      overallInfo:
        "China has a rich cultural heritage and is known for its ancient history and rapid modernization.",
      passportSize: { width: "33mm", height: "48mm" },
    },
    Brazil: {
      info: "Brazil",
      overallInfo:
        "Brazil is known for its Carnival, vibrant culture, and diverse ecosystems like the Amazon.",
      passportSize: { width: "35mm", height: "45mm" },
    },
    Russia: {
      info: "Russia",
      overallInfo:
        "Russia is the world's largest country and known for its historical and cultural landmarks.",
      passportSize: { width: "35mm", height: "45mm" },
    },
    SouthAfrica: {
      info: "South Africa",
      overallInfo:
        "South Africa is known for its diverse landscapes, wildlife, and multicultural heritage.",
      passportSize: { width: "35mm", height: "45mm" },
    },
    SaudiArabia: {
      info: "Saudi Arabia",
      overallInfo:
        "Saudi Arabia is known for its oil reserves and cultural heritage in the Middle East.",
      passportSize: { width: "40mm", height: "60mm" },
    },
    UAE: {
      info: "United Arab Emirates",
      overallInfo:
        "The UAE is known for its modern cities like Dubai and Abu Dhabi, and thriving economy.",
      passportSize: { width: "45mm", height: "35mm" },
    },
    SouthKorea: {
      info: "South Korea",
      overallInfo:
        "South Korea is known for its technology, pop culture, and vibrant economy.",
      passportSize: { width: "35mm", height: "45mm" },
    },
    Turkey: {
      info: "Turkey",
      overallInfo:
        "Turkey bridges Europe and Asia, known for its historical sites and diverse culture.",
      passportSize: { width: "50mm", height: "60mm" },
    },
    Argentina: {
      info: "Argentina",
      overallInfo:
        "Argentina is famous for its tango music, beef, and stunning landscapes like Patagonia.",
      passportSize: { width: "40mm", height: "40mm" },
    },
    Italy: {
      info: "Italy",
      overallInfo:
        "Italy is renowned for its art, cuisine, fashion, and significant impact on Western culture.",
      passportSize: { width: "35mm", height: "45mm" },
    },
    Mexico: {
      info: "Mexico",
      overallInfo:
        "Mexico is known for its rich cultural heritage, diverse landscapes, and vibrant festivals.",
      passportSize: { width: "35mm", height: "45mm" },
    },
    Egypt: {
      info: "Egypt",
      overallInfo:
        "Egypt is famous for its ancient history, pyramids, and significant role in early civilizations.",
      passportSize: { width: "40mm", height: "60mm" },
    },
    Singapore: {
      info: "Singapore",
      overallInfo:
        "Singapore is a global financial hub known for its efficiency, cleanliness, and multicultural society.",
      passportSize: { width: "35mm", height: "45mm" },
    },
    Philippines: {
      info: "Philippines",
      overallInfo:
        "The Philippines is known for its islands, diverse cultures, and resilient people.",
      passportSize: { width: "35mm", height: "45mm" },
    },
    Malaysia: {
      info: "Malaysia",
      overallInfo:
        "Malaysia is known for its beaches, rainforests, and vibrant mix of cultures.",
      passportSize: { width: "35mm", height: "50mm" },
    },
    Nigeria: {
      info: "Nigeria",
      overallInfo:
        "Nigeria is the most populous country in Africa and is known for its cultural diversity and oil reserves.",
      passportSize: { width: "35mm", height: "45mm" },
    },
    Thailand: {
      info: "Thailand",
      overallInfo:
        "Thailand is famous for its beautiful beaches, temples, and rich cultural heritage.",
      passportSize: { width: "35mm", height: "45mm" },
    },
  };

  const handleCountryChange = (event) => {
    const country = event.target.value;
    setSelectedCountry(country);
    setCountryInfo(countries[country] ? countries[country].info : "");
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
    if (selectedFile) {
      setPhotoURL(URL.createObjectURL(selectedFile));
    }
  };

  const handleCrop = () => {
    if (cropperRef.current) {
      const cropper = cropperRef.current.cropper;
      if (cropper) {

        const croppedCanvas = cropper.getCroppedCanvas();
        if (croppedCanvas) {
          // Check if croppedCanvas is valid
          const croppedData = croppedCanvas.toDataURL();
          setCroppedImage(croppedData);
        } else {
          console.error("Cropped canvas is not valid.");
        }
      } else {
        console.error("Cropper instance is not available.");
      }
    }
  };

  const handleDownload = () => {
    if (croppedImage) {
      const link = document.createElement('a');
      link.href = croppedImage;
      link.download = `cropped_image_${selectedCountry}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      alert('No cropped image available to download.');
    }
  };

  const handleUpload = async () => {
    if (file && selectedCountry && croppedImage) {
      const formData = new FormData();
      // Convert the cropped base64 image to a Blob
      const croppedBlob = await fetch(croppedImage)
        .then((res) => res.blob()) // Convert base64 to Blob
        .then((blob) => blob);
      
      // Create a new file from the Blob
      const croppedFile = new File([croppedBlob], `cropped_image_${selectedCountry}.png`, { type: 'image/png' });
      
      // Append the file and country info to the FormData
      formData.append("uploaded-image", croppedFile);
      formData.append("selectedCountry", selectedCountry);
  
      try {
        const response = await fetch('http://localhost:5001/upload', {
          method: 'POST',
          body: formData, // Use formData instead of JSON.stringify
        });
  
        const result = await response.json();
        if (response.ok) {
          alert(result.message); // Success message
        } else {
          alert(result.message); // Error message
        }
      } catch (error) {
        console.error('Error uploading image:', error);
        alert('Error uploading image');
      }
    } else {
      alert('Please select a file, crop it, and select a country before uploading.');
    }
  };


  
  return (
    <div className="upload-page">
      <Header />

      <main className="main-content">
        <form action="/upload" method="post" encType="multipart/form-data" onSubmit={handleUpload} >
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
              <input type="file" id="fileUpload"  onChange={handleFileChange} />
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
                      cropperRef.current = instance;
                    }}
                  />
                  <button type="button" onClick={handleCrop} className="btn btn-crop">
                    Crop
                  </button>
                </div>
              )}
              <h4>Cropped Photo:</h4>
              {croppedImage ? (
                <img
                  src={croppedImage}
                  alt="Cropped"
                  name="uploaded-image"
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

          <footer className="footer-buttons">
            <button type="button" onClick={handleUpload} className="btn btn-upload">
              Upload
            </button>
            <button type="button" onClick={handleDownload} className="btn btn-download">
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