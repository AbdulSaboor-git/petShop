"use client";
import React, { useEffect, useRef, useState } from "react";
import Slider from "react-slick";
import { MdArrowBack, MdArrowForward, MdDiscount, MdHealthAndSafety, MdHome, MdInfo, MdPhone, MdShop } from "react-icons/md";
import { useRouter } from "next/navigation";
import Image from "next/image"; // Next.js Image component for better image optimization
import Header from "@/components/header";
import { FaCartPlus, FaHeart, FaShieldAlt, FaShieldVirus, FaShoppingCart } from "react-icons/fa";
import CountdownTimer from "@/components/timer";
import { RiHealthBookFill } from "react-icons/ri";
import { Settings } from "@mui/icons-material";
import { Button, buttonBaseClasses } from "@mui/material";
import LoginForm from "@/components/loginForm";
import ProductCard from "@/components/productCard";
import Footer from "@/components/footer";

export default function HomePage() {
  const [slidesToShow, setSlidesToShow] = useState(4); // Default value for large screens
  const [centerMode, setCenterMode] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 450) {
        setSlidesToShow(1);
        setCenterMode(true);
      } else if (width < 550) {
        setSlidesToShow(2);
        setCenterMode(false);
      } else if (width < 900) {
        setSlidesToShow(3);
        setCenterMode(false);
      } else if (width < 1100) {
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
    handleResize(); // Initialize on mount

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const items = [
    {
      name: "Woodlands House",
      desc: "Whether you have a hamster, guinea pig or gerbil, this house makes a great place to hide, sleep and play, plus allows for plenty of gnawing from your furry friend too!",
      shortDesc: "Best House in world",
      img: "/1.png",
      price: 2000,
    },
    {
      name: "Wooden House",
      desc: "Whether you have a hamster, guinea pig or gerbil, this house makes a great place to hide, sleep and play, plus allows for plenty of gnawing from your furry friend too!",
      shortDesc: "Best House in world",
      img: "/OIP.jpeg",
      price: 2000,
      discounted_price: 3000,
    },
    {
      name: "House 3",
      desc: "Whether you have a hamster, guinea pig or gerbil, this house makes a great place to hide, sleep and play, plus allows for plenty of gnawing from your furry friend too!",
      shortDesc: "Best House in world",
      img: "/OIP.jpeg",
      price: 2000,
    },
    {
      name: "House 4",
      desc: "Whether you have a hamster, guinea pig or gerbil, this house makes a great place to hide, sleep and play, plus allows for plenty of gnawing from your furry friend too!",
      img: "/OIP.jpeg",
      shortDesc: "Best House in world",
      price: 2000,
    },
    {
      name: "House 5",
      desc: "Whether you have a hamster, guinea pig or gerbil, this house makes a great place to hide, sleep and play, plus allows for plenty of gnawing from your furry friend too!",
      img: "/OIP.jpeg",
      shortDesc: "Best House in world",
      price: 2000,
    },
    {
      name: "House 6",
      desc: "Whether you have a hamster, guinea pig or gerbil, this house makes a great place to hide, sleep and play, plus allows for plenty of gnawing from your furry friend too!",
      img: "/1.png",
      shortDesc: "Best House in world",
      price: 2000,
      discounted_price: 10000,
    },

  ];

  const discountedItems = items.filter((item) => (item.discounted_price))

  const categories = [
    {
      name: "Woodlands House",
      img: '/1.png'
    },
    {
      name: "Wooden House",
      img: '/1.png',
    },
    {
      name: "House 3",
      img: '/1.png',
    },
    {
      name: "House 5",
      img: '/1.png',
    },

  ];

  const settings = {
    dots: true,
    infinite: true,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    autoplay: true,
    autoplaySpeed: 5000,
    touchThreshold: 20
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
    centerPadding: '70px',
    // autoplaySpeed: 5000,
  };

  const settings3 = {
    dots: false,
    infinite: false,
    speed: 400,
    slidesToShow: discountedItems.length < slidesToShow ? discountedItems.length : slidesToShow,
    slidesToScroll: 1,
    arrows: true,
    autoplay: false,
    swipeToSlide: true,
    touchThreshold: 20,
    centerMode: centerMode,
    centerPadding: '70px',
    // autoplaySpeed: 5000,
  };

  return (
    <div>
      <div className="flex flex-col items-center gap-10">
        <Header />
        <div className=" flex flex-col gap-20 max-w-[1400px] w-full px-4">
          <Slider {...settings}>
            {items.map((item, index) => (
              <div key={index}>
                <div className="flex flex-col md:flex-row bg-amber-100 p-8 items-center gap-5 md:gap-10">
                  <div className="flex-1 flex flex-col gap-6">
                    <div>
                      <h2 className="text-xl md:text-3xl font-bold text-gray-800">{item.name}</h2>
                      <p className="text-sm md:text-base mt-4 text-gray-600">{item.desc.length > 200 ? `${item.desc.slice(0, 200)}...` : item.desc}</p>
                    </div>
                    <div className="flex flex-col md:flex-row text-sm md:text-base gap-2 md:gap-3.5 items-center justify-center  self-center md:self-start">
                      <Button variant="contained" className="flex gap-2 items-center text-sm md:text-base w-fit px-7 py-2 hover:bg-orange-600 text-white rounded-full" >
                        Add to Cart <FaCartPlus size={15} />
                      </Button>
                      <Button variant="contained" className="text-sm md:text-base w-fit px-7 py-2 hover:bg-orange-600 text-white rounded-full" >
                        Buy Now
                      </Button>
                    </div>
                  </div>
                  <div className="flex-2">
                    <Image
                      src={item.img}
                      alt={item.name}
                      width={230}
                      height={230}
                      quality={100}
                      className="h-[230px] w-[230px] md:h-[350px] md:w-[350px] rounded-xl object-cover"
                    />
                  </div>
                </div>
              </div>
            ))}
          </Slider>

          <div className="flex flex-col gap-2">
            <div className="text-xl font-extrabold">
              On Sale
            </div>
            <div className="relative">
              <Slider {...settings3} className="flex justify-normal">
                {discountedItems.map((item, i) => (
                  <ProductCard key={i} item={item} />
                ))}
              </Slider>
            </div>
          </div>

          <div className="w-full flex flex-col gap-10 items-center justify-center bg-amber-100 p-10">
            <div className="text-xl font-medium">
              Hurry Up! Sale Ending In:
            </div>
            <CountdownTimer />
            <Button variant="contained" className="text-base md:text-xl w-fit px-6 py-3 hover:bg-orange-600 text-white rounded-lg" >
              Shop Now
            </Button>
          </div>


          <div className="flex flex-col gap-10">
            <div className="text-xl font-extrabold">
              Top Categories
            </div>

            <div className="grid grid-cols-1 gap-1 md:grid-cols-2 p-4 justify-center">
              {categories.map((item, i) => (
                <div
                  key={i}
                  className={`flex w-full h-auto p-8 gap-20 ${i === 0 || i === 3 ? 'bg-[#9e6e3b]' : 'bg-[#252525]'
                    } flex items-start justify-between overflow-hidden`}
                >
                  <div className="flex-1">
                    <div className="absolute flex flex-col gap-2 justify-start flex-1">
                      <h2 className="text-white text-2xl font-extrabold">
                        {item.name.toUpperCase()}
                      </h2>

                      <div>
                        <Button variant="outlined" className=" text-xs border-2 border-white text-white py-1 px-2.5 hover:bg-white hover:text-black rounded-md">
                          VIEW MORE
                        </Button>
                      </div>
                    </div>
                  </div>

                  <Image
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
            <div className="text-xl font-extrabold">
              Best Selling
            </div>
            <div className="relative">
              <Slider {...settings2} className="flex justify-normal">
                {items.map((item, i) => (
                  <ProductCard key={i} item={item} />
                ))}
              </Slider>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-evenly gap-16 bg-[var(--form-heading)] text-white p-10">
            <div className="flex flex-col items-center text-center justify-center gap-1">
              <div className="flex flex-col gap-0.5 items-center">
                <FaHeart className="size-[60px] md:size-[80px]" />
                <p className="text-base md:text-lg font-extrabold">Perfect Health</p>
              </div>
              <p className="text-xs md:text-sm">We provide pets with perfect health</p>
            </div>

            <div className="flex flex-col items-center text-center justify-center gap-1">
              <div className="flex flex-col gap-0.5 items-center">
                <FaShieldAlt className="size-[60px] md:size-[80px]" />
                <p className="text-base md:text-lg font-extrabold">High Immunity</p>
              </div>
              <p className="text-xs md:text-sm">We provide pets with perfect health</p>
            </div>

            <div className="flex flex-col items-center text-center justify-center gap-1">
              <div className="flex flex-col gap-0.5 items-center">
                <MdDiscount className="size-[60px] md:size-[80px]" />
                <p className="text-base md:text-lg font-extrabold">Huge Discounts</p>
              </div>
              <p className="text-xs md:text-sm">We provide pets with perfect health</p>
            </div>
          </div>

        </div>
      </div>
      <Footer />
    </div>
  );
}
