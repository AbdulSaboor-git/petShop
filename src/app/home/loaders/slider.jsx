import React from "react";
import { MdArrowForward, MdMessage } from "react-icons/md";
import Slider from "react-slick";

export default function SliderLoader() {
  return (
    <div>
      <div className="flex flex-col bg-gray-200 md:flex-row mx-3 mb-2 p-10 px-12 md:px-16 items-center justify-evenly gap-6 md:gap-10 rounded-xl  transition-transform duration-300 shadow-md ">
        <div className="flex md:w-[50%] flex-col gap-6 w-full md:max-w-[400px]">
          <div className="relative">
            <h2 className="text-lg md:text-2xl text-center md:text-left font-extrabold truncate mx-[40px] md:mx-0 bg-gradient-to-br from-gray-400 via-gray-300 to-gray-400  text-transparent animate-pulse rounded-full">
              Loading123
            </h2>
            <div className="pt-2 text-base md:text-lg ">
              <div className="flex gap-2 max-w-fit bg-gradient-to-br from-gray-400 via-gray-300 to-gray-400  text-transparent animate-pulse rounded-full">
                <strong className="">Category:</strong>
                <p className="animate-pulse">Loading...</p>
              </div>
            </div>
          </div>
          <div className="flex text-sm md:text-base flex-col w-full sm:flex-row gap-3 items-center justify-start">
            <button className=" flex gap-2 items-center justify-center w-full md:w-auto px-7 py-2 bg-gradient-to-br from-gray-400 via-gray-300 to-gray-400  text-transparent animate-pulse rounded-full transition-all duration-300">
              View <MdArrowForward size={20} />
            </button>
            <button className=" flex gap-2 items-center justify-center w-full md:w-auto px-7 py-2 bg-gradient-to-br from-gray-400 via-gray-300 to-gray-400  text-transparent animate-pulse rounded-full transition-all duration-300">
              Contact <MdMessage />
            </button>
          </div>
        </div>
        <div className="bg-gradient-to-br from-gray-400 via-gray-300 to-gray-400 h-[230px] w-[230px] md:w-[350px] rounded-xl object-cover aspect-square shadow-md animate-pulse"></div>
      </div>
    </div>
  );
}
