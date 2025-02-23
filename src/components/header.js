"use client";
import React, { useState, useEffect } from "react";
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

  // New states to control mounting and animation classes for popups
  const [loginMounted, setLoginMounted] = useState(false);
  const [loginAnimClass, setLoginAnimClass] = useState("");
  const [profileMounted, setProfileMounted] = useState(false);
  const [profileAnimClass, setProfileAnimClass] = useState("");

  const router = useRouter();

  useEffect(() => {
    if (user) setLogedIn(true);
    else {
      setLogedIn(false);
      setShowAcc(false);
    }
    setShowLoginForm(false);
  }, [user]);

  // Manage mounting and animation for LoginForm
  useEffect(() => {
    if (showLoginForm) {
      // When opening, mount and play open animation
      setLoginMounted(true);
      setLoginAnimClass("animate-openLoginPopUp");
    } else if (loginMounted) {
      // When closing, play close animation then unmount
      setLoginAnimClass("animate-closeLoginPopUp");
      const timer = setTimeout(() => {
        setLoginMounted(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [showLoginForm]);

  // Manage mounting and animation for Profile popup
  useEffect(() => {
    if (showAcc) {
      setProfileMounted(true);
      setProfileAnimClass("animate-openAccPopUp");
    } else if (profileMounted) {
      setProfileAnimClass("animate-closeAccPopUp");
      const timer = setTimeout(() => {
        setProfileMounted(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [showAcc]);

  const logoLink = "/logo.jpg";

  const toggleShowLoginForm = () => {
    setShowLoginForm((prev) => !prev);
  };

  const toggleShowAcc = () => {
    setShowAcc((prev) => !prev);
  };

  function homeClick() {
    router.push("/home");
  }
  function shopClick() {
    router.push("/shop");
  }
  function contactClick() {
    router.push("/contact-us");
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

  if (!logedIn)
    topBtns.push({
      name: "Login",
      icon: <FaUser size={9.5} />,
      onClick: loginClick,
    });

  if (logedIn)
    topBtns.push({
      name: user ? "Me" : "My Account",
      icon: <MdAccountCircle size={16} />,
      onClick: accountClick,
    });

  if (logedIn && user?.role === "ADMIN")
    topBtns.push({
      name: "Admin",
      icon: <MdDashboard />,
      onClick: adminDBClick,
    });

  if (logedIn)
    topBtns.push({
      name: user ? "Seller" : "Seller Dashboard",
      icon: <MdDashboard />,
      onClick: sellerDBClick,
    });

  topBtns.push(
    {
      name: user ? "Contact" : "Contact Us",
      icon: <MdPhone size={13} />,
      onClick: contactClick,
    },
    {
      name: user?.role === "ADMIN" ? "About" : "About Us",
      icon: <MdInfo size={13} />,
      onClick: aboutClick,
    }
  );

  return (
    <div className="w-full z-50 sticky -top-[152px] md:relative md:top-0">
      {showLoginForm && (
        <div
          onClick={toggleShowLoginForm}
          className="fixed z-10 h-full w-full"
        />
      )}
      {showAcc && (
        <div onClick={toggleShowAcc} className="fixed z-10 h-full w-full" />
      )}
      <div className="relative flex justify-center items-center w-full">
        <div className="flex flex-col relative justify-center w-full items-center">
          <div className="flex flex-col gap-6 lg:gap-0 w-full items-center justify-center z-0">
            <div className="relative w-full bg-gradient-to-b from-[#69461e] via-[#c7802fc5] to-transparent pb-[100px] z-10">
              <div
                className={`bg-gradient-to-br to-[#442b0f] via-[#5d3c17] from-[#906434] p-2 px-4 lg:px-10 lg:p-3 lg:text-xs flex ${
                  user?.role === "ADMIN" ? "gap-3 text-[11px]" : "gap-4 text-xs"
                } md:gap-6 w-full flex-wrap items-center justify-center lg:justify-end`}
              >
                {topBtns.map((btn, i) => (
                  <button
                    key={i}
                    className="text-white flex items-center justify-center gap-1.5 hover:text-[#fbe4bf]"
                    onClick={btn.onClick}
                  >
                    <div className="mb-0.5">{btn.icon}</div>
                    {btn.name}
                  </button>
                ))}
              </div>
              <div className="items-center justify-center hidden lg:flex absolute -top-1 left-4 bg-gradient-to-br to-[#442b0f] via-[#5d3c17] from-[#906434] p-6 rounded-b-full">
                <Image
                  src={logoLink}
                  alt="logo"
                  width={550}
                  height={550}
                  quality={100}
                  className="w-auto h-[100px] rounded-full transition-all ease-in-out"
                />
              </div>
            </div>
            <div className="w-full relative flex flex-col items-center justify-center gap-3 lg:mt-3 z-10">
              <div className="w-full flex items-center justify-center -mt-[100px] lg:hidden">
                <Image
                  src={logoLink}
                  alt="logo"
                  width={550}
                  height={550}
                  quality={100}
                  className="w-auto h-[80px] md:h-[100px] rounded-full transition-all ease-in-out"
                />
                <button
                  className="absolute left-6 text-white bg-gradient-to-br hover:bg-gradient-radial to-[#442b0f] via-[#5d3c17] from-[#906434] p-1 px-4 rounded-xl"
                  onClick={() => window.history.back()}
                >
                  <MdArrowBack />
                </button>
              </div>
              <div className="flex gap-2 md:gap-3 items-center justify-center w-full lg:-mt-[50px] bg-transparent backdrop-blur-md md:backdrop-blur-none  py-3">
                {Buttons.map((btn, i) => (
                  <button
                    key={i}
                    className="flex gap-2 bg-white items-center justify-center py-1 px-4 md:py-1.5 md:px-5 text-xs md:text-sm rounded-full border border-solid border-[#9e6e3b] text-[#61401c] hover:shadow-sm hover:shadow-[#61401c]"
                    onClick={btn.clickEvent}
                  >
                    {btn.icon}
                    {btn.btn_name}
                  </button>
                ))}
              </div>
            </div>
          </div>
          {/* Profile popup */}
          {profileMounted && (
            <div
              className={`absolute backdrop-blur-[8px] top-10 lg:top-12 rounded-xl z-20 lg:right-20 md:mr-10 ${
                user?.role === "SELLER" && "lg:right-8 md:mr-5"
              } ${profileAnimClass}`}
            >
              <Profile />
            </div>
          )}
          {/* Login popup */}
          {loginMounted && (
            <div
              className={`absolute backdrop-blur-[8px] top-10 opacity-0 lg:top-12 rounded-xl z-20 lg:right-7 ${loginAnimClass}`}
            >
              <LoginForm />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
