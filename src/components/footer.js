import React from "react";
import { FaEnvelope, FaInstagram } from "react-icons/fa";
import { SiFacebook, SiGoogleplay, SiYoutube } from "react-icons/si";

export default function Footer() {
  const date = new Date();
  const logoLink = "/logo.png";
  // const logoLink =
  //   "https://lh3.googleusercontent.com/pw/AP1GczN9HraQsHh0pJ0YoBThzcS0tY_-uk5zyQquRDFTVgpN6peh1An56u-fUREcdmwVRl0gE_E7MGnSXH_Zsj-fjMW8nIFHQ8lKIep5Xwi6TKKsPZa7kyQLrqofq3dw8994xfpRNfHIjbG257eM0pMU9f4U=w658-h263-s-no-gm";

  return (
    <div className="flex w-full flex-col items-center px-4 mt-10 md:px-6">
      <div className="flex flex-col justify-center w-full max-w-[1200px]">
        <div className="flex flex-col md:flex-row gap-8 md:gap-16 justify-center md:justify-evenly items-center md:items-end w-full p-4 px-2 md:px-6 ">
          <div className="flex flex-col items-center justify-center md:pb-3">
            <img src={logoLink} alt="logo" className="h-[60px] md:h-[90px] " />
          </div>
          <div className="flex flex-col min-w-[90%] md:min-w-fit md:w-auto justify-center gap-4 text-[var(--text-prim)] text-[12px] md:text-[14px] ">
            <div className="flex gap-6 md:gap-32 justify-center">
              <div className="flex flex-col w-full md:w-auto gap-4">
                <div className="flex items-center gap-3">
                  <SiFacebook className="text-lg md:text-xl" />
                  <p>Royal Aseel Farms</p>
                </div>
                <div className="flex items-center gap-3">
                  <FaInstagram className="text-lg md:text-xl" />
                  <p>@royalaseelfarms</p>
                </div>
              </div>
              <div className="flex flex-col w-full md:w-auto text-[var(--text-prim)] text-[12px] md:text-[14px] gap-4">
                <div className="flex items-center gap-3">
                  <SiYoutube className="text-lg md:text-xl" />
                  <p>Royal Aseel Farms</p>
                </div>
                <div className="flex items-center gap-3">
                  <SiGoogleplay className="text-lg md:text-xl" />
                  <p>Royal Aseel Farms</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <FaEnvelope className="text-lg md:text-xl" />
              <p>royalaseelfarms@gmail.com</p>
            </div>
          </div>
        </div>
        <hr className="h-[1px] w-full bg-[#c1c1c1a6]  border-none" />
        <div className="flex flex-col md:flex-row justify-between p-2 pb-4 text-[10px] md:text-[12px] text-[[var(--text-sec)]] text-center md:text-left">
          <p>The Royal Aseel Farms™</p>
          <p>Copyright © {date.getFullYear()} - All Rights Reserved</p>
        </div>
      </div>
    </div>
  );
}
