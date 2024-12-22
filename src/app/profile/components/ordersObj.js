"use client";
import { useRouter } from "next/navigation";
import React from "react";

export default function OrderObj({ item }) {
  return (
    <div
      className={`flex pr-4 items-center relative ${
        !item.availability && "opacity-60"
      }`}
    >
      <div
        className={`w-full absolute h-full bg-slate-800 opacity-0 ${
          !item.availability && "opacity-15"
        }`}
      ></div>
      <div className={`w-fit max-w-[76px] md:max-w-24 cursor-pointer`}>
        <img src={item.img} alt={item.name} />
      </div>
      <div className="flex gap-4 px-3 justify-between items-center w-full">
        <div className="flex flex-col gap-1">
          <div className="text-[10px] md:text-xs opacity-75 ">
            Order No. {item.price}
          </div>
          <div className="flex gap-4 justify-between w-full">
            <div className="flex flex-col">
              <div
                className={`font-bold text-slate-800 text-sm md:text-base leading-tight line-clamp-2 '}`}
              >
                {item.name}
              </div>
              <div
                className={`font-light text-slate-600 text-sm md:text-base '}`}
              >
                {item.breed}
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col min-w-fit text-sm md:text-base">
          Total
          <p className="font-bold text-green-700">
            {item.isDiscounted ? item.discountedPrice : item.price}
            {" PKR"}
          </p>
        </div>
      </div>
    </div>
  );
}
