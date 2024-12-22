"use client";
import React, { useState } from "react";

export default function OrderObj({ order }) {
  const [showItems, setShowItems] = useState(false);

  const toggleItems = () => {
    setShowItems(!showItems);
  };

  return (
    <div className="flex flex-col gap-4 p-4 border-t-2 bg-yellow-100  border-gray-200 rounded-lg shadow-md shadow-gray-300">
      <div className="flex justify-between items-center">
        <div className="text-base text-slate-800">Order ID: {order.id}</div>
        <div className="text-sm text-slate-600">
          Order Date: {new Date(order.date).toLocaleDateString()}
        </div>
      </div>
      <div className="flex justify-between items-center">
        <div className="text-lg font-semibold text-slate-800">
          Total: {order.total} PKR
        </div>
        <div className={`text-sm`}>
          Status:{" "}
          <span
            className={`font-semibold ${
              order.status === "Processing"
                ? "text-yellow-500"
                : "text-green-500"
            }`}
          >
            {order.status}
          </span>
        </div>
      </div>
      <button
        className="text-sm text-blue-500 hover:underline mt-2"
        onClick={toggleItems}
      >
        {showItems ? "Hide Items" : "Show Items"}
      </button>
      {showItems && (
        <div className="flex flex-col gap-2 mt-2">
          <h3 className="text-md font-semibold text-slate-800">Items:</h3>
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
      )}
    </div>
  );
}
