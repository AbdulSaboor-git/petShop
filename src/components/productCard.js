import React from "react";
import { useRouter } from "next/navigation";
import { MdDiscount } from "react-icons/md";
import { useState } from "react";

export default function ProductCard({ item }) {
    const name = item.name.toUpperCase();
    const router = useRouter();
    const [hover, setHover] = useState(false);

    function prodClick() {
        router.push(`/product/${item.id}`);
    }

    return (
        <div
            onClick={prodClick}
            className="cursor-pointer max-w-[220px]  min-w-[160px] sm:max-w-[200px] sm:min-w-[140px] rounded-3xl shadow-md overflow-hidden transform transition-transform duration-300 ease-in-out md:hover:shadow-lg md:hover:scale-105  mx-auto my-4 "
        >
            <div className="relative w-full pt-[100%] ">
                <img
                    src={item.img}
                    alt={name}
                    className="absolute top-0 left-0 w-full h-full object-cover bg-white"
                />
                <div className="absolute h-[50%] top-[51%] w-full z-20 bg-gradient-to-b from-transparent via-[#ffffff49] to-white"></div>
                {item.isDiscounted && (
                    <div className="absolute top-0 right-5 bg-red-600 p-1 text-xs font-bold text-white rounded-b-md flex items-center gap-1">
                        SALE <MdDiscount />
                    </div>
                )}
            </div>

            <div className="flex flex-col gap-0.5 p-4 pt-2 relative">
                {hover && (
                    <div className="w-full flex justify-center absolute -top-8 left-0 z-50">
                        <div
                            className=" text-center text-xs  text-white bg-[#00000093] shadow-md p-1 px-2 rounded-3xl"
                        >
                            {item.name}
                        </div>
                    </div>
                )}
                <p className="text-xs font-bold text-orange-600 truncate" onMouseEnter={() => setHover(true)}
                    onMouseLeave={() => setHover(false)}>{name}</p>
                {/* <p className="text-xs text-gray-500"> {item.breed}</p> */}
                <div className="flex justify-between items-center">
                    <div className="flex gap-2 items-end">
                        <div className="flex gap-1 items-end font-mono">
                            <div className="text-[10px] pb-1">PKR</div>
                            <div className="font-extrabold text-lg">
                                {item.isDiscounted ? item.discountedPrice : item.price}
                            </div>
                        </div>
                        {item.isDiscounted && (
                            <div className="text-[10px] pb-1 text-gray-500 line-through">
                                PKR {item.price}
                            </div>
                        )}
                    </div>
                </div>
                {/* Uncomment if Add to Cart button is needed */}
                {/* <button 
          className="bg-orange-500 text-white rounded-full px-4 py-2 flex items-center gap-2 mt-4 hover:bg-orange-600"
        >
          Add to Cart <FaCartPlus />
        </button> */}
            </div>
        </div>
    );
}