"use client";
import { useRouter } from "next/navigation";
import React from "react";

export default function WishListItem({ item }) {
  const router = useRouter();
  function itemClick(available) {
    available && router.push(`/product/${item.id}`);
  }

  function addToCart() {}
  return (
    <div
      className={`flex items-center relative border-t-2 border-gray-200 rounded-lg shadow-md shadow-gray-300 ${
        !item.availability && "opacity-70"
      }`}
    >
      <div
        className={`w-full absolute h-full bg-black cursor-pointer opacity-0 rounded-lg ${
          !item.availability && "opacity-15 cursor-default"
        }`}
        onClick={() => itemClick(item.availability)}
      ></div>
      <div className={`w-fit max-w-[76px] md:max-w-24 `}>
        <img src={item.img} alt={item.name} className={`rounded-s-lg`} />
      </div>
      <div className="flex justify-between items-center gap-4 px-3 w-full ">
        <div className="flex flex-col gap-1">
          <div
            className={`font-bold text-slate-800 text-sm md:text-base leading-tight line-clamp-2 '}`}
          >
            {item.name}
          </div>
          <div className="flex flex-col text-xs md:text-base">
            <p className="text-green-700">
              {item.isDiscounted ? item.discountedPrice : item.price}
              {" PKR"}
            </p>
          </div>
        </div>
        <button
          onClick={addToCart}
          className={`z-20 min-w-fit bg-orange-600 hover:bg-orange-700 self-center text-xs md:text-sm text-white p-2 px-4 rounded-2xl ${
            !item.availability &&
            "bg-red-700 hover:bg-red-700 cursor-not-allowed"
          }`}
        >
          {item.availability ? "Add to Cart" : "Sold Out"}
        </button>
      </div>
    </div>
  );
}
