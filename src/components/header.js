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
    { btn_name: "Shop", icon: <MdShop size={18} />, clickEvent: shopClick },
    {
      btn_name: "Contact",
      icon: <MdPhone size={18} />,
      clickEvent: contactClick,
    },
    {
      btn_name: "About Us",
      icon: <MdInfo size={18} />,
      clickEvent: aboutClick,
    },
  ];

  const topBtns = [
    {
      name: "Favorites",
      icon: <MdFavorite />,
      onClick: favClick,
    },
  ];

  !logedIn &&
    topBtns.push({
      name: "Login",
      icon: <FaUser size={9.5} />,
      onClick: loginClick,
    });

  logedIn &&
    user?.role == "ADMIN" &&
    topBtns.push({
      name: "Admin Dashboard",
      icon: <MdDashboard />,
      onClick: adminDBClick,
    });

  logedIn &&
    topBtns.push({
      name: "Seller Dashboard",
      icon: <MdDashboard />,
      onClick: sellerDBClick,
    });

  logedIn &&
    topBtns.push({
      name: "My Account",
      icon: <MdAccountCircle size={16} />,
      onClick: accountClick,
    });

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
          <div className="flex flex-col gap-3 w-full items-center justify-center z-0">
            <div className="flex flex-col w-full">
              <div
                className="flex gap-3 md:gap-6 w-full flex-wrap items-center justify-center lg:justify-end 
              bg-gradient-to-b  from-[#6e4519] via-[#9e6e3b] to-transparent p-5 pt-7 pb-14 z-10"
              >
                {topBtns.map((btn, i) => (
                  <button
                    key={i}
                    className="text-white flex items-center text-xs justify-center gap-1.5  hover:text-[#fbe4bf] "
                    onClick={btn.onClick}
                  >
                    <div className="mb-0.5">{btn.icon}</div>
                    {btn.name}
                  </button>
                ))}
              </div>
              {/* <div className="w-full -mt-2 h-14 bg-gradient-to-b from-[#6e4519] via-[#6e4519] to-transparent pointer-events-none"/> */}
            </div>
            <div className="relative w-full flex items-center justify-center">
              <Image
                src={logoLink}
                alt={"logo"}
                width={550}
                height={550}
                quality={100}
                className={`w-auto h-[70px] md:h-[50px] transition-all ease-in-out "
                `}
              />
              <button
                className="absolute left-6 lg:hidden text-white bg-gradient-to-br hover:bg-gradient-radial from-[#9e6e3b] via-[#9e6e3b] to-[#6e4519] p-1 px-4 rounded-xl"
                onClick={() => window.history.back()}
              >
                <MdArrowBack />
              </button>
            </div>
            <div className="flex gap-2 md:gap-3 ">
              {Buttons.map((btn, i) => (
                <button
                  key={i}
                  className="py-1 px-4 md:py-1.5 md:px-5 text-xs md:text-sm rounded-full border border-solid border-[#9e6e3b] text-[var(--btn-bg-sec)] hover:shadow-sm hover:shadow-[var(--btn-bg-sec)]"
                  onClick={btn.clickEvent}
                >
                  {btn.btn_name}
                </button>
              ))}
            </div>
          </div>
          {showAcc && (
            <div className="absolute top-24 z-20">
              <Profile />
            </div>
          )}
          {showLoginForm && (
            <div className="absolute top-[56px] z-20">
              <LoginForm />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
