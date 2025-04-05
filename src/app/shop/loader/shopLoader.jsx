import React from "react";

export default function ShopLoader() {
  let items = [1, 2, 3, 4, 5, 6];
  return (
    <div
      className={`grid h-fit grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3 ${
        !items.length &&
        "min-w-[320px] sm:min-w-[480px] md:min-w-[640px] xl:min-w-[800px]"
      }`}
    >
      {items.map((item, i) => (
        <div
          key={i}
          className="mb-1 flex flex-col gap-1 max-w-[200px] min-w-[150px] overflow-hidden transition-all duration-300 ease-in-out relative "
        >
          <div className="relative w-full pt-[100%]">
            <div className="absolute top-0 left-0 w-full aspect-square h-full object-cover rounded-xl bg-gradient-to-br from-gray-400 via-gray-300 to-gray-400 animate-pulse " />
          </div>
          <div className="bg-gradient-to-br from-gray-400 via-gray-300 to-gray-400 animate-pulse w-full h-4 rounded-full"></div>
          <div className="bg-gradient-to-br from-gray-400 via-gray-300 to-gray-400 animate-pulse w-fit self-left h-5 rounded-full text-transparent">
            RS. Price
          </div>
        </div>
      ))}
    </div>
  );
}
