import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function ProductCardAlt({ item, alt }) {
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
      className={`mb-1 cursor-pointer bg-white ${
        alt ? "min-w-[170px] max-w-[170px] " : "min-w-[150px] max-w-[200px] "
      } overflow-hidden transition-all duration-300 ease-in-out relative rounded-xl`}
    >
      {/* Product Image */}
      <div className="relative w-full pt-[100%]">
        <img
          src={item.images[0] || defaultPic}
          alt={name}
          draggable="false"
          className="absolute top-0 left-0 w-full h-full object-cover bg-transparent"
        />
      </div>

      <div className="flex flex-col gap-1 p-2 px-3 relative">
        <div className="text-xs font-normal flex gap-1 items-center justify-start">
          {item.isDiscounted && (
            <div className=" text-green-600 text-[10px] font-extrabold">
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
  );
}
