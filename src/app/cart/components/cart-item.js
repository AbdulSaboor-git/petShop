"use client"
import { useRouter } from "next/navigation";
import React from "react";


export default function WishListItem({ item }) {
    const router = useRouter();
    function itemClick(available) {
        available &&
            router.push(`/product/${item.id}`);
    }
    return (
        <div className={`flex border-2 pr-4 items-center ${!item.availability && 'opacity-55'}`}>
            <div className={`w-fit max-w-32 cursor-pointer`}>
                <img src={item.img} alt={item.name} onClick={itemClick(item.availability)} />
            </div>
            <div className="flex justify-start gap-4 w-full ">
                <div className="flex flex-[3] flex-col p-3">
                    <div className={`font-bold text-slate-800 text-sm md:text-lg '}`}>
                        {item.name}
                    </div>
                    <div className="flex flex-col ">
                        <p>
                            {item.breed}
                        </p>
                        <p className="text-green-700">
                            {item.isDiscounted ? item.discountedPrice : item.price}{" PKR"}
                        </p>
                    </div>
                </div>
                <button className={`bg-orange-600 hover:bg-orange-700 self-center text-sm md:text-base text-white p-3 rounded-2xl ${!item.availability && 'bg-red-700 hover:bg-red-700 cursor-not-allowed'}`}>{item.availability ? "Buy Now" : "Sold Out"}</button>
            </div>
        </div>
    )
}