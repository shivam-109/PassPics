import React, { useRef, useState, useEffect } from "react";
import Cropper from "cropperjs";
import "cropperjs/dist/cropper.css";

const ImageCropper = () => {
  const imageRef = useRef(null); 
  const [cropper, setCropper] = useState(null); 
  const [croppedImage, setCroppedImage] = useState(null);

  useEffect(() => {
    // Initialize Cropper instance when the component mounts
    if (imageRef.current && !cropper) {
      const newCropper = new Cropper(imageRef.current, {
        aspectRatio: 1,
        viewMode: 1,
        scalable: false,
        zoomable: false,
      });
      setCropper(newCropper); // Store cropper instance in state
    }

    // Cleanup the cropper instance when the component unmounts
    return () => {
      if (cropper) {
        cropper.destroy();
      }
    };
  }, [cropper]);

  const handleCrop = () => {
    if (cropper) {
      // Check if cropper is initialized before calling getCroppedCanvas
      const canvas = cropper.getCroppedCanvas();
      if (canvas) {
        setCroppedImage(canvas.toDataURL()); // Set the cropped image URL
      }
    }
  };

  return (
    <div>
      <h1>Image Cropper</h1>
      <input
        type="file"
        onChange={(e) => {
          const file = e.target.files[0];
          if (file) {
            const reader = new FileReader();
            reader.onload = () => {
              if (imageRef.current) {
                imageRef.current.src = reader.result;
              }
            };
            reader.readAsDataURL(file);
          }
        }}
      />
      <br />
      <img
        ref={imageRef}
        alt="Image to be cropped"
        style={{ maxWidth: "100%" }}
      />
      <br />
      <button onClick={handleCrop}>Crop</button>

      {croppedImage && (
        <div>
          <h3>Cropped Image:</h3>
          <img src={croppedImage} alt="Cropped" />
        </div>
      )}
    </div>
  );
};

export default ImageCropper;
