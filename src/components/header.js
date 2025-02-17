"use client";
import React, { useState, useEffect, useRef } from "react";
import { FaEnvelope, FaPhone, FaUser } from "react-icons/fa";
import {
  MdAccountBox,
  MdAccountCircle,
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

  const contact = {
    phone: "(+92) 321 855 9574",
    email: "petshop@gmail.com",
  };

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
      name: "Favourites",
      icon: <MdFavorite />,
      onClick: favClick,
    },
  ];

  !logedIn &&
    topBtns.push({
      name: "Seller Login",
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
      <div className="relative flex justify-center items-center">
        {/* {(user || Buttons) && (
          <div>
            <div className={`absolute left-4 mt-5 md:hidden`}>
              <button
                edge="start"
                aria-label="menu"
                onClick={openSidebar}
                className="text-[var(--btn-icons)] hover:text-[var(--btn-icons-sec)]"
              >
                <Menu></Menu>
              </button>
            </div>
            <div
              className={`z-20 md:hidden fixed h-full top-0 left-[-10px] w-[230px] rounded-e-[30px] sidebar bg-[var(--background-prim)] text-[var(--text-prim)] border-r  border-gray-300 transition-transform duration-300 ease-in-out ${
                isOpen ? "translate-x-0" : "-translate-x-[240px]"
              }`}
              style={{ boxShadow: "0 0 20px -5px #404040" }}
            >
              <button
                onClick={closeSidebar}
                className="absolute top-4 right-4 text-[var(--text-sec)]"
              >
                <MdClose style={{ fontSize: "1rem" }} />
              </button>

              <div className="flex flex-col items-start py-6">
                <div className="cursor-pointer flex flex-col justify-center items-center  font-[500] text-[12px] gap-1 ml-6">
                  <img
                    className="w-[60px] h-[60px] object-cover hover:scale-[1.03] transition-all rounded-full"
                    src={defaultProfilePictureLink}
                    alt="avatar"
                  />
                  <p className="max-w-[120px] max-h-[40px] overflow-hidden text-[var(--text-sec)]">
                    username
                  </p>
                </div>
                <div className="flex flex-col w-full">
                  <div className="flex flex-col pt-8">
                    {Buttons.map((btn, index) => (
                      <button
                        onClick={btn.clickEvent}
                        className={`w-full justify-start hover:bg-[var(--text-alt-2)]  text-[var(--text-prim)] ${
                          btn.btn_name === "Logout" &&
                          "text-[#fc6060] font-semibold"
                        } text-[11px] px-6 py-[10px]`}
                        key={index}
                      >
                        <div className="flex gap-3 items-center ">
                          <div className="mb-0.5">{btn.icon}</div>
                          {btn.btn_name}
                        </div>
                      </button>
                    ))}
                  </div>
                  <div className="flex flex-col absolute w-[190px] bottom-2 gap-1.5  ml-6">
                    <hr className="h-[1px] border-none bg-[#afafaf99]" />
                    <div className="flex justify-center w-[190px] text-[12px] px-2">
                      <img className="h-[40px]" src={logoLink} alt="logo" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )} */}

        <div
          // onClick={closeSidebar}
          className="flex flex-col relative justify-center w-full items-center "
        >
          <div className="flex flex-col gap-3 w-full items-center justify-center z-0">
            <div className="w-full flex flex-col bg-[#9e6e3b]">
              <div className="flex gap-2 text-xs justify-center items-center w-full p-1.5 px-5 bg-orange-950 text-white">
                <MdStar color="#ff0" size={15} /> Special Discounts!
              </div>
              <div className="flex self-center gap-5 text-[11px] lg:text-xs justify-center lg:justify-between items-center w-full p-2 lg:p-1 lg:px-4 max-w-[1300px] text-white ">
                <div className="hidden lg:flex items-center gap-6 font-medium text-[10px]">
                  <div className="flex gap-2 cursor-pointer items-center hover:text-[#fbe4bf]">
                    <FaPhone className="mb-0.5" />
                    {contact.phone}
                  </div>
                  <div className="flex gap-2 cursor-pointer items-center hover:text-[#fbe4bf]">
                    <FaEnvelope className="mb-0.5" />
                    {contact.email}
                  </div>
                </div>
                <div className="flex gap-3 md:gap-6 flex-wrap items-center justify-center">
                  {topBtns.map((btn, i) => (
                    <button
                      key={i}
                      className="text-white flex items-center text-[11px] md:text-xs justify-center gap-1.5  hover:text-[#fbe4bf] "
                      onClick={btn.onClick}
                    >
                      <div className="mb-0.5">{btn.icon}</div>
                      {btn.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <Image
              src={logoLink}
              alt={"logo"}
              width={550}
              height={550}
              quality={100}
              className={`w-auto h-[70px] md:h-[50px] transition-all ease-in-out "
                  `}
            />
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
