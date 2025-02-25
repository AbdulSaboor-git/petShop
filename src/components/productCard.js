import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { MdDiscount, MdFavorite, MdFavoriteBorder } from "react-icons/md";
import { useState } from "react";
import { FaHeart } from "react-icons/fa";

export default function ProductCard({ item, favClick, isFav, alt }) {
  const name = item.name.toUpperCase();
  const router = useRouter();
  const [nameHover, setNameHover] = useState(false);
  const defaultPic = "https://i.sstatic.net/5ykYD.png";

  function prodClick() {
    router.push(`/item/${item.id}`);
  }

  return (
    <div
      onClick={prodClick}
      className={`cursor-pointer min-w-[160px] max-w-[215px]  shadow-md overflow-hidden transform transition-transform duration-300 ease-in-out
         md:hover:shadow-lg md:hover:scale-105  mx-auto  ${
           alt ? "my-0 rounded-lg w-[150px] md:w-[180px]" : "my-4 rounded-3xl"
         } `}
    >
      <div className="relative w-full pt-[100%] ">
        <img
          src={item.images[0] || defaultPic}
          draggable="false"
          alt={name}
          className="absolute top-0 left-0 w-full aspect-square h-full object-cover bg-white"
        />
        {/* <div className="absolute h-[25%] -bottom-[0.2px] w-full bg-gradient-to-b from-transparent to-[#ffffff] "></div> */}
        <button
          className="absolute bottom-1 right-1 text-white p-1 rounded-full bg-gradient-to-br  from-orange-500 via-orange-500 to-orange-700 hover:bg-gradient-radial text-base drop-shadow-sm"
          onClick={(e) => {
            e.stopPropagation(); // Prevent the click from bubbling up
            favClick(); // Execute the favorite toggle logic
          }}
        >
          {!isFav ? <MdFavoriteBorder /> : <MdFavorite />}
        </button>
      </div>

      <div className="flex flex-col gap-0 p-4 pt-2 relative">
        {nameHover && (
          <div className="w-full flex justify-center absolute -top-8 left-0 z-50">
            <div className=" text-center text-[11px] leading-tight  tracking-tight  text-white bg-[#00000093] shadow-md p-1 px-2 rounded-3xl">
              {item.name.toUpperCase()}
            </div>
          </div>
        )}
        <div className="text-xs tracking-tight font-normal flex gap-2 items-center justify-start">
          {item.isDiscounted && (
            <div className="text-[10px] tracking-tight font-extrabold text-green-600">
              {(
                ((item.price - item.discountedPrice) * 100) /
                item.price
              ).toFixed(0)}
              {"% OFF"}
            </div>
          )}
          <p
            className="font-bold text-orange-600 truncate"
            onMouseEnter={() => setNameHover(true)}
            onMouseLeave={() => setNameHover(false)}
          >
            {name}
          </p>
        </div>
        {/* <p className="text-xs text-gray-500"> {item.breed}</p> */}
        <div className="flex justify-between items-center">
          <div className="flex gap-2 items-end">
            <div className="flex gap-1 items-end ">
              <div className="text-xs pb-1 leading-tight">Rs.</div>
              <div className="text-lg font-Maston tracking-wider ">
                {item.isDiscounted ? item.discountedPrice : item.price}
              </div>
            </div>
            {item.isDiscounted && (
              <div className="text-[10px] pb-1 text-gray-500 line-through">
                Rs. {item.price}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
