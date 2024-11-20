"use client";
import React, { useEffect, useRef, useState } from "react";
import Slider from "react-slick";
import { MdArrowBack, MdArrowForward, MdDiscount, MdHealthAndSafety, MdHome, MdInfo, MdPhone, MdShop, MdViewAgenda, MdViewInAr } from "react-icons/md";
import { useRouter } from "next/navigation";
import Image from "next/image"; // Next.js Image component for better image optimization
import Header from "@/components/header";
import { FaCartPlus, FaHeart, FaShieldAlt, FaShieldVirus, FaShoppingCart } from "react-icons/fa";
import CountdownTimer from "@/components/timer";

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
      id: 1,
      name: "Black and White Chicken",
      breed: "Shamo",
      img: "/1.jpg",
      images: ["/1.jpg", "/3.jpg", "/2.jpg"],
      price: 2000,
      discountedPrice: 1800,
      isDiscounted: true,
      weight: 2.2,
      height: 300,
      age: 1.3,
      sex: "male",
      nature: "Aggressive but excellent for guarding",
      specifications: "Black and white colored feathers, strong build",
      type: "Breeding and show bird",
      availability: "In Stock",
    },
    {
      id: 2,
      name: "Golden Hen",
      breed: "Rhode Island Red",
      img: "/3.jpg",
      images: ["/1.jpg", "/3.jpg", "/2.jpg"],
      price: 2500,
      discountedPrice: 2200,
      isDiscounted: true,
      weight: 2.5,
      height: 280,
      age: 2.0,
      sex: "female",
      nature: "Friendly and excellent egg layer",
      specifications: "Golden feathers, hardy and reliable",
      type: "Egg-laying bird",
      availability: "In Stock",
    },
    {
      id: 3,
      name: "White Leghorn",
      breed: "Leghorn",
      img: "/2.jpg",
      images: ["/1.jpg", "/3.jpg", "/2.jpg"],
      price: 1800,
      discountedPrice: 1600,
      isDiscounted: true,
      weight: 1.8,
      height: 290,
      age: 1.5,
      sex: "female",
      nature: "Active and excellent at free-range egg production",
      specifications: "White feathers, high egg production",
      type: "Egg-laying bird",
      availability: "In Stock",
    },
    {
      id: 4,
      name: "Barred Plymouth Rock Hen",
      breed: "Plymouth Rock",
      img: "/1.jpg",
      images: ["/1.jpg", "/3.jpg", "/2.jpg"],
      price: 2300,
      discountedPrice: 2100,
      isDiscounted: true,
      weight: 2.3,
      height: 310,
      age: 2.2,
      sex: "female",
      nature: "Calm, friendly, and excellent egg layer",
      specifications: "Barred black and white feathers, good temperament",
      type: "Dual-purpose bird (egg and meat)",
      availability: "In Stock",
    },
    {
      id: 5,
      name: "Silkie Chicken",
      breed: "Silkie",
      img: "/3.jpg",
      images: ["/1.jpg", "/3.jpg", "/2.jpg"],
      price: 2800,
      discountedPrice: 2500,
      isDiscounted: true,
      weight: 1.3,
      height: 250,
      age: 1.0,
      sex: "female",
      nature: "Gentle, docile, and excellent for petting",
      specifications: "Fluffy plumage, black skin, and blue earlobes",
      type: "Pet bird and ornamental",
      availability: "In Stock",
    },
    {
      id: 6,
      name: "Cochin Chicken",
      breed: "Cochin",
      img: "/2.jpg",
      images: ["/1.jpg", "/3.jpg", "/2.jpg"],
      price: 2200,
      discountedPrice: 2000,
      isDiscounted: true,
      weight: 3.0,
      height: 320,
      age: 2.5,
      sex: "female",
      nature: "Friendly, calm, and good for backyard flocks",
      specifications: "Large birds with fluffy plumage",
      type: "Dual-purpose bird",
      availability: "In Stock",
    },
    {
      id: 7,
      name: "Red Hen",
      breed: "Red",
      img: "/1.jpg",
      images: ["/1.jpg", "/3.jpg", "/2.jpg"],
      price: 2100,
      discountedPrice: 1900,
      isDiscounted: true,
      weight: 2.0,
      height: 280,
      age: 1.2,
      sex: "female",
      nature: "Friendly and highly productive in egg-laying",
      specifications: "Red feathers, reliable egg producer",
      type: "Egg-laying bird",
      availability: "In Stock",
    },
    {
      id: 8,
      name: "Ayam Cemani Chicken",
      breed: "Ayam Cemani",
      img: "/3.jpg",
      images: ["/1.jpg", "/3.jpg", "/2.jpg"],
      price: 3500,
      discountedPrice: 3200,
      isDiscounted: true,
      weight: 1.6,
      height: 270,
      age: 1.0,
      sex: "female",
      nature: "Mysterious, rare, and excellent for ornamental purposes",
      specifications: "Jet black feathers and black skin",
      type: "Ornamental and rare breed",
      availability: "Limited Stock",
    },
    {
      id: 9,
      name: "Easter Egger Chicken",
      breed: "Easter Egger",
      img: "/1.jpg",
      images: ["/1.jpg", "/3.jpg", "/2.jpg"],
      price: 2400,
      discountedPrice: 2200,
      isDiscounted: true,
      weight: 2.0,
      height: 280,
      age: 1.3,
      sex: "female",
      nature: "Friendly, calm, and lays colorful eggs",
      specifications: "Feathers in various colors, ideal for backyard flocks",
      type: "Egg-laying bird",
      availability: "In Stock",
    },
    {
      id: 10,
      name: "Australorp Hen",
      breed: "Australorp",
      img: "/2.jpg",
      images: ["/1.jpg", "/3.jpg", "/2.jpg"],
      price: 2500,
      discountedPrice: 2300,
      isDiscounted: true,
      weight: 2.5,
      height: 300,
      age: 2.0,
      sex: "female",
      nature: "Calm and very productive in egg-laying",
      specifications: "Black feathers, high egg production",
      type: "Egg-laying bird",
      availability: "In Stock",
    },
    {
      id: 11,
      name: "Silver Penciled Rock",
      breed: "Plymouth Rock",
      img: "/3.jpg",
      images: ["/1.jpg", "/3.jpg", "/2.jpg"],
      price: 2700,
      discountedPrice: 2400,
      isDiscounted: true,
      weight: 2.4,
      height: 310,
      age: 2.1,
      sex: "female",
      nature: "Friendly, good temperament",
      specifications: "Silver penciled feathers, hardy",
      type: "Dual-purpose bird",
      availability: "In Stock",
    },
    {
      id: 12,
      name: "Brahma Chicken",
      breed: "Brahma",
      img: "/2.jpg",
      images: ["/1.jpg", "/3.jpg", "/2.jpg"],
      price: 3000,
      discountedPrice: 2700,
      isDiscounted: true,
      weight: 3.5,
      height: 350,
      age: 2.4,
      sex: "female",
      nature: "Large, calm, friendly",
      specifications: "Feathered legs, gentle temperament",
      type: "Dual-purpose bird",
      availability: "In Stock",
    },
    {
      id: 13,
      name: "Jersey Giant",
      breed: "Jersey Giant",
      img: "/1.jpg",
      images: ["/1.jpg", "/3.jpg", "/2.jpg"],
      price: 3200,
      discountedPrice: 2900,
      isDiscounted: true,
      weight: 3.8,
      height: 400,
      age: 2.6,
      sex: "female",
      nature: "Gentle, calm, good for meat production",
      specifications: "Large body, excellent for meat",
      type: "Meat bird",
      availability: "In Stock",
    },
    {
      id: 14,
      name: "Cornish Hen",
      breed: "Cornish",
      img: "/2.jpg",
      images: ["/1.jpg", "/3.jpg", "/2.jpg"],
      price: 2500,
      discountedPrice: 2300,
      isDiscounted: true,
      weight: 2.8,
      height: 310,
      age: 1.7,
      sex: "male",
      nature: "Aggressive, fast-growing for meat",
      specifications: "Broad body, fast-growing",
      type: "Meat bird",
      availability: "In Stock",
    },
    {
      id: 15,
      name: "Rhode Island White",
      breed: "Rhode Island White",
      img: "/2.jpg",
      images: ["/1.jpg", "/3.jpg", "/2.jpg"],
      price: 2100,
      discountedPrice: 1900,
      isDiscounted: true,
      weight: 2.2,
      height: 290,
      age: 1.8,
      sex: "female",
      nature: "Hardy, good egg-layers",
      specifications: "White feathers, reliable",
      type: "Egg-laying bird",
      availability: "In Stock",
    },
    {
      id: 16,
      name: "Maran Chicken",
      breed: "Maran",
      img: "/3.jpg",
      images: ["/1.jpg", "/3.jpg", "/2.jpg"],
      price: 2800,
      discountedPrice: 2600,
      isDiscounted: true,
      weight: 2.4,
      height: 300,
      age: 2.1,
      sex: "female",
      nature: "Calm, good layer of dark eggs",
      specifications: "Chocolate-colored eggs, calm",
      type: "Egg-laying bird",
      availability: "In Stock",
    },
    {
      id: 17,
      name: "Sussex Hen",
      breed: "Sussex",
      img: "/1.jpg",
      images: ["/1.jpg", "/3.jpg", "/2.jpg"],
      price: 2600,
      discountedPrice: 2400,
      isDiscounted: true,
      weight: 2.3,
      height: 290,
      age: 2.0,
      sex: "female",
      nature: "Calm, friendly, great for eggs",
      specifications: "Feathers range from red to speckled, very hardy",
      type: "Egg-laying bird",
      availability: "In Stock",
    },
    {
      id: 18,
      name: "Orpington Chicken",
      breed: "Orpington",
      img: "/3.jpg",
      images: ["/1.jpg", "/3.jpg", "/2.jpg"],
      price: 2400,
      discountedPrice: 2200,
      isDiscounted: true,
      weight: 2.7,
      height: 300,
      age: 2.4,
      sex: "female",
      nature: "Gentle, hardy, good for egg production",
      specifications: "Large, glossy black feathers",
      type: "Egg-laying bird",
      availability: "In Stock",
    },
    {
      id: 19,
      name: "Indian Game Chicken",
      breed: "Indian Game",
      img: "/2.jpg",
      images: ["/1.jpg", "/3.jpg", "/2.jpg"],
      price: 2700,
      discountedPrice: 2500,
      isDiscounted: true,
      weight: 3.0,
      height: 310,
      age: 1.8,
      sex: "male",
      nature: "Aggressive, hardy",
      specifications: "Feathers in vibrant colors, strong build",
      type: "Show and meat bird",
      availability: "In Stock",
    },
    {
      id: 20,
      name: "Hamburg Chicken",
      breed: "Hamburg",
      img: "/3.jpg",
      images: ["/1.jpg", "/3.jpg", "/2.jpg"],
      price: 2200,
      discountedPrice: 2000,
      isDiscounted: true,
      weight: 2.1,
      height: 280,
      age: 1.5,
      sex: "female",
      nature: "Active, good foragers, lays white eggs",
      specifications: "Feathers are predominantly white, reliable",
      type: "Egg-laying bird",
      availability: "In Stock",
    }
  ];



  const categories = [
    {
      name: "Misri",
      img: '/2.jpg'
    },
    {
      name: "Asheel",
      img: '/1.jpg',
    },
    {
      name: "Desi",
      img: '/3.jpg',
    },
    {
      name: "Shamo",
      img: '/1.jpg',
    },

  ];

  const router = useRouter();




  const [randomItems, setRandomItems] = useState([]);

  useEffect(() => {
    function getRandomIndices(count, max) {
      const randomIndices = new Set();
      while (randomIndices.size < count) {
        const randomIndex = Math.floor(Math.random() * max); // Random number between 0 and max-1
        randomIndices.add(randomIndex); // Ensures unique random numbers
      }
      return Array.from(randomIndices); // Convert set to array
    }



    function getRandomItemsFromIndices(items, count = 5) {
      const randomIndices = getRandomIndices(count, items.length);
      return randomIndices.map(index => items[index]);
    }

    // Generate the 5 random items and update the state
    const selectedItems = getRandomItemsFromIndices(items, 5);
    setRandomItems(selectedItems);
  }, []);

  const discountedItems = items.filter((item) => (item.isDiscounted))



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
            {randomItems.map((item, index) => (
              <div key={index}>
                <div className="flex flex-col sm:flex-row bg-amber-100 p-8 px-16 items-center justify-evenly gap-10 sm:gap-10">
                  <div className=" flex flex-col gap-6 w-full sm:w-fit">
                    <div>
                      <h2 className="text-2xl md:text-3xl text-center sm:text-left font-bold text-orange-800">{item.name}</h2>
                      <p className="text-base md:text-lg pt-4 mx-1">
                        <p className="font-bold">Breed: <span className="font-normal">{item.breed}</span></p>
                        <p className="font-bold">Height: <span className="font-normal">{item.height} cm</span></p>
                        <p className="font-bold">Weight: <span className="font-normal">{item.weight} kg</span></p>
                        <p className="font-bold">Age: <span className="font-normal">{item.age} years</span></p>

                      </p>
                    </div>
                    <div className="flex flex-col w-full sm:flex-row  gap-2 sm:gap-3.5 items-center justify-start">
                      <button className="bg-orange-500 flex gap-2 text-base items-center justify-center w-full sm:w-fit px-7 py-2 hover:bg-orange-600 text-white rounded-full"
                        onClick={() => {
                          router.push(`/product/${item.id}`);
                        }
                        }>
                        View <MdArrowForward size={20} />
                      </button>
                      <button className="bg-orange-500 w-full text-base sm:w-fit px-7 py-2 hover:bg-orange-600 text-white rounded-full" >
                        Buy
                      </button>
                    </div>
                  </div>
                  <div className="">
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
            <button variant="contained" className="bg-orange-500 text-base md:text-xl w-fit px-6 py-3 hover:bg-orange-600 text-white rounded-lg" >
              Shop Now
            </button>
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
                        <button variant="outlined" className=" text-xs border-2 border-white text-white py-1 px-2.5 hover:bg-white hover:text-black rounded-md">
                          VIEW MORE
                        </button>
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
