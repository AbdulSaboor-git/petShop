import React from "react";

export default function ItemGalleryLoader() {
  let images = [1, 2, 3];
  return (
    <div className="flex flex-col gap-2 md:gap-3 w-full animate-pulse">
      <div className="aspect-square rounded-xl h-auto bg-gradient-to-br from-gray-400 via-gray-300 to-gray-400" />
      <div className="flex gap-2 md:gap-3 overflow-x-auto hidden_scroll_bar items-center">
        {images.map((img, index) => (
          <div
            key={index}
            className="w-16 md:w-[20] bg-gradient-to-br from-gray-400 to-gray-400 via-gray-300  rounded-xl aspect-square"
          />
        ))}
      </div>
    </div>
  );
}
