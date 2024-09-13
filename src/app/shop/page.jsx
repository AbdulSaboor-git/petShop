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



  return (
    <div className="flex min-h-screen flex-col items-center gap-10">
      <Header />
      <div className=" flex flex-col gap-20 max-w-[1400px] w-full px-4">



      </div>
      <Footer />
    </div>
  );
}
