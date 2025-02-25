"use client";
import { useRouter } from "next/navigation";
import React from "react";
import { FaTrashAlt } from "react-icons/fa";
import { MdFavorite } from "react-icons/md";

export default function FavItem({
  item,
  handleSelectItem,
  handleRemoveFav,
  isSelected,
}) {
  const router = useRouter();
  function itemClick() {
    router.push(`/item/${item.id}`);
  }
  return (
    <div
      key={item.id}
      className={`flex gap-2 w-full justify-between items-center border p-3 px-5 rounded-lg ${
        !item.availability === "AVAILABLE"
          ? "bg-[#00000025] opacity-100 border-gray-200 pointer-events-none"
          : " bg-gray-50 pointer-events-auto"
      }`}
    >
      <div
        className={`flex gap-4 items-center w-full
        ${item.availability !== "AVAILABLE" && "opacity-65"}`}
      >
        <input
          type="checkbox"
          disabled={item.availability !== "AVAILABLE"}
          checked={isSelected}
          onChange={() => handleSelectItem(item)}
          className="accent-orange-600 size-4"
        />
        <img
          src={item.images[0]}
          alt={item.name}
          className="w-16 md:w-24 object-cover aspect-square rounded-lg cursor-pointer"
          onClick={itemClick}
        />

        <div
          className="text-[13px] md:text-base cursor-pointer flex flex-col gap-[1px] items-start"
          onClick={itemClick}
        >
          {item.availability !== "AVAILABLE" && (
            <p className="text-[10px] md:text-xs text-red-600">UNAVAILABLE</p>
          )}
          <h3 className="font-bold leading-tight  tracking-tight line-clamp-2 ">
            {item.name}
          </h3>
          <p className="text-xs md:text-sm text-gray-600">
            {item.breed?.name}{" "}
          </p>
          <p className="text-xs md:text-sm text-green-600">
            {" "}
            Rs. {item.isDiscounted ? item.discountedPrice : item.price}{" "}
          </p>
        </div>
      </div>
      <button
        className={`z-30 items-center text-sm md:text-base  text-orange-600 hover:text-orange-700  cursor-pointer pointer-events-auto
             `}
        onClick={() => handleRemoveFav(item.id)}
      >
        <MdFavorite size={20} />
      </button>
    </div>
  );
}
