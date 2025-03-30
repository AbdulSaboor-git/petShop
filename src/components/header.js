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
import useAuthUser from "@/hooks/authUser";

export default function Header({ pageOpened }) {
  const logoLink = "/logo.png";
  const [logedIn, setLogedIn] = useState(false);
  const { user, userLoading } = useAuthUser();
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [selected, setSelected] = useState(pageOpened || "");

  // New states to control mounting and animation classes for popups
  const [loginMounted, setLoginMounted] = useState(false);
  const [loginAnimClass, setLoginAnimClass] = useState("");

  const router = useRouter();

  useEffect(() => {
    if (user) setLogedIn(true);
    else {
      setLogedIn(false);
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

  const toggleShowLoginForm = () => {
    setShowLoginForm((prev) => !prev);
  };

  function homeClick() {
    router.push("/home");
  }

  function shopClick() {
    router.push("/shop");
  }

  function favClick() {
    router.push("/favorites");
  }

  function contactClick() {
    router.push("/contact-us");
  }
  function aboutClick() {
    router.push("/about-us");
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

  function profileClick() {
    const targetUrl = `/profile?acc=${user?.id}`;
    window.location.href = targetUrl;
  }

  const Buttons = [
    {
      btn_name: "Home",
      icon: <MdHome size={18} />,
      clickEvent: homeClick,
      isSelected: selected === "home",
    },
    {
      btn_name: "Shop",
      icon: <MdStore size={18} />,
      clickEvent: shopClick,
      isSelected: selected === "shop",
    },
    {
      btn_name: "Favorites",
      icon: (
        <MdFavorite
          size={18}
          className={`text-red-500 ${
            selected === "favorites" ? "text-red-400" : "text-red-500"
          }`}
        />
      ),
      clickEvent: favClick,
      isSelected: selected === "favorites",
    },
  ];

  const topBtns = [];

  if (!logedIn && !userLoading)
    topBtns.push({
      name: "Login",
      icon: <FaUser size={9.5} />,
      onClick: loginClick,
    });

  if (logedIn)
    topBtns.push({
      name: "Me",
      icon: <MdAccountCircle size={16} />,
      onClick: profileClick,
    });

  if (userLoading)
    topBtns.push({
      name: "Me",
      icon: <MdAccountCircle size={16} />,
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
    <div
      className={`w-full z-50 sticky -top-[155px] -mb-5 ${
        selected !== "home" && "-top-[55px]"
      }  lg:relative lg:top-0`}
    >
      {showLoginForm && (
        <div
          onClick={toggleShowLoginForm}
          className="fixed z-10 h-full w-full"
        />
      )}
      <div className="relative flex justify-center items-center w-full">
        <div className="flex flex-col relative justify-center w-full items-center">
          <div className="flex flex-col gap-6 lg:gap-0 w-full items-center justify-center z-0 ">
            <div
              className={`relative w-full bg-gradient-to-b from-[#69461e] via-[#c7802fc5] to-transparent ${
                selected !== "home" ? "pb-[70px]" : " pb-[170px]"
              } backdrop-blur-sm z-10`}
            >
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
                  className="w-auto h-[100px] transition-all ease-in-out"
                />
              </div>
            </div>
            <div className="w-full relative flex flex-col items-center justify-center gap-3 lg:mt-3 z-10">
              {selected === "home" ? (
                <div className="w-full flex items-center justify-center -mt-[190px]  lg:hidden">
                  <Image
                    src={logoLink}
                    alt="logo"
                    width={550}
                    height={550}
                    quality={100}
                    className="w-auto h-[80px] lg:h-[100px] transition-all ease-in-out"
                  />
                </div>
              ) : (
                <div className="-mt-[110px] lg:mt-[180px]"></div>
              )}
              <div
                className={`flex md:gap-3 items-center justify-center w-full lg:-mt-[260px]
                ${
                  selected !== "home" ? "backdrop-blur-none gap-1" : "gap-2"
                }  py-3`}
              >
                {selected !== "home" && (
                  <button
                    className="text-white bg-gradient-to-br hover:bg-gradient-radial to-[#442b0f] via-[#5d3c17] from-[#906434] p-1 px-2 rounded-xl"
                    onClick={() => window.history.back()}
                  >
                    <MdArrowBack />
                  </button>
                )}
                {Buttons.map((btn, i) => (
                  <button
                    key={i}
                    className={`flex gap-2 items-center justify-center py-1 px-4 lg:py-1.5 lg:px-5 text-xs lg:text-sm rounded-full border border-solid
                      border-[#9e6e3b] hover:shadow-sm hover:shadow-[#61401c]
                      ${
                        btn.isSelected
                          ? "bg-gradient-to-br to-[#442b0f] via-[#5d3c17] from-[#906434] text-white"
                          : "bg-white text-[#61401c]"
                      }
                  `}
                    onClick={btn.clickEvent}
                  >
                    {btn.icon}
                    {btn.btn_name}
                  </button>
                ))}
              </div>
            </div>
          </div>

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
