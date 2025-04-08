import React from "react";
import { MdStore } from "react-icons/md";
import { RiArrowRightSLine } from "react-icons/ri";

export default function DetailsLoader() {
  return (
    <div className="flex flex-col gap-2.5 md:gap-4">
      <div className="bg-gray-100 p-3 px-4 rounded-2xl md:bg-transparent md:p-0 flex flex-col gap-1">
        <p className="animate-pulse w-fit text-sm md:text-base font-bold text-transparent bg-gradient-to-br from-gray-400 via-gray-300 to-gray-400 rounded-full">
          ITEM NAME HEHE...jkasdnak jk
        </p>
        <p className="animate-pulse text-transparent text-sm md:text-base rounded-full bg-gradient-to-br from-gray-400 via-gray-300 to-gray-400 w-fit">
          breed name
        </p>
        <div className="animate-pulse text-sm md:text-base font-Maston tracking-wider font-bold text-transparent bg-gradient-to-br from-gray-400 via-gray-300 to-gray-400 rounded-full w-fit">
          Rs. 000000
        </div>
      </div>
      <div className="bg-gray-100 p-3 px-4 rounded-2xl md:bg-transparent md:p-0 flex flex-col gap-1">
        <p className="animate-pulse w-fit text-sm md:text-base font-bold text-transparent bg-gradient-to-br from-gray-400 via-gray-300 to-gray-400 rounded-full">
          ITEM NAME HEHE...jkasdnak jk
        </p>
        <p className="animate-pulse w-fit text-sm md:text-base font-bold text-transparent bg-gradient-to-br from-gray-400 via-gray-300 to-gray-400 rounded-full">
          ITEM NAME HEHE...jkasdnak jk
        </p>
        <p className="animate-pulse w-fit text-sm md:text-base font-bold text-transparent bg-gradient-to-br from-gray-400 via-gray-300 to-gray-400 rounded-full">
          ITEM NAME HEHE...jkasdnak jk
        </p>
        <p className="animate-pulse w-fit text-sm md:text-base font-bold text-transparent bg-gradient-to-br from-gray-400 via-gray-300 to-gray-400 rounded-full">
          ITEM NAME HEHE...jkasdnak jk
        </p>
      </div>
      <div className="mt-5 flex flex-col gap-2">
        <p className="animate-pulse w-fit text-base font-bold text-transparent bg-gradient-to-br from-gray-400 via-gray-300 to-gray-400 rounded-full">
          ITEM NAME HEHE...
        </p>
        <div className="h-52 bg-gradient-to-br from-gray-400 via-gray-300 to-gray-400 animate-pulse w-full rounded-2xl"></div>
      </div>
      <div className="mt-5 w-full max-w-[400px] transition-all duration-300 bg-gray-100 p-2 rounded-2xl flex gap-3 items-center justify-start">
        <div className="rounded-xl border p-1 bg-gray-300 border-gray-300 w-16 md:w-[70px] aspect-square overflow-hidden" />
        <div className="w-full flex gap-2 justify-between items-center">
          <div className="font-semibold rounded-full   text-sm text-transparent bg-gradient-to-br from-gray-400 via-gray-300 to-gray-400 truncate">
            Seller Name jkasnosak
          </div>
          <div className="flex gap-1">
            <MdStore size={18} />
            <RiArrowRightSLine size={18} />
          </div>
        </div>
      </div>
    </div>
  );
}
