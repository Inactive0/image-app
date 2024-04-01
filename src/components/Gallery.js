import React, { useState, useEffect } from 'react';
import axios from 'axios';
import LazyLoad from 'react-lazyload';

const Gallery = () => {
  const [images, setImages] = useState([]);
  const [loadTime, setLoadTime] = useState(null);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const startTime = performance.now();
        const response = await axios.get('https://api.unsplash.com/photos', {
          params: {
            client_id: process.env.REACT_APP_UNSPLASH_ACCESS_KEY,
            per_page: 10, //Первые 10 фото предзагрузка
          },
        });
        const endTime = performance.now();
        setLoadTime(endTime - startTime);
        setImages(response.data);
      } catch (error) {
        console.error('Error fetching images:', error);
      }
    };

    fetchImages();
  }, []);

  useEffect(() => {
    images.slice(0, 3).forEach((image) => {
      const img = new Image();
      img.src = image.urls.regular;
    });
  }, [images]);

  return (
    <div className="gallery">
      {images.map((image) => (
        <LazyLoad key={image.id} height={200} offset={100}>
          <img
            src={image.urls.regular}
            alt={image.alt_description}
            className="gallery-image"
          />
        </LazyLoad>
      ))}
      {loadTime && <p>Load Time: {loadTime} ms</p>}
    </div>
  );
};

export default Gallery;
