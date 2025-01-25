"use client";
import React, { useEffect, useState } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { RiCircleFill, RiHeartFill } from "react-icons/ri";
import ItemGallery from "./components/itemGallery";
import { Favorite, FavoriteOutlined } from "@mui/icons-material";
import { FaHeart } from "react-icons/fa";
import { MdFavorite, MdFavoriteBorder } from "react-icons/md";

export default function ItemPage({ params }) {
  const itemId = params.itemId;
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const defaultPic =
    "https://lh3.googleusercontent.com/pw/AP1GczM2cnSQPHG8oKKskeSFKCFjs3z_NG31Tt4bQPqb4Fp-Qdteh0m-84BjSvDgQTkscceDPu1eD1Rs2OxUSd0InRuqnowixs1x8kqSVIcu_7BbkBi4XFK13ZqIeq56OxPw0bzq0hoUgYtTHteuYB1cTI-K=w883-h883-s-no-gm";

  useEffect(() => {
    const fetchItemData = async () => {
      try {
        const response = await fetch(`/api/item/${itemId}`);
        if (!response.ok) {
          throw new Error("Item not found");
        }
        const data = await response.json();
        setItem(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchItemData();
  }, [itemId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!item) return <div>Item not found</div>;

  return (
    <div className="flex flex-col items-center md:gap-10">
      <Header />
      <div className="flex flex-col gap-10 max-w-[1200px] w-full px-4">
        <div className="flex flex-col justify-start md:flex-row w-full gap-4">
          {/* Image Section */}
          <div className="flex flex-col gap-2 md:gap-3 w-full md:w-2/3 md:max-w-[500px]">
            <ItemGallery item={item} />
          </div>

          {/* Product Details Section */}
          <div className="flex flex-col h-auto w-full md:w-2/3 md:max-w-1/3 md:px-4 gap-1 text-gray-700">
            {item.isDiscounted && (
              <p className="text-green-600 text-sm md:text-base font-semibold mt-2 mx-0.5">
                {Math.round(100 - (item?.discountedPrice / item?.price) * 100)}%
                Discount
              </p>
            )}
            <p className="text-2xl mx-1 md:text-3xl font-bold ">{item?.name}</p>

            <div className="bg-gray-100 p-3 rounded-2xl md:bg-transparent md:p-0">
              <ul className="text-base md:text-lg mx-1">
                {item.breed && (
                  <p className="font-bold">
                    Breed:{" "}
                    <span className="font-normal text-slate-600 ">
                      {item.breed}
                    </span>
                  </p>
                )}
                {item.height && (
                  <p className="font-bold">
                    Height:{" "}
                    <span className="font-normal text-slate-600">
                      {item.height} cm
                    </span>
                  </p>
                )}
                {item.weight && (
                  <p className="font-bold">
                    Weight:{" "}
                    <span className="font-normal text-slate-600">
                      {item.weight} g
                    </span>
                  </p>
                )}
                {item.age && (
                  <p className="font-bold">
                    Age:{" "}
                    <span className="font-normal text-slate-600">
                      {item.age} years
                    </span>
                  </p>
                )}
                {item.sex && (
                  <p className="font-bold">
                    Gender:{" "}
                    <span className="font-normal text-slate-600">
                      {item.sex}
                    </span>
                  </p>
                )}
                {item.specifications && (
                  <p className="font-bold">
                    Specifications:{" "}
                    <span className="font-normal text-slate-600">
                      {item.specifications}
                    </span>
                  </p>
                )}
                {item.nature && (
                  <p className="font-bold">
                    Nature:{" "}
                    <span className="font-normal text-slate-600">
                      {item.nature}
                    </span>
                  </p>
                )}
                <p className="font-bold">
                  Availability:{" "}
                  <span
                    className={`font-normal ${
                      item.availability ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {item.availability ? "Available" : "Not Available"}{" "}
                  </span>
                </p>
              </ul>
            </div>
            <div className="flex flex-col ">
              <div className="my-2 mx-1 text-[28px] md:text-[34px] font-bold text-orange-600">
                {!item?.isDiscounted && (
                  <p>
                    {" "}
                    <span className="text-[22px] md:text-[28px]"> Rs. </span>
                    {item?.price}
                  </p>
                )}
                {item?.isDiscounted && (
                  <div className="flex flex-row gap-4 items-end">
                    <p>
                      <span className="text-[22px] md:text-[28px]"> Rs. </span>{" "}
                      {item?.discountedPrice}
                    </p>
                    <p className="mb-1.5 text-[16px] md:text-[20px]  line-through  decoration-red-500 text-gray-500">
                      Rs. {item?.price}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex flex-col md:flex-row gap-2">
                <button className="bg-[#8a5e2f] hover:bg-[#644321] text-white py-2 px-4 rounded-full w-full text-base md:text-lg">
                  Conatct Seller
                </button>
                <button className="flex  items-center justify-center gap-2 border border-orange-600 text-orange-600 py-2 px-4 rounded-full w-full text-base md:text-lg hover:bg-orange-500 hover:border-orange-500 hover:text-white">
                  Add to Favourites
                  <MdFavoriteBorder size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
        <div>{item.description}</div>
        <div className="w-full flex gap-3 items-center justify-start bg-gray-100 p-2 md:bg-transparent md:p-0 rounded-2xl">
          <img
            src={
              item.seller.profilePicture
                ? item.seller.profilePicture
                : defaultPic
            }
            alt="seller img"
            draggable="false"
            className="rounded-xl border p-1 bg-white border-gray-300 w-14 md:w-16 object-cover aspect-square overflow-hidden"
          />
          <div className="font-bold text-sm md:text-base ">
            {item.seller.firstName} {item.seller.lastName}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
