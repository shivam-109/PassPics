import React, { useState } from "react";
import Header from "./Header";
import Footer from "./Footer";

function Upload() {
  const [selectedCountry, setSelectedCountry] = useState("");
  const [countryInfo, setCountryInfo] = useState("");
  const [file, setFile] = useState(null);
  const [photoURL, setPhotoURL] = useState("");

  const countries = {
    USA: {
      info: "The United States of America, commonly known as the United States.",
      overallInfo:
        "The USA is known for its diverse culture, advanced technology, and significant global influence.",
      passportSize: { width: "50mm", height: "70mm" },
    },
    Canada: {
      info: "Canada is a country in North America.",
      overallInfo:
        "Canada is known for its vast wilderness, multicultural population, and friendly people.",
      passportSize: { width: "50mm", height: "70mm" },
    },
    Germany: {
      info: "Germany is a country in Europe known for its history and culture.",
      overallInfo:
        "Germany is renowned for its engineering, beer, and historical significance in Europe.",
      passportSize: { width: "35mm", height: "45mm" },
    },
    Japan: {
      info: "Japan is an island nation in East Asia.",
      overallInfo:
        "Japan is famous for its technology, traditional arts, and unique culture.",
      passportSize: { width: "45mm", height: "65mm" },
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

  const handleUpload = () => {
    if (file && selectedCountry) {
      alert(`File: ${file.name} uploaded successfully for ${selectedCountry}`);
    } else {
      alert("Please select a file and country before uploading.");
    }
  };

  return (
    <div className="upload-page">
      <Header />

      <main className="main-content">
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
            <h4>Uploaded Photo:</h4>
            {photoURL ? (
              <img
                src={photoURL}
                alt="Uploaded"
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
              <p>No photo uploaded yet.</p>
            )}
          </div>
        </div>

        <div className="upload-section">
          <label htmlFor="fileUpload">Upload Your Photo:</label>
          <input type="file" id="fileUpload" onChange={handleFileChange} />
        </div>

        <footer className="footer-buttons">
          <button onClick={handleUpload} className="btn btn-upload">
            Upload
          </button>
          <button className="btn btn-download">Download</button>
        </footer>
      </main>

      <Footer />
    </div>
  );
}

export default Upload;
