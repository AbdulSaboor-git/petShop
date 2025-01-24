"use client";
import React, { useEffect, useRef, useState } from "react";
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const defaultPic = "https://i.sstatic.net/5ykYD.png";

  useEffect(() => {
    const fetchItems = async () => {
      try {
        console.log("data");
        const response = await fetch(`/api/homeItems`); // Update API path if necessary
        console.log("data");
        if (!response.ok) {
          throw new Error("Failed to fetch items.");
        }
        console.log("dq");
        const data = await response.json();
        setItems(data.items);
        setAllItems(data.items); // Keep a backup of all items for filtering
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
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

  const categories = [
    {
      name: "Hens",
      img: "/2.jpg",
    },
    {
      name: "Feed",
      img: "/1.jpg",
    },
    {
      name: "Utensils",
      img: "/3.jpg",
    },
    {
      name: "Eggs",
      img: "/1.jpg",
    },
  ];

  const mostValuedItems = items
    .sort((a, b) => b.price - a.price) // Sort items in descending order by price
    .slice(0, 5); // Get top 5 items

  // Select 5 random items or all items if less than 5
  useEffect(() => {
    const getRandomItems = () => {
      if (items.length <= 5) {
        setRandomItems(items); // Use all items if less than or equal to 5
      } else {
        const shuffled = [...items].sort(() => 0.5 - Math.random()); // Shuffle items
        setRandomItems(shuffled.slice(0, 5)); // Select 5 random items
      }
    };
    getRandomItems();
  }, [items]);

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
    // autoplaySpeed: 5000,
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
    // autoplaySpeed: 5000,
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (items.length === 0) return <div>No items available.</div>;

  return (
    <div>
      <div className="flex flex-col items-center gap-10">
        <Header />
        <div className=" flex flex-col gap-20 max-w-[1400px] w-full px-4">
          <Slider {...settings}>
            {randomItems.map((item, index) => (
              <div key={index}>
                <div className="flex flex-col sm:flex-row bg-amber-100 p-8 px-16 items-center justify-evenly gap-10 sm:gap-10">
                  <div className=" flex flex-col gap-6 w-full sm:w-fit">
                    <div>
                      <h2 className="text-2xl md:text-3xl text-center sm:text-left font-bold text-orange-800">
                        {item.name}
                      </h2>
                      <p className="text-base md:text-lg pt-4 mx-1">
                        <p className="font-bold">
                          Breed:{" "}
                          <span className="font-normal">{item.breed}</span>
                        </p>
                        <p className="font-bold">
                          Height:{" "}
                          <span className="font-normal">{item.height} cm</span>
                        </p>
                        <p className="font-bold">
                          Weight:{" "}
                          <span className="font-normal">{item.weight} kg</span>
                        </p>
                        <p className="font-bold">
                          Age:{" "}
                          <span className="font-normal">{item.age} years</span>
                        </p>
                      </p>
                    </div>
                    <div className="flex flex-col w-full sm:flex-row  gap-2 sm:gap-3.5 items-center justify-start">
                      <button
                        className="bg-orange-500 flex gap-2 text-base items-center justify-center w-full sm:w-fit px-7 py-2 hover:bg-orange-600 text-white rounded-full"
                        onClick={() => {
                          router.push(`/product/${item.id}`);
                        }}
                      >
                        View <MdArrowForward size={20} />
                      </button>
                      <button className="bg-orange-500 w-full text-base sm:w-fit px-7 py-2 hover:bg-orange-600 text-white rounded-full">
                        Buy
                      </button>
                    </div>
                  </div>
                  <div className="">
                    <img
                      src={item.images[0] || defaultPic}
                      alt={item.name}
                      width={230}
                      height={230}
                      className="h-[230px] w-[230px] md:h-[350px] md:w-[350px] rounded-xl object-cover"
                    />
                  </div>
                </div>
              </div>
            ))}
          </Slider>

          <div className="flex flex-col gap-2">
            <div className="text-xl font-extrabold">On Sale</div>
            <div className="relative">
              <Slider {...settings3}>
                {discountedItems.map((item, i) => (
                  <ProductCard key={i} item={item} />
                ))}
              </Slider>
            </div>
          </div>

          <div className="w-full flex flex-col gap-10 items-center justify-center bg-amber-100 p-10">
            <div className="text-xl font-medium">Hurry Up! Sale Ending In:</div>
            <CountdownTimer />
            <button
              variant="contained"
              className="bg-orange-500 text-base md:text-xl w-fit px-6 py-3 hover:bg-orange-600 text-white rounded-lg"
            >
              Shop Now
            </button>
          </div>

          <div className="flex flex-col gap-10">
            <div className="text-xl font-extrabold">Top Categories</div>

            <div className="grid grid-cols-1 gap-1 md:grid-cols-2 p-4 justify-center">
              {categories.map((item, i) => (
                <div
                  key={i}
                  className={`flex w-full h-auto p-8 gap-20 ${
                    i === 0 || i === 3 ? "bg-[#9e6e3b]" : "bg-[#252525]"
                  } flex items-start justify-between overflow-hidden`}
                >
                  <div className="flex-1">
                    <div className="absolute flex flex-col gap-2 justify-start flex-1">
                      <h2 className="text-white text-2xl font-extrabold">
                        {item.name.toUpperCase()}
                      </h2>

                      <div>
                        <button
                          variant="outlined"
                          className=" text-xs border-2 border-white text-white py-1 px-2.5 hover:bg-white hover:text-black rounded-md"
                        >
                          VIEW MORE
                        </button>
                      </div>
                    </div>
                  </div>

                  <img
                    src={item.img}
                    alt={item.name}
                    width={500}
                    height={500}
                    className="flex-1 h-auto max-h-[180px] object-contain"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="text-xl font-extrabold">Most Valuable</div>
            <div className="relative">
              <Slider {...settings2}>
                {mostValuedItems.map((item, i) => (
                  <ProductCard key={i} item={item} />
                ))}
              </Slider>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-evenly gap-16 bg-[var(--form-heading)] text-white p-10">
            <div className="flex flex-col items-center text-center justify-center gap-1">
              <div className="flex flex-col gap-0.5 items-center">
                <FaHeart className="size-[60px] md:size-[80px]" />
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
                <FaShieldAlt className="size-[60px] md:size-[80px]" />
                <p className="text-base md:text-lg font-extrabold">
                  High Immunity
                </p>
              </div>
              <p className="text-xs md:text-sm">
                We provide pets with perfect health
              </p>
            </div>

            <div className="flex flex-col items-center text-center justify-center gap-1">
              <div className="flex flex-col gap-0.5 items-center">
                <MdDiscount className="size-[60px] md:size-[80px]" />
                <p className="text-base md:text-lg font-extrabold">
                  Huge Discounts
                </p>
              </div>
              <p className="text-xs md:text-sm">
                We provide pets with perfect health
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
