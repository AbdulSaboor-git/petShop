"use client";
import React, { useState, useEffect, useRef } from "react";
import { FaEnvelope, FaPhone, FaUser } from "react-icons/fa";
import {
  MdAccountBox,
  MdAccountCircle,
  MdArrowBack,
  MdDashboard,
  MdFavorite,
  MdHome,
  MdInfo,
  MdPhone,
  MdShop,
  MdStar,
  MdStore,
} from "react-icons/md";

import Image from "next/image";
import { useRouter } from "next/navigation";
import LoginForm from "./loginForm";
import Profile from "./profile";
import useAuthUser from "@/hooks/authUser";

export default function Header() {
  const [logedIn, setLogedIn] = useState(false);
  const { user, userLoading } = useAuthUser();
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [showAcc, setShowAcc] = useState(false);

  useEffect(() => {
    if (user) setLogedIn(true);
    else {
      setLogedIn(false);
      setShowAcc(false);
    }
    setShowLoginForm(false);
  }, [user]);

  const logoLink = "/logo.jpg";

  const toggleShowLoginForm = () => {
    setShowLoginForm((prev) => !prev);
  };

  const toggleShowAcc = () => {
    setShowAcc((prev) => !prev);
  };

  // const contact = {
  //   phone: "(+92) 321 855 9574",
  //   email: "petshop@gmail.com",
  // };

  const router = useRouter();

  function homeClick() {
    router.push("/home");
  }
  function shopClick() {
    router.push("/shop");
  }
  function contactClick() {
    router.push("/contact");
  }
  function aboutClick() {
    router.push("/about-us");
  }

  function favClick() {
    router.push("/favorites");
  }
  function loginClick() {
    toggleShowLoginForm();
  }
  function adminDBClick() {
    router.push("/admin-dashboard");
  }
  function sellerDBClick() {
    router.push("/seller-dashboard");
  }
  function accountClick() {
    toggleShowAcc();
  }

  const Buttons = [
    { btn_name: "Home", icon: <MdHome size={18} />, clickEvent: homeClick },
    { btn_name: "Shop", icon: <MdStore size={18} />, clickEvent: shopClick },
    {
      btn_name: "Favorites",
      icon: <MdFavorite size={18} className="text-red-500" />,
      clickEvent: favClick,
    },
  ];

  const topBtns = [];

  !logedIn &&
    topBtns.push({
      name: "Login",
      icon: <FaUser size={9.5} />,
      onClick: loginClick,
    });

  logedIn &&
    topBtns.push({
      name: `${user ? "Me" : "My Account"}`,
      icon: <MdAccountCircle size={16} />,
      onClick: accountClick,
    });

  logedIn &&
    user?.role == "ADMIN" &&
    topBtns.push({
      name: `Admin`,
      icon: <MdDashboard />,
      onClick: adminDBClick,
    });

  logedIn &&
    topBtns.push({
      name: `${user ? "Seller" : "Seller Dashboard"}`,
      icon: <MdDashboard />,
      onClick: sellerDBClick,
    });

  topBtns.push(
    {
      name: `${user ? "Contact" : "Contact Us"}`,
      icon: <MdPhone size={13} />,
      onClick: contactClick,
    },
    {
      name: `${user?.role === "ADMIN" ? "About" : "About Us"}`,
      icon: <MdInfo size={13} />,
      onClick: aboutClick,
    }
  );

  return (
    <div className="w-full z-50">
      {showLoginForm && (
        <div
          onClick={toggleShowLoginForm}
          className={`fixed z-10 h-full w-full `}
        />
      )}
      {showAcc && (
        <div onClick={toggleShowAcc} className={`fixed z-10 h-full w-full `} />
      )}
      <div className="relative flex justify-center items-center w-full">
        <div className="flex flex-col relative justify-center w-full items-center ">
          <div className="flex flex-col gap-0 w-full items-center justify-center z-0">
            <div className=" relative w-full bg-gradient-to-b  from-[#69461e] via-[#c7802fc5] to-transparent pb-32 lg:pb-12 z-10">
              <div
                className={`bg-gradient-to-br  to-[#442b0f] via-[#5d3c17] from-[#906434] p-2 px-4 lg:px-10 lg:p-3 lg:text-xs flex ${
                  user?.role === "ADMIN" ? "gap-3 text-[11px]" : "gap-4 text-xs"
                }  md:gap-6 w-full flex-wrap items-center justify-center lg:justify-end`}
              >
                {topBtns.map((btn, i) => (
                  <button
                    key={i}
                    className="text-white flex items-center justify-center gap-1.5  hover:text-[#fbe4bf] "
                    onClick={btn.onClick}
                  >
                    <div className="mb-0.5">{btn.icon}</div>
                    {btn.name}
                  </button>
                ))}
              </div>
              <div className="items-center justify-center hidden lg:flex absolute -top-1 left-4 bg-gradient-to-br  to-[#442b0f] via-[#5d3c17] from-[#906434]  p-6 rounded-b-full">
                <Image
                  src={logoLink}
                  alt={"logo"}
                  width={550}
                  height={550}
                  quality={100}
                  className={`w-auto h-[100px] rounded-full transition-all ease-in-out "
                  `}
                />
              </div>
            </div>
            <div className=" w-full flex flex-col items-center justify-center gap-5 lg:mt-3 z-10">
              <div className="w-full relative flex items-center justify-center -mt-[100px] lg:hidden">
                <Image
                  src={logoLink}
                  alt={"logo"}
                  width={550}
                  height={550}
                  quality={100}
                  className={`w-auto h-[80px] md:h-[100px] rounded-full transition-all ease-in-out "
                  `}
                />
                <button
                  className="absolute left-6 text-white bg-gradient-to-br hover:bg-gradient-radial to-[#442b0f] via-[#5d3c17] from-[#906434] p-1 px-4 rounded-xl"
                  onClick={() => window.history.back()}
                >
                  <MdArrowBack />
                </button>
              </div>
              <div className="flex gap-2 md:gap-3 ">
                {Buttons.map((btn, i) => (
                  <button
                    key={i}
                    className="flex gap-2 items-center justify-center py-1 px-4 md:py-1.5 md:px-5 text-xs md:text-sm rounded-full border border-solid border-[#9e6e3b] text-[#61401c] hover:shadow-sm hover:shadow-[#61401c]"
                    onClick={btn.clickEvent}
                  >
                    {btn.icon}
                    {btn.btn_name}
                  </button>
                ))}
              </div>
            </div>
          </div>
          {showAcc && (
            <div className="absolute top-24 rounded-xl z-20  md:top-16 lg:right-24">
              <Profile />
            </div>
          )}
          {showLoginForm && (
            <div className="absolute top-16 rounded-xl z-20  lg:right-5">
              <LoginForm />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
