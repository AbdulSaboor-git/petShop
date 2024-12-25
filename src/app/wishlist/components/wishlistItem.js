"use client";
import { FavoriteBorderOutlined, FavoriteOutlined } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import React from "react";
import { FaCartPlus } from "react-icons/fa";

export default function WishListItem({ item }) {
  const [isFav, setIsFav] = React.useState(false);
  const router = useRouter();
  function itemClick() {
    router.push(`/product/${item.id}`);
  }

  const removeFav = () => {
    setIsFav(!isFav);
    //notify
  };
  const addToCart = () => {};

  return (
    <div
      className={`flex gap-2 justify-between items-center border p-2 rounded-lg bg-gray-100 ${
        !item.availability
          ? "bg-[#00000025] opacity-65 border-gray-300 pointer-events-none"
          : "bg-white pointer-events-auto"
      }`}
    >
      <div className={`w-fit max-w-[76px] md:max-w-24 `} onClick={itemClick}>
        <img
          src={item.img}
          alt={item.name}
          className={`rounded-lg cursor-pointer`}
        />
      </div>
      <div className="flex justify-between items-center gap-4 px-3 w-full ">
        <div className="text-sm md:text-base flex flex-col ">
          {!item.availability && (
            <p className="text-[10px] md:text-xs text-red-600">Unavailable</p>
          )}
          <h3
            className="font-bold cursor-pointer leading-tight line-clamp-2 "
            onClick={itemClick}
          >
            {item.name}
          </h3>
          <p className="text-xs md:text-sm text-gray-600">{item.breed} </p>
          <p className="text-xs md:text-sm text-green-600">Rs. {item.price} </p>
        </div>
        <button
          onClick={removeFav}
          className={`z-20 pointer-events-auto min-w-fit self-center text-xs md:text-sm text-red-500 p-2 px-4 rounded-2xl`}
        >
          {!isFav ? <FavoriteOutlined /> : <FavoriteBorderOutlined />}
        </button>
      </div>
    </div>
  );
}
