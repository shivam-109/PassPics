import React, { useEffect } from 'react';

function SuccessPage() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const imageUrl = params.get('imageUrl');

    if (imageUrl) {
      const link = document.createElement('a');
      link.href = imageUrl;
      link.download = 'cropped_image.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }, []);

  return <div>Payment successful! Your download should start shortly.</div>;
}

export default SuccessPage;
