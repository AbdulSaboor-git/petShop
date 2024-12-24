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
      className={`flex items-center relative bg-gray-100 border border-slate-200 p-2 rounded-lg  shadow-[#0000002d] ${
        !item.availability && "opacity-65 border-slate-300 shadow-[#00000050]"
      }`}
    >
      <div
        className={`w-full left-0 absolute h-full bg-black cursor-pointer opacity-0 rounded-lg ${
          !item.availability && "opacity-10 cursor-context-menu "
        }`}
        onClick={() => itemClick(item.availability)}
      ></div>
      <div className={`w-fit max-w-[76px] md:max-w-24 `}>
        <img src={item.img} alt={item.name} className={`rounded-lg`} />
      </div>
      <div className="flex justify-between items-center gap-4 px-3 w-full ">
        <div className="text-sm md:text-base flex flex-col ">
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
