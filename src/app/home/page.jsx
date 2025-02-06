"use client";
import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import { MdArrowForward, MdDiscount } from "react-icons/md";
import { useRouter } from "next/navigation";
import Image from "next/image"; // Next.js Image component for better image optimization
import Header from "@/components/header";
import { FaHeart, FaShieldAlt } from "react-icons/fa";
import CountdownTimer from "@/components/timer";
import ProductCard from "@/components/productCard";
import Footer from "@/components/footer";

export default function HomePage() {
  const router = useRouter();
  const [slidesToShow, setSlidesToShow] = useState(4); // Default value for large screens
  const [centerMode, setCenterMode] = useState(false);
  const [randomItems, setRandomItems] = useState([]);
  const [items, setItems] = useState([]);
  const [allItems, setAllItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [breeds, setBreeds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // const defaultPic = "https://i.sstatic.net/5ykYD.png";
  const defaultPic = "1.jpg";

  let categImages = [];

  function shopClick(categFilter) {
    categFilter
      ? router.push(`/shop?category=${categFilter}`)
      : router.push("/shop");
  }

  function itemClick(itemId) {
    router.push(`/item/${itemId}`);
  }

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch(`/api/homeItems`);
        const response2 = await fetch(`/api/categories_breeds`);
        if (!response.ok || !response2.ok) {
          throw new Error("Failed to fetch data.");
        }
        const data = await response.json();
        const data2 = await response2.json();

        setItems(data.items);
        setAllItems(data.items);
        setCategories(data2.categories);
        setBreeds(data2.breeds);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (!localStorage.getItem("favorites")) {
      localStorage.setItem("favorites", []);
    }
    fetchItems();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 450) {
        setSlidesToShow(1);
        setCenterMode(true);
      } else if (width < 640) {
        setSlidesToShow(2);
        setCenterMode(false);
      } else if (width < 850) {
        setSlidesToShow(3);
        setCenterMode(false);
      } else if (width < 1050) {
        setSlidesToShow(4);
        setCenterMode(false);
      } else if (width < 1300) {
        setSlidesToShow(5);
        setCenterMode(false);
      } else {
        setSlidesToShow(6);
        setCenterMode(false);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const mostValuedItems = allItems
    .sort((a, b) => b.price - a.price)
    .slice(0, 3);

  useEffect(() => {
    const getRandomItems = () => {
      if (items.length <= 5) {
        setRandomItems(items);
      } else {
        const shuffled = [...items].sort(() => 0.5 - Math.random());
        setRandomItems(shuffled.slice(0, 5));
      }
    };

    getRandomItems();
  }, [items]);

  categImages = categories.map((category) => {
    const item = items.find((item) => item.categoryId === category.id);
    return { id: category.id, image: item?.images?.[0] || defaultPic };
  });

  const discountedItems = items.filter((item) => item.isDiscounted);

  const settings = {
    dots: true,
    infinite: true,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    autoplay: true,
    autoplaySpeed: 5000,
    touchThreshold: 20,
  };

  const settings2 = {
    dots: false,
    infinite: false,
    speed: 400,
    slidesToShow: items.length < slidesToShow ? items.length : slidesToShow,
    slidesToScroll: 1,
    arrows: true,
    autoplay: false,
    swipeToSlide: true,
    touchThreshold: 20,
    centerMode: centerMode,
    centerPadding: "70px",
    draggable: false,
  };

  const settings3 = {
    dots: false,
    infinite: false,
    speed: 400,
    slidesToShow:
      discountedItems.length < slidesToShow
        ? discountedItems.length
        : slidesToShow,
    slidesToScroll: 1,
    arrows: true,
    autoplay: false,
    swipeToSlide: true,
    touchThreshold: 20,
    draggable: false,
    centerMode: centerMode,
    centerPadding: "70px",
  };

  return (
    <div className="bg-gray-50">
      <div className="flex flex-col items-center gap-10">
        <Header />
        <div className="max-w-[1400px] w-full px-6">
          {loading ? (
            <div className="text-center py-10 text-xl">Loading...</div>
          ) : error ? (
            <div className="text-center py-10 text-red-600">{error}</div>
          ) : (
            <div className="flex flex-col gap-20">
              {/* Random Items Slider */}
              <Slider {...settings}>
                {randomItems.map((item, index) => (
                  <div key={index}>
                    <div className="flex flex-col sm:flex-row bg-white p-10 px-16 items-center justify-evenly gap-10 sm:gap-10 rounded-xl shadow-lg transition-transform duration-300 hover:scale-105">
                      <div className="flex flex-col gap-6 w-full sm:w-auto">
                        <div>
                          <h2 className="text-2xl md:text-3xl text-center sm:text-left font-bold text-orange-800 tracking-wide">
                            {item.name}
                          </h2>
                          <div className="pt-4 mx-1 space-y-1">
                            {item.breed && (
                              <p className="font-bold">
                                Breed:{" "}
                                <span className="font-normal">
                                  {item.breed.name}
                                </span>
                              </p>
                            )}
                            {item.height && (
                              <p className="font-bold">
                                Height:{" "}
                                <span className="font-normal">
                                  {item.height} cm
                                </span>
                              </p>
                            )}
                            {item.weight && (
                              <p className="font-bold">
                                Weight:{" "}
                                <span className="font-normal">
                                  {item.weight} kg
                                </span>
                              </p>
                            )}
                            {item.age && (
                              <p className="font-bold">
                                Age:{" "}
                                <span className="font-normal">
                                  {item.age} years
                                </span>
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-col w-full sm:flex-row gap-3 items-center justify-start">
                          <button
                            onClick={() => itemClick(item.id)}
                            className="bg-orange-500 flex gap-2 items-center justify-center w-full sm:w-auto px-7 py-2 text-base hover:bg-orange-600 text-white rounded-full transition-colors duration-300"
                          >
                            View <MdArrowForward size={20} />
                          </button>
                          <button className="bg-orange-500 w-full text-base sm:w-auto px-7 py-2 hover:bg-orange-600 text-white rounded-full transition-colors duration-300">
                            Buy
                          </button>
                        </div>
                      </div>
                      <div className="flex-shrink-0">
                        <img
                          src={item.images[0] || defaultPic}
                          alt={item.name}
                          width={230}
                          height={230}
                          className="h-[230px] w-[230px] md:h-[350px] md:w-[350px] rounded-xl object-cover shadow-md"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </Slider>

              {/* On Sale Slider */}
              <div className="flex flex-col gap-4">
                <div className="text-xl font-extrabold text-gray-800">
                  On Sale
                </div>
                <div className="relative">
                  <Slider {...settings3}>
                    {discountedItems.map((item, i) => (
                      <ProductCard key={i} item={item} />
                    ))}
                  </Slider>
                </div>
              </div>

              {/* Countdown / Sale Section */}
              <div className="w-full flex flex-col gap-10 items-center justify-center bg-gradient-to-r from-amber-200 to-amber-100 p-10 rounded-xl shadow-lg">
                <div className="text-xl font-medium text-gray-800">
                  Hurry Up! Sale Ending In:
                </div>
                <CountdownTimer />
                <button
                  onClick={shopClick}
                  className="bg-orange-500 text-base md:text-xl w-fit px-6 py-3 hover:bg-orange-600 text-white rounded-lg transition-colors duration-300"
                >
                  Shop Now
                </button>
              </div>

              {/* Category Section (unchanged as per your request) */}
              <div className="flex flex-col gap-10">
                <div className="text-2xl font-extrabold text-gray-800">
                  Top Categories
                </div>
                <div className="grid grid-cols-1 gap-2 md:grid-cols-2 p-6 justify-center">
                  {categories.map((categ, i) => (
                    <div
                      key={i}
                      className={`relative flex items-center justify-between p-8 rounded-xl shadow-2xl transition-transform duration-300 overflow-hidden ${
                        i === 0 || i === 3 || i === 4 || i === 7 || i === 8
                          ? "bg-gradient-to-r from-[#9e6e3b] to-[#785229]"
                          : "bg-gradient-to-r from-[#252525] to-[#1a1a1a]"
                      }`}
                    >
                      {/* Absolute positioned text container with gradient overlay */}
                      <div className="absolute inset-0 z-20 flex flex-col justify-center pl-6 pr-40 bg-gradient-to-b from-[#9e6e3b]/40 via-transparent to-black/60">
                        <h2 className="text-white text-3xl font-extrabold tracking-wide break-words">
                          {categ.name.toUpperCase()}
                        </h2>
                        <button
                          onClick={() => shopClick(categ.name)}
                          className="mt-4 self-start text-sm border-2 border-white text-white py-2 px-4 transition-colors duration-300 hover:bg-white hover:text-black rounded-md"
                        >
                          VIEW MORE
                        </button>
                      </div>
                      {/* Image container */}
                      <div className="relative z-10 flex-shrink-0 ml-auto">
                        <img
                          src={
                            categImages.find((image) => image.id === categ.id)
                              ?.image || defaultPic
                          }
                          alt={categ.name}
                          width={500}
                          height={500}
                          className="w-40 h-40 md:w-48 md:h-48 object-cover rounded-lg mix-blend-multiply"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Most Valuable Section */}
              <div className="flex flex-col gap-2">
                <div className="text-xl font-extrabold text-gray-800">
                  Most Valuable
                </div>
                <div className="relative">
                  <Slider {...settings3}>
                    {mostValuedItems.map((item, i) => (
                      <ProductCard key={i} item={item} />
                    ))}
                  </Slider>
                </div>
              </div>

              {/* Feature / Benefits Section */}
              <div className="flex flex-col md:flex-row justify-evenly gap-16 bg-[var(--form-heading)] text-white p-10 rounded-xl shadow-xl">
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
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
