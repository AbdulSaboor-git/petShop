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
    <div
      className={`flex flex-col gap-1 p-4 pb-2 bg-white rounded-lg transition-all duration-300 cursor-pointer ${
        showItems && "pointer-events-none cursor-default"
      }`}
      onClick={toggleItems}
    >
      <div className="flex flex-col gap-0.5 -mb-2 sm:mb-0 sm:flex-row sm:justify-between sm:items-center ">
        <div className="flex gap-2 items-center text-xs md:text-sm font-light text-slate-700">
          Order No: {order.id}{" "}
          <span>
            <div
              className={`text-xs text-white flex items-center rounded-full font-semibold transition-all duration-500 ${
                order.status === "Processing"
                  ? "bg-yellow-500 animate-pulse"
                  : order.status === "Completed"
                  ? "bg-green-500"
                  : "bg-red-500"
              }
              ${showItems ? "px-2 w-full" : "w-2"}
              `}
            >
              <div
                className={`${
                  showItems ? "opacity-100" : "opacity-0"
                } transition-all duration-500`}
              >
                {order.status}
              </div>
            </div>
          </span>
        </div>
        <div className="text-xs md:text-sm text-slate-700">
          Total:{" "}
          <span className="font-bold text-green-800">Rs. {order.total}</span>
        </div>
      </div>
      <div
        className={`flex flex-col gap-0.5 transition-all duration-500 ${
          showItems
            ? "mt-6 max-h-screen opacity-100"
            : "-mt-3 max-h-0 opacity-0"
        } overflow-hidden`}
      >
        <h3 className="text-xs md:text-sm text-gray-700">
          <span className="font-bold"> Order Date:</span>{" "}
          {new Date(order.date).toLocaleDateString()}
        </h3>
        <h3 className="text-xs md:text-sm text-gray-700">
          <span className="font-bold"> Total Items:</span> {order.items.length}
        </h3>
        <h3 className="text-xs md:text-sm text-gray-700 mt-4 mb-1 font-bold">
          Items:
        </h3>
        <div className="flex flex-col gap-2">
          {order.items.map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-4 bg-gray-100 p-2 border rounded-lg"
            >
              <img
                src={item.img}
                alt={item.name}
                className=" w-14 md:w-16  object-cover rounded-lg"
              />
              <div className="flex flex-col">
                <span className="text-xs md:text-sm font-semibold text-slate-800 leading-tight line-clamp-2 ">
                  {item.name}
                </span>
                <span className="text-[11px] md:text-[13px] text-slate-600">
                  {item.breed}
                </span>
                <span className="text-[11px] md:text-[13px] text-green-600">
                  Rs. {item.price}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <button
        className="place-items-center w-full mt-4 text-gray-500 w rounded-lg pointer-events-auto"
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
