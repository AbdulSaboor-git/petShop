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
import ProductCardAlt from "@/components/productCardAlt";
import filterCard from "./components/filterCard";

export default function HomePage() {

  const items = [
    {
      id: 1,
      name: "Black and White Chicken",
      breed: "Shamo",
      img: "/1.jpg",
      images: ["/1.jpg", "/3.jpg", "/2.jpg"],
      price: 2000,
      discountedPrice: 1800,
      isDiscounted: false,
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
      isDiscounted: false,
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
      isDiscounted: false,
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
      isDiscounted: false,
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
      isDiscounted: false,
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
      isDiscounted: false,
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
      isDiscounted: false,
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
      isDiscounted: false,
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
      isDiscounted: false,
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
      isDiscounted: false,
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
      isDiscounted: false,
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



  return (
    <div className="flex flex-col gap-10 items-center ">
      <Header />
      <filterCard />

      <div className="flex flex-col items-center justify-center max-w-[1400px] w-full px-4">
        <div className="flex gap-10">
          <div className=" w-[27%] p-2 pr-6 lg:pr-10 border-r border-[#000] hidden md:block">
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-5">
                <h1 className="text-lg font-bold text-center">Filter by Categories</h1>
                <div className="flex flex-col gap-2">
                  {categories.map((categ, i) => (
                    <div key={i}>
                      <Button variant="outlined" className="rounded-full w-full">
                        {categ.name}
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="grid  h-fit grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {items.map((item, i) => (
              <ProductCardAlt key={i} item={item} />
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
