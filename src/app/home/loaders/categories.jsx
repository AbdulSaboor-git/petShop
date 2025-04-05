import React from "react";
import { MdArrowForward, MdMessage } from "react-icons/md";

export default function CategoriesLoader() {
  let categoriesLoading = [1, 2];
  return (
    <div className="flex flex-col px-6 gap-5">
      <div className="text-xl md:text-2xl font-extrabold max-w-fit bg-gradient-to-br from-gray-400 via-gray-300 to-gray-400  text-transparent animate-pulse rounded-full">
        Laoding Heading
      </div>
      <div className={`grid grid-cols-1 gap-2 md:grid-cols-2 justify-center `}>
        {categoriesLoading.map((i, index) => {
          return (
            <div
              key={index}
              className={`relative flex items-center justify-between p-8 rounded-xl  transition-transform duration-300 overflow-hidden  
              bg-gradient-to-br from-gray-400 via-gray-300 to-gray-400  text-transparent animate-pulse`}
            >
              <div className="relative z-20 flex-shrink-0 ml-auto">
                <div className="w-[120px] md:w-44 aspect-square object-cover rounded-lg mix-blend-multiply opacity-90" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
