"use client";
import Footer from "@/components/footer";
import Header from "@/components/header";
import Loader from "@/components/loader";
import ProductCard_S from "@/components/productCard_S";
import React, { useEffect, useState } from "react";
import useAuthUser from "@/hooks/authUser";
import { MdAccountCircle } from "react-icons/md";
import Profile from "@/components/profile";

export default function ProfilePage() {
  const [id, setId] = useState(null);
  const [seller, setSeller] = useState(null);
  const [items, setItems] = useState([]);
  const [featuredItems, setFeaturedItems] = useState([]);
  const [premiumItems, setPremiumItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showAcc, setShowAcc] = useState(false);
  const [profileMounted, setProfileMounted] = useState(false);
  const [profileAnimClass, setProfileAnimClass] = useState("");

  const [UserIsSeller, setUserIsSeller] = useState(false);
  const { user, userLoading, logout } = useAuthUser();
  const sellerName = (seller?.firstName + " " + seller?.lastName).toUpperCase();

  useEffect(() => {
    if (user && !userLoading) {
      if (user.id == id) {
        setUserIsSeller(true);
      }
    }
  }, [user]);

  useEffect(() => {
    if (typeof window != "undefined") {
      const params = new URLSearchParams(window.location.search);
      let id = params.get("acc");
      if (id && id != "undefined") setId(id);
    }
  }, []);

  const toggleShowAcc = () => {
    setShowAcc((prev) => !prev);
  };
  const closeShowAcc = () => {
    setShowAcc(false);
  };

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

  useEffect(() => {
    if (id === null || id === "undefined") return;
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/user?userId=${id}`);
        const response2 = await fetch(`/api/allItems?sellerId=${id}`);
        if (!response.ok || !response2.ok) {
          throw new Error("Failed to fetch data");
        }
        const seller = await response.json();
        const itemsData = await response2.json();
        setItems(itemsData.items);
        setSeller(seller);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  useEffect(() => {
    const fItems = items.filter((item) => item.isfeatured === true);
    setFeaturedItems(fItems);
    const pItems = items
      .sort(
        (a, b) =>
          (b.isDiscounted ? b.discountedPrice : b.price) -
          (a.isDiscounted ? a.discountedPrice : a.price)
      )
      .slice(0, 5);
    setPremiumItems(pItems);
  }, [items]);

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
          <div className="w-full flex flex-col gap-12 pt-0 p-4 justify-start bg-gray-100 rounded-2xl mt-[52px] md:mt-[60px]">
            <div className="flex gap-4 mdd:gap-6 self-center items-center justify-start bg-gray-200 p-3 w-[93%] md:max-w-[600px]  rounded-2xl -mt-[52px] md:-mt-[60px] ">
              <img
                src={seller.profilePicture}
                alt={seller.firstName}
                className="h-20 md:h-24 aspect-square rounded-xl"
              />
              <div className="flex flex-col text-xs md:text-sm  ">
                <div className="font-extrabold">{sellerName}</div>
                <div>Total Products: {items.length}</div>
                {user && UserIsSeller && (
                  <div className="relative z-20 flex items-center justify-center">
                    <button
                      onClick={toggleShowAcc}
                      className="mt-1 z-20 flex gap-2 items-center justify-center w-full bg-gradient-to-br from-green-500 to-green-600 hover:bg-gradient-radial rounded-md p-0.5 md:p-1 px-2 text-white"
                    >
                      <MdAccountCircle /> Profile
                    </button>
                    {/* Profile popup */}
                    {profileMounted && (
                      <div
                        className={`absolute z-10 backdrop-blur-[8px] top-8 rounded-xl md:mr-10 ${
                          user?.role === "SELLER" && "lg:right-8 md:mr-5"
                        } ${profileAnimClass}`}
                      >
                        <Profile close={closeShowAcc} />
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
            {premiumItems.length > 0 && (
              <div className="flex flex-col gap-2">
                <h1 className="font-bold">Featured Products</h1>
                <div className="flex gap-3 w-full justify-start overflow-auto hidden_scroll_bar">
                  {featuredItems.map((item) => (
                    <ProductCard_S key={item.id} item={item} alt={true} />
                  ))}
                </div>
              </div>
            )}
            {premiumItems.length > 0 && (
              <div className="flex flex-col gap-2">
                <h1 className="font-bold">Premium Products</h1>
                <div className="flex gap-3 w-full overflow-auto hidden_scroll_bar">
                  {premiumItems.map((item) => (
                    <ProductCard_S key={item.id} item={item} alt={true} />
                  ))}
                </div>
              </div>
            )}
            <div className="flex flex-col gap-2">
              <h1 className="font-bold">All Products</h1>
              {items.length ? (
                <div
                  className={`grid h-fit grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3`}
                >
                  {items.map((item, i) => (
                    <ProductCard_S key={i} item={item} />
                  ))}
                </div>
              ) : (
                <div className="text-xs md:text-sm text-gray-500 bg-white p-2 w-full rounded-lg">
                  No products found.
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
