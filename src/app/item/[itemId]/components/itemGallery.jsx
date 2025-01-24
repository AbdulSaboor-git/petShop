import React, { useState, useRef } from "react";
import Slider from "react-slick";

const ItemGallery = ({ item }) => {
  const [loading, setLoading] = useState(false);
  const sliderRef = useRef(null); // Ref to control the slick slider

  const handleImageLoad = () => {
    setLoading(false);
  };

  const handleImageError = (e) => {
    e.target.src = "/path/to/placeholder-image.jpg"; // Fallback to placeholder image
  };

  const handleThumbnailClick = (index) => {
    // When a thumbnail is clicked, go to the corresponding slide
    if (sliderRef.current) {
      sliderRef.current.slickGoTo(index);
    }
  };

  const settings = {
    infinite: true,
    centerMode: true,
    centerPadding: "0",
    slidesToShow: 1,
    speed: 500,
    focusOnSelect: false,
    arrows: false, // Optional, for turning off default arrows
    draggable: true, // Enable dragging for desktop
    swipeToSlide: true, // Enable swipe to slide
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      {/* Main Image Slider */}
      <div className="relative">
        {/* Show loading spinner or placeholder until image loads */}
        {loading && (
          <div className="absolute inset-0 flex justify-center items-center bg-gray-100">
            Loading...
          </div>
        )}

        <Slider {...settings} ref={sliderRef}>
          {item.images?.map((img, index) => (
            <div
              key={index}
              className="w-full bg-white rounded-xl overflow-hidden focus:outline-none"
            >
              <img
                src={img}
                className="w-full bg-white aspect-square h-auto object-cover transition-all duration-300"
                alt={`Main product ${index}`}
                onLoad={handleImageLoad}
                onError={handleImageError}
              />
            </div>
          ))}
        </Slider>
      </div>

      {/* Thumbnail Images */}
      <div className="flex gap-0.5 overflow-x-auto hidden_scroll_bar items-center">
        {item.images?.map((img, index) => (
          <div
            key={index}
            className="min-w-[90px] cursor-pointer "
            onClick={() => handleThumbnailClick(index)} // Handle click on thumbnail
          >
            <img
              draggable="false"
              src={img}
              className="w-20 h-20 object-cover rounded-xl"
              alt={`Thumbnail ${index}`}
              onError={handleImageError}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ItemGallery;
