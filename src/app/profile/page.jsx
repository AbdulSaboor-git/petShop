"use client";
import Footer from "@/components/footer";
import Header from "@/components/header";
import Loader from "@/components/loader";
import React, { useEffect, useState } from "react";

export default function Profile() {
  const [id, setId] = useState(null);
  const [seller, setSeller] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const sellerName = (seller?.firstName + " " + seller?.lastName).toUpperCase();
  useEffect(() => {
    if (typeof window != "undefined") {
      const params = new URLSearchParams(window.location.search);
      let id = params.get("acc");
      if (id && id != "undefined") setId(id);
    }
  }, []);

  useEffect(() => {
    if (id === null || id === "undefined") return;
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/user?userId=${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const seller = await response.json();
        setSeller(seller);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  return (
    <div className="flex flex-col gap-4 lg:gap-6 items-center">
      <Header />
      <div className="flex flex-col items-center justify-center w-full max-w-[1400px] px-5">
        {loading ? (
          <div className="h-screen pt-6">
            <Loader />
          </div>
        ) : error ? (
          <div className="h-screen text-sm md:text-base text-gray-500 p-2  self-start">
            {error}
          </div>
        ) : (
          <div className="w-full flex flex-col gap-4 items-center justify-start h-screen bg-gray-100 rounded-2xl mt-[52px] md:mt-[60px]">
            <div className="flex gap-6 items-center justify-start bg-gray-200 p-3 w-[85%] md:max-w-[600px]  rounded-2xl -mt-[52px] md:-mt-[60px]">
              <img
                src={seller.profilePicture}
                alt={seller.firstName}
                className="h-20 md:h-24 aspect-square rounded-xl"
              />
              <div className="text-xs md:text-sm ">
                <div className="font-extrabold">{sellerName}</div>
                <div>Total Products: {seller.items.length}</div>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
