import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { MdDiscount, MdCircle } from "react-icons/md";

export default function ProductCardAlt({ item }) {
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
      className="mb-1 cursor-pointer max-w-[200px] min-w-[150px] overflow-hidden transition-transform duration-300 ease-in-out relative rounded-xl"
    >
      {/* Product Image */}
      <div className="relative w-full pt-[100%]">
        <img
          src={item.images[0] || defaultPic}
          alt={name}
          draggable="false"
          className="absolute top-0 left-0 w-full h-full object-cover rounded-xl bg-transparent"
        />
      </div>

      <div className="flex flex-col gap-0.5 pl-1 pt-2 relative">
        <div className="text-xs font-normal flex gap-1 items-center truncate">
          {item.isDiscounted && (
            <div className="bg-red-600 text-white px-1 font-semibold flex gap-1 items-center">
              <span>Sale</span> <MdDiscount className="mt-[1.7px]" size={10} />
            </div>
          )}
          {hover && (
            <div className="w-full flex justify-center absolute -top-8 left-0">
              <div className=" text-center text-xs  text-white bg-[#00000093] shadow-md p-1 px-2 rounded-3xl">
                {item.name}
              </div>
            </div>
          )}
          <div
            className="truncate"
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
          >
            {name}
          </div>
        </div>
        {/* <p className="text-xs text-gray-400 flex gap-1 items-center "> <MdCircle />  {item.breed}</p> */}
        <div className="flex justify-between items-center">
          <div className="flex gap-2 items-baseline">
            <div className="flex gap-1 items-baseline -mt-1">
              <div className="text-xs md:text-sm font-semibold">Rs. </div>
              <div className="font-extrabold text-base md:text-lg  font-mono ">
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
