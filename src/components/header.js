"use client";
import React, { useState, useEffect, useRef } from "react";
import { FaEnvelope, FaHeart, FaPhone, FaShoppingCart, FaUser } from "react-icons/fa";
import { } from "react-icons/si";
import { MdAccountCircle, MdClose, MdDashboard, MdFavorite, MdFavoriteBorder, MdMenu, MdSettings, MdStar, MdStarHalf, MdStars, MdTrolley } from "react-icons/md";
import { RiHeart2Line, RiHeartLine, RiHeartsLine } from "react-icons/ri";
import Image from "next/image";
import { AppBar, Button, IconButton } from "@mui/material";
import { Menu } from "@mui/icons-material";

export default function Header({
  user,
  Buttons,
  contact
}) {
  const [isOpen, setIsOpen] = useState(false);
  const logedIn = false;
  const isAdmin = true;
  const theme = true;
  const logoLink = theme
    ? "https://lh3.googleusercontent.com/pw/AP1GczN9HraQsHh0pJ0YoBThzcS0tY_-uk5zyQquRDFTVgpN6peh1An56u-fUREcdmwVRl0gE_E7MGnSXH_Zsj-fjMW8nIFHQ8lKIep5Xwi6TKKsPZa7kyQLrqofq3dw8994xfpRNfHIjbG257eM0pMU9f4U=w658-h263-s-no-gm"
    : "https://lh3.googleusercontent.com/pw/AP1GczP9XQIrnoVRw2kYBcnVxH8YYxN-SykWCV3zqQKMNev0_k6-Avre4beasxj4GhyKMmQvBKxB4aixxiopYtbKylT2sZbS8Mds7hgD6pL6y1Pc2-ZS2aCOg4K2JWKuTX_Cz9RGVnD3yYEECkwl9j2E59TF=w1350-h540-s-no-gm";
  const defaultProfilePictureLink =
    "https://lh3.googleusercontent.com/pw/AP1GczM2cnSQPHG8oKKskeSFKCFjs3z_NG31Tt4bQPqb4Fp-Qdteh0m-84BjSvDgQTkscceDPu1eD1Rs2OxUSd0InRuqnowixs1x8kqSVIcu_7BbkBi4XFK13ZqIeq56OxPw0bzq0hoUgYtTHteuYB1cTI-K=w883-h883-s-no-gm";



  const openSidebar = () => {
    setIsOpen(true);
  };

  const closeSidebar = () => {
    setIsOpen(false);
  };


  const topBtns = [
    {
      name: "Wishlist",
      icon: <MdFavorite />
    },
    {
      name: "Cart",
      icon: <FaShoppingCart size={11} />
    },
  ]

  logedIn ? topBtns.push(
    {
      name: "My Account",
      icon: <FaUser size={9.5} />
    },
  ) :
    topBtns.push(
      {
        name: "Login",
        icon: <FaUser size={9.5} />
      },
    )

  isAdmin && topBtns.push({
    name: "Admin Dashboard",
    icon: <MdDashboard />
  })





  return (
    <div className="w-full">
      <div
        onClick={closeSidebar}
        className={`md:hidden fixed h-screen w-full z-40  ${isOpen ? "translate-x-0" : "-translate-x-[100%]"
          }`}
      ></div>
      <div className="relative flex justify-center items-center z-50">
        {(user || Buttons) && (
          <div>
            <div
              className={`absolute left-4 mt-5 md:hidden`}
            >
              <IconButton edge="start" aria-label="menu"
                onClick={openSidebar}
                className="text-[var(--btn-icons)] hover:text-[var(--btn-icons-sec)]">
                <Menu></Menu>
              </IconButton>
            </div>
            <div
              className={`z-20 md:hidden fixed h-full top-0 left-[-10px] w-[230px] rounded-e-[30px] sidebar bg-[var(--background-prim)] text-[var(--text-prim)] border-r  border-gray-300 transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "-translate-x-[240px]"
                }`}
              style={{ boxShadow: "0 0 20px -5px #404040" }}
            >
              <IconButton
                onClick={closeSidebar}
                className="absolute top-4 right-4 text-[var(--text-sec)]"
              >
                <MdClose style={{ fontSize: "1rem" }} />
              </IconButton>

              <div className="flex flex-col items-start py-6">
                <div
                  className="cursor-pointer flex flex-col justify-center items-center  font-[500] text-[12px] gap-1 ml-6"
                >
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
                    {Buttons.map(
                      (btn, index) =>
                        <Button
                          onClick={btn.clickEvent}
                          className={`w-full justify-start hover:bg-[var(--text-alt-2)]  text-[var(--text-prim)] ${btn.btn_name === "Logout" &&
                            "text-[#fc6060] font-semibold"
                            } text-[11px] px-6 py-[10px]`}
                          key={index}
                        >
                          <div className="flex gap-3 items-center ">
                            <div className="mb-0.5">
                              {btn.icon}
                            </div>
                            {btn.btn_name}
                          </div>
                        </Button>

                    )}
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
        )}

        <div
          onClick={closeSidebar}
          className="flex flex-col justify-center w-full items-center"
        >
          <div className="flex flex-col gap-3 w-full items-center justify-center">
            <div className="w-full flex flex-col bg-[#9e6e3b]">
              <div className="flex gap-2 text-xs justify-center items-center w-full p-1.5 px-5 bg-orange-950 text-white">
                <MdStar color="#ff0" size={15} /> Special Discounts!
              </div>
              <div className="flex self-center gap-5 text-[11px] md:text-xs justify-center md:justify-between items-center w-full p-2 md:p-1 px-5 max-w-[1300px] text-white ">
                <div className="hidden md:flex items-center gap-6 font-medium text-[10px]">
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
                  {
                    topBtns.map((btn, i) => (
                      <IconButton edge='start' key={i} className="text-white flex items-center text-[11px] md:text-xs justify-center gap-1.5  hover:text-[#fbe4bf] ">
                        <div className="mb-0.5">
                          {btn.icon}
                        </div>
                        {btn.name}
                      </IconButton>

                    ))
                  }
                </div>
              </div>

            </div>

            <div className="flex items-center gap-10">
              <Image
                src={logoLink}
                alt={"logo"}
                width={550}
                height={550}
                quality={100}
                className={`w-auto h-[70px] md:h-[50px] transition-all ease-in-out "
                  `}
              />
              <div className="hidden md:flex gap-3 text-sm">
                {
                  Buttons.map((btn, i) => (
                    <Button key={i}
                      className=" py-1.5 px-5 rounded-full border border-solid border-[var(--btn-bg-sec] text-[var(--btn-bg-sec)] hover:shadow-sm hover:shadow-[var(--btn-bg-sec)]"
                      onClick={btn.clickEvent}
                    >
                      {btn.btn_name}
                    </Button>
                  ))
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
