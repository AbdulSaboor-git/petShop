//shop product card

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  MdDiscount,
  MdCircle,
  MdFavoriteBorder,
  MdFavorite,
} from "react-icons/md";

export default function ProductCardAlt({ item, favClick, isFav }) {
  const name = item.name.toUpperCase();
  const router = useRouter();
  const [hover, setHover] = useState(false);
  const defaultPic = "https://i.sstatic.net/5ykYD.png";

  function prodClick() {
    router.push(`/item/${item.id}`);
  }

  return (
    <div
      onClick={prodClick}
      className="mb-1 cursor-pointer max-w-[200px] min-w-[150px] overflow-hidden transition-all duration-300 ease-in-out relative rounded-xl"
    >
      {/* Product Image */}
      <div className="relative w-full pt-[100%]">
        <img
          src={item.images[0] || defaultPic}
          alt={name}
          draggable="false"
          className="absolute top-0 left-0 w-full h-full object-cover rounded-xl bg-transparent"
        />
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

      <div className="flex flex-col gap-0.5 pl-1 pt-2 relative">
        <div className="text-xs font-normal flex gap-1 items-center justify-start">
          {item.isDiscounted && (
            <div className=" text-green-600 text-[10px] font-extrabold min-w-[50px]">
              {(
                ((item.price - item.discountedPrice) * 100) /
                item.price
              ).toFixed(0)}
              {"% OFF"}{" "}
            </div>
          )}
          {hover && (
            <div className="w-full flex justify-center absolute -top-8 left-0">
              <div className="text-center text-[11px]  tracking-tight leading-tight text-white bg-[#00000093] shadow-md p-1 px-2 rounded-3xl">
                {item.name}
              </div>
            </div>
          )}

          <p
            className="text-[11px] md:text-xs truncate leading-tight tracking-tight"
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
          >
            {name}
          </p>
        </div>
        {/* <p className="text-xs text-gray-400 flex gap-1 items-center "> <MdCircle />  {item.breed}</p> */}
        <div className="flex justify-between items-center">
          <div className="flex gap-2 items-baseline font-Maston tracking-wider">
            <div className="flex gap-1 items-baseline -mt-1">
              <div className="text-xs md:text-sm font-semibold">Rs. </div>
              <div className="text-base md:text-lg  ">
                {item.isDiscounted ? item.discountedPrice : item.price}
              </div>
            </div>
            {item.isDiscounted && (
              <div className="text-[12px] text-gray-500 line-through ">
                Rs. {item.price}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
