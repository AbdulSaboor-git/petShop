"use client";
import { useRouter } from "next/navigation";
import React from "react";
import { FaTrashAlt } from "react-icons/fa";

export default function CartItem({
  item,
  selectedItems,
  handleSelectItem,
  handleDeleteItem,
}) {
  const router = useRouter();
  function itemClick() {
    router.push(`/product/${item.id}`);
  }
  return (
    <div
      key={item.id}
      className="flex justify-between items-center border p-3 rounded-lg bg-gray-100"
    >
      <div className="flex gap-4 items-center w-full">
        <input
          type="checkbox"
          checked={selectedItems.includes(item.id)}
          onChange={() => handleSelectItem(item.id)}
          className="accent-orange-600 size-3 md:size-4 -mr-1"
        />
        <img
          src={item.img}
          alt={item.name}
          className="w-16 md:w-24 object-cover rounded-lg cursor-pointer"
          onClick={itemClick}
        />
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
      </div>
      <button
        className="text-red-500 hover:text-red-600 h-fit"
        onClick={() => handleDeleteItem(item.id)}
      >
        <FaTrashAlt />
      </button>
    </div>
  );
}
