"use client";
import React, { useState } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { RiCircleFill, RiHeartFill } from "react-icons/ri";
import ItemGallery from "./components/itemGallery";
import { Favorite, FavoriteOutlined } from "@mui/icons-material";
import { FaHeart } from "react-icons/fa";
import { MdFavorite, MdFavoriteBorder } from "react-icons/md";

export default function ItemPage({ params }) {
  const prodId = params.prodId;

  // Example product data (replace this with a database fetch function)
  const item = {
    id: 1,
    name: "Black and White Chicken",
    breed: "Shamo",
    img: "/1.jpg",
    images: ["/1.jpg", "/3.jpg", "/2.jpg", "/1.jpg", "/3.jpg"], // Additional images
    price: 3000,
    discountedPrice: 1800,
    isDiscounted: true,
    weight: 2.2, // In kg
    height: 300, // In mm
    age: 1.3, // In years
    sex: "male",
    nature: "Aggressive but excellent for guarding",
    specifications: "Black and white colored feathers, strong build",
    type: "Breeding and show bird",
    availability: "In Stock",
    description:
      "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Nihil aperiam, ab obcaecati molestias ex accusamus sapiente vitae? Quidem eligendi, ipsam quibusdam velit et at recusandae. Numquam excepturi consequatur soluta laboriosam. Omnis, tenetur a. Provident aut aliquam, minima sint adipisci vitae consectetur dolores aliquid et placeat reprehenderit magnam praesentium officiis reiciendis aperiam? Rem vero fuga quo, ratione ex maxime non assumenda.",
  };

  return (
    <div className="flex flex-col items-center gap-10">
      <Header />
      <div className="flex flex-col gap-10 max-w-[1400px] w-full px-4">
        <div className="flex flex-col justify-center md:flex-row w-full gap-4">
          {/* Image Section */}
          <div className="flex flex-col gap-2 md:gap-3 w-full md:w-2/3 md:max-w-[650px]">
            <ItemGallery item={item} />
          </div>

          {/* Product Details Section */}
          <div className="flex flex-col h-auto w-full md:w-1/3 md:px-4 gap-1 text-gray-700">
            <p className="text-green-600 text-sm md:text-base font-semibold mt-2 mx-0.5">
              {Math.round(100 - (item?.discountedPrice / item?.price) * 100)}%
              Discount
            </p>
            <p className="text-2xl md:text-3xl font-bold ">{item?.name}</p>

            <div className="my-3 mx-1">
              <p className="text-slate-400 text-sm mx-1">
                People interested: 3
              </p>{" "}
              {/* to be updated */}
              <ul className="text-base md:text-lg my-3 mx-1">
                <p className="font-bold">
                  Breed:{" "}
                  <span className="font-normal text-slate-600 ">
                    {item.breed}
                  </span>
                </p>
                <p className="font-bold">
                  Height:{" "}
                  <span className="font-normal text-slate-600">
                    {item.height} cm
                  </span>
                </p>
                <p className="font-bold">
                  Weight:{" "}
                  <span className="font-normal text-slate-600">
                    {item.weight} kg
                  </span>
                </p>
                <p className="font-bold">
                  Age:{" "}
                  <span className="font-normal text-slate-600">
                    {item.age} years
                  </span>
                </p>
                <p className="font-bold">
                  Sex:{" "}
                  <span className="font-normal text-slate-600">{item.sex}</span>
                </p>
                <p className="font-bold">
                  Type:{" "}
                  <span className="font-normal text-slate-600">
                    {item.type}
                  </span>
                </p>
                <p className="font-bold">
                  Nature:{" "}
                  <span className="font-normal text-slate-600">
                    {item.nature}
                  </span>
                </p>
                <p className="font-bold">
                  Availability:{" "}
                  <span
                    className={`font-normal text-slate-600 ${
                      item.availability === "In Stock"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {item.availability}{" "}
                  </span>
                </p>
              </ul>
            </div>
            <div className="flex flex-col gap-5">
              <div className="text-[32px] md:text-[36px] text-orange-600">
                {!item?.isDiscounted && <p>Rs. {item?.price}</p>}
                {item?.isDiscounted && (
                  <div>
                    <p>Rs. {item?.discountedPrice}</p>
                    <p className="text-[16px] md:text-[20px]  line-through text-gray-500">
                      Rs. {item?.price}
                    </p>
                  </div>
                )}
              </div>

              <div>
                <button className="bg-[#8a5e2f] hover:bg-[#644321] text-white py-2 px-4 rounded-full w-full text-base md:text-lg">
                  Buy Now
                </button>
                <button className="flex  items-center justify-center gap-2 border border-orange-600 text-orange-600 py-2 px-4 rounded-full w-full mt-2 text-base md:text-lg hover:bg-orange-500 hover:border-orange-500 hover:text-white">
                  Add to Wishlist
                  <MdFavoriteBorder />
                </button>
              </div>
            </div>
          </div>
        </div>
        <div>{item.description}</div>
      </div>
      <Footer />
    </div>
  );
}
