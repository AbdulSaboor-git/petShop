"use client";
import React, { useState } from "react";
import { MdCircle } from "react-icons/md";
import { RiArrowDownSLine, RiArrowUpSLine } from "react-icons/ri";

export default function OrderObj({ order }) {
  const [showItems, setShowItems] = useState(false);

  const toggleItems = () => {
    setShowItems(!showItems);
  };

  return (
    <div className="flex flex-col gap-1 p-4  bg-[#fff] rounded-lg shadowshadow-[#0000002d] transition-all duration-300">
      <div className="flex flex-col gap-0.5 -mb-2 sm:mb-0 sm:flex-row sm:justify-between sm:items-center ">
        <div className="flex gap-2 items-center text-xs md:text-sm font-light text-slate-700">
          Order No: {order.id}{" "}
          <span
            className={`text-xs font-semibold transition-all duration-600 ${
              order.status === "Processing"
                ? "text-yellow-500 animate-pulse"
                : order.status === "Completed"
                ? "text-green-500"
                : "text-red-500"
            }`}
          >
            <div className="flex items-center gap-2">
              <MdCircle size={10} />
              <div
                className={` transition-all duration-300 ${
                  showItems ? "ml-0 opacity-100" : "-ml-3 opacity-0"
                }`}
              >
                {order.status}
              </div>
            </div>
          </span>
        </div>
        <div className="text-xs md:text-sm text-slate-700">
          Total: <span className="font-bold">{order.total} PKR</span>
        </div>
      </div>
      <div
        className={`flex flex-col gap-0.5 mt-6 transition-all duration-300 ${
          showItems ? "mt-6 max-h-screen opacity-100" : "mt-0 max-h-0 opacity-0"
        } overflow-hidden`}
      >
        <h3 className="text-xs md:text-sm text-gray-700">
          Order Date: {new Date(order.date).toLocaleDateString()}
        </h3>
        <h3 className="text-xs md:text-sm text-gray-700">
          Total Items: {order.items.length}
        </h3>
        <h3 className="text-xs md:text-sm text-gray-700 mt-2 mb-1">Details:</h3>
        {order.items.map((item, index) => (
          <div key={index} className="flex items-center gap-4">
            <img
              src={item.img}
              alt={item.name}
              className="w-16 h-16 object-cover rounded-lg"
            />
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-slate-800">
                {item.name}
              </span>
              <span className="text-sm text-slate-600">
                Breed: {item.breed}
              </span>
            </div>
          </div>
        ))}
      </div>
      <button
        className="self-center text-gray-500 px-1 -mb-2 w-fit rounded-lg"
        onClick={toggleItems}
      >
        <RiArrowDownSLine
          size={20}
          className={` transition-all duration-300 ${
            showItems ? " opacity-0 max-h-0" : "opacity-100"
          }`}
        />

        <RiArrowUpSLine
          size={20}
          className={` transition-all duration-300  ${
            showItems ? " opacity-100" : "opacity-0 max-h-0"
          }`}
        />
      </button>
    </div>
  );
}
