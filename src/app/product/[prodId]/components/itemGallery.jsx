import React, { useState } from "react";

const ItemGallery = ({ item }) => {
    const [mainImage, setMainImage] = useState(item.img);

    return (
        <div className="flex flex-col gap-4 w-full">
            {/* Main Image */}
            <div className="border border-slate-300 p-1">
                <img
                    src={mainImage}
                    className="w-full h-auto object-cover"
                    alt="Main product"
                />
            </div>

            {/* Thumbnail Images */}
            <div className="flex gap-2 overflow-x-auto items-center">
                {item.images.map((img, index) => (
                    <div
                        key={index}
                        className={`border min-w-[90px] border-slate-300 p-1 cursor-pointer ${mainImage === img ? " border-gray-400 " : ""
                            }`}
                        onClick={() => setMainImage(img)}
                    >
                        <img
                            src={img}
                            className="w-20 h-20 object-cover"
                            alt={`Thumbnail ${index}`}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ItemGallery;
