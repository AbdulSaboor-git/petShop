import Header from "@/components/header";
import React from "react";

export default function homeLoader() {
  return (
    <div className="flex flex-col gap-20 -mt-5 md:-mt-0">
      {/* Random Items div */}
      <div className="">
        <div
          className="bg-gradient-to-br  from-gray-200 via-gray-50 to-gray-200
          mx-3 mb-2 p-10 px-12 md:px-16 items-center justify-evenly
           gap-6 md:gap-10 rounded-xl  
           transition-transform duration-300  animate-pulse"
        >
          <div className="flex md:w-[50%] flex-col gap-6 w-full md:max-w-[400px] h-[145px] md:h-auto "></div>
          <div className="h-[230px] md:h-[350px]"></div>
        </div>
      </div>

      <div className="flex flex-col px-6 gap-5">
        <div className="text-xl md:text-2xl font-extrabold text-[#6e4519]">
          Top Categories
        </div>
        <div className="grid grid-cols-1 gap-2 md:grid-cols-2 justify-center">
          <div
            className={`relative bg-gradient-to-br  from-gray-200 via-gray-50 to-gray-200 animate-pulse flex items-center justify-between p-8 rounded-xl  transition-transform duration-300 overflow-hidden`}
          >
            <div
              className={`absolute inset-0 z-20 flex flex-col justify-center pl-6 pr-40  from-[#9e6e3b6d] via-transparent to-[#000000d0]`}
            >
              <h2 className="text-white text-[21px] md:text-2xl font-extrabold tracking-wide break-words">
                {/* {categ.name.toUpperCase()} */}
              </h2>
            </div>
            <div className="relative z-20 h-[120px] md:h-44 flex-shrink-0 ml-auto"></div>
          </div>
          <div
            className={`relative bg-gradient-to-br  from-gray-200 via-gray-50 to-gray-200 animate-pulse flex items-center justify-between p-8 rounded-xl  transition-transform duration-300 overflow-hidden`}
          >
            <div
              className={`absolute inset-0 z-20 flex flex-col justify-center pl-6 pr-40  from-[#9e6e3b6d] via-transparent to-[#000000d0]`}
            >
              <h2 className="text-white text-[21px] md:text-2xl font-extrabold tracking-wide break-words">
                {/* {categ.name.toUpperCase()} */}
              </h2>
            </div>
            <div className="relative z-20 h-[120px] md:h-44 flex-shrink-0 ml-auto"></div>
          </div>
        </div>
      </div>

      {/* {discountedItems.length != 0 && (
        <div className="flex flex-col gap-2 overflow-hidden">
          <div className="text-xl md:text-2xl px-6 font-extrabold text-[#6e4519]">
            On Sale
          </div>
          <div className="relative">
            <div {...settings3}>
              {discountedItems.map((item, i) => (
                <ProductCard
                  key={i}
                  item={item}
                  favClick={() => {
                    toggleFavorite(item.id);
                  }}
                  isFav={favorites.includes(item.id)}
                  alt={false}
                />
              ))}
            </div>
          </div>
          <button
            onClick={() => {
              shopClick("All", "All", true, "default");
            }}
            className="bg-gradient-to-br from-[#9e6e3b] via-[#855b2e] to-[#52371a] hover:bg-gradient-radial text-white  border border-[#9e6e3b] rounded-lg w-fit p-1 px-4 text-sm md:text-base self-center transition-all duration-300"
          >
            View More
          </button>
        </div>
      )} */}

      {/* <div className="flex flex-col gap-2 overflow-hidden pb-1">
        <div className="text-xl md:text-2xl px-6 font-extrabold text-[#6e4519]">
          Premium
        </div>
        {items.length != 0 ? (
          <div className="relative">
            <div {...settings2}>
              {mostValuedItems.map((item, i) => (
                <ProductCard
                  key={i}
                  item={item}
                  favClick={() => {
                    toggleFavorite(item.id);
                  }}
                  isFav={favorites.includes(item.id)}
                  alt={false}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="text-sm md:text-base text-gray-500 mx-6 p-2 self-start">
            Empty
          </div>
        )}
        <button
          onClick={() => {
            shopClick("All", "All", false, "priceDesc");
          }}
          className=" bg-white hover:shadow-sm hover:shadow-[#00000084] text-[#926739]  border border-[#926739] rounded-lg w-fit p-1 px-4 text-sm md:text-base self-center transition-all duration-300"
        >
          View More
        </button>
      </div> */}

      {/* <div className="flex flex-col px-6  gap-5">
        <div className="text-xl md:text-2xl font-extrabold text-[#6e4519]">
          Top Breeds
        </div>
        <div className="grid grid-cols-1 gap-2 md:grid-cols-2 justify-center">
          {breeds.map((breed) => {
            if (breed._count.items === 0) return null; // Skip items with count 0

            const isEven = index % 2 === 0;
            index++;
            return (
              <div
                key={index}
                className={`relative flex items-center justify-between p-8 rounded-xl  transition-transform duration-300 overflow-hidden ${
                  isEven
                    ? "bg-gradient-to-br from-[#9e6e3b] to-[#6c4922]"
                    : "bg-gradient-to-br from-[#252525] to-[#111111]"
                }`}
              >
                <div
                  className={`absolute inset-0 z-20 flex flex-col justify-center pl-6 pr-40 ${
                    isEven ? "bg-gradient-to-t" : "bg-gradient-to-b"
                  }  from-[#9e6e3b6d] via-transparent to-[#000000d0]`}
                >
                  <h2 className="text-white text-[21px] md:text-2xl font-extrabold tracking-wide break-words">
                    {breed.name.toUpperCase()}
                  </h2>
                  <button
                    onClick={() =>
                      shopClick("All", breed.name, false, "default")
                    }
                    className="mt-4 self-start text-xs md:text-sm border-2 py-2 px-4 transition-colors duration-300 bg-[#f0f0f0] text-[#5c3a15] hover:scale-105 rounded-md"
                  >
                    VIEW MORE
                  </button>
                </div>
                <div className="relative z-20 flex-shrink-0 ml-auto">
                  <img
                    src={
                      breedImages.find((image) => image.id === breed.id)
                        ?.image || defaultPic
                    }
                    alt={breed.name}
                    className="w-[120px]  md:w-44 aspect-square object-cover rounded-lg mix-blend-multiply opacity-90"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div> */}

      {/* <div className="flex flex-col gap-2 overflow-hidden pb-1">
        <div className="text-xl md:text-2xl px-6 font-extrabold text-[#6e4519]">
          Most Affordable
        </div>
        {items.length != 0 ? (
          <div className="relative">
            <div {...settings2}>
              {mostAffordableItems.map((item, i) => (
                <ProductCard
                  key={i}
                  item={item}
                  favClick={() => {
                    toggleFavorite(item.id);
                  }}
                  isFav={favorites.includes(item.id)}
                  alt={false}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="text-sm md:text-base text-gray-500 mx-6 p-2 self-start">
            Empty
          </div>
        )}
        <button
          onClick={() => {
            shopClick("All", "All", false, "priceAsc");
          }}
          className="bg-white hover:shadow-sm hover:shadow-[#00000084] text-[#926739]  border border-[#926739] rounded-lg w-fit p-1 px-4 text-sm md:text-base self-center transition-all duration-300"
        >
          View More
        </button>
      </div> */}

      {/* <div className="px-6">
        <div className="flex flex-col md:flex-row justify-evenly gap-16 bg-gradient-radial from-[#9e6e3b]  to-[#5e3f1d] text-white p-10 rounded-xl ">
          <div className="flex flex-col items-center text-center justify-center gap-1">
            <div className="flex flex-col gap-0.5 items-center">
              <FaHeart className="w-16 h-16 md:w-20 md:h-20" />
              <p className="text-base md:text-lg font-extrabold">
                Perfect Health
              </p>
            </div>
            <p className="text-xs md:text-sm">
              We provide pets with perfect health
            </p>
          </div>
          <div className="flex flex-col items-center text-center justify-center gap-1">
            <div className="flex flex-col gap-0.5 items-center">
              <FaShieldAlt className="w-16 h-16 md:w-20 md:h-20" />
              <p className="text-base md:text-lg font-extrabold">
                High Immunity
              </p>
            </div>
            <p className="text-xs md:text-sm">
              We ensure high immunity for a long and happy life
            </p>
          </div>
          <div className="flex flex-col items-center text-center justify-center gap-1">
            <div className="flex flex-col gap-0.5 items-center">
              <MdDiscount className="w-16 h-16 md:w-20 md:h-20" />
              <p className="text-base md:text-lg font-extrabold">
                Huge Discounts
              </p>
            </div>
            <p className="text-xs md:text-sm">
              Get exclusive offers and great discounts
            </p>
          </div>
        </div>
      </div> */}
    </div>
  );
}
