"use client";
import { useRouter } from "next/navigation";
import React from "react";
import { FaTrashAlt } from "react-icons/fa";

export default function CartItem({ item, selectedItems, handleSelectItem }) {
  const router = useRouter();
  return (
    <div
      key={item.id}
      className="flex flex-col md:flex-row items-center border p-4 rounded-lg bg-gray-50"
    >
      <div className="flex items-center w-full md:w-auto">
        <input
          type="checkbox"
          checked={selectedItems.includes(item.id)}
          onChange={() => handleSelectItem(item.id)}
          className="mr-4"
        />
        <img
          src={item.img}
          alt={item.name}
          className="w-24 h-24 object-cover rounded-lg mb-2 md:mb-0"
        />
      </div>
      <div className="flex flex-col flex-1 ml-4">
        <h3 className="text-lg font-bold">{item.name}</h3>
        <p className="text-gray-600">{item.price} PKR</p>
      </div>
      <button
        className="text-red-500 hover:text-red-700 ml-4"
        onClick={() => handleSelectItem(item.id)}
      >
        <FaTrashAlt />
      </button>
    </div>
  );
}
