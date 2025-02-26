"use client";
import Footer from "@/components/footer";
import Header from "@/components/header";
import Loader from "@/components/loader";
import ProductCard_S from "@/components/productCard_S";
import React, { useEffect, useState } from "react";
import useAuthUser from "@/hooks/authUser";
import { MdAccountCircle } from "react-icons/md";
import { useRouter } from "next/navigation";

export default function Profile() {
  const [id, setId] = useState(null);
  const [seller, setSeller] = useState(null);
  const [items, setItems] = useState([]);
  const [featuredItems, setFeaturedItems] = useState([]);
  const [premiumItems, setPremiumItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [UserIsSeller, setUserIsSeller] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const { user, userLoading, logout } = useAuthUser();

  const router = useRouter();

  // Compute seller's full name only if seller data exists.
  const sellerName = seller
    ? `${seller.firstName} ${seller.lastName}`.toUpperCase()
    : "";

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const idParam = params.get("acc");
      if (idParam && idParam !== "undefined") setId(idParam);
    }
  }, []);

  // Set the user as seller if the current user's id matches the id in the URL.
  useEffect(() => {
    if (user && !userLoading) {
      setUserIsSeller(user.id == id);
    } else {
      setUserIsSeller(false);
    }
  }, [user, userLoading, id]);

  function toggleShowProfile() {
    setShowProfile((prev) => !prev);
  }

  // Get the id from the URL parameters

  // Fetch seller and items data based on the id.
  useEffect(() => {
    if (!id || id === "undefined") return;
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/user?userId=${id}`);
        const response2 = await fetch(`/api/allItems?sellerId=${id}`);
        if (!response.ok || !response2.ok) {
          throw new Error("Failed to fetch data");
        }
        const sellerData = await response.json();
        const itemsData = await response2.json();
        setSeller(sellerData);
        setItems(itemsData.items);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  // Filter featured items and create premium items without mutating the original items array.
  useEffect(() => {
    const fItems = items.filter((item) => item.isfeatured === true);
    setFeaturedItems(fItems);

    // Create a shallow copy of items before sorting.
    const sortedItems = [...items].sort(
      (a, b) =>
        (b.isDiscounted ? b.discountedPrice : b.price) -
        (a.isDiscounted ? a.discountedPrice : a.price)
    );
    setPremiumItems(sortedItems.slice(0, 5));
  }, [items]);

  return (
    <div className="flex flex-col gap-4 lg:gap-6 items-center">
      <Header />
      <div className="flex flex-col items-center justify-center w-full max-w-[1400px]">
        {loading ? (
          <div className="h-screen pt-6 px-5">
            <Loader />
          </div>
        ) : error ? (
          <div className="h-screen text-sm md:text-base text-gray-500 p-2 self-start px-5">
            {error}
          </div>
        ) : (
          <div className="w-full flex flex-col gap-12 pt-0 p-5 justify-start bg-gray-100 rounded-2xl mt-[52px] md:mt-[60px]">
            <div className="flex flex-col items-center justify-start self-center bg-gray-200 p-3 w-[93%] md:max-w-[600px] rounded-2xl -mt-[52px] md:-mt-[60px] overflow-hidden">
              <div className="flex gap-4 md:gap-6 self-start items-center justify-start">
                <img
                  src={seller.profilePicture}
                  alt={seller.firstName}
                  className="h-20 md:h-24 aspect-square rounded-xl"
                />
                <div className="flex flex-col text-xs md:text-sm">
                  <div className="font-extrabold">{sellerName}</div>
                  <div>Total Products: {items.length}</div>
                  {UserIsSeller && (
                    <button
                      onClick={toggleShowProfile}
                      className="mt-1 flex gap-2 items-center justify-center w-full bg-gradient-to-br from-green-500 to-green-600 hover:bg-gradient-radial rounded-md p-0.5 md:p-1 px-2 text-white"
                    >
                      <MdAccountCircle /> Profile
                    </button>
                  )}
                </div>
              </div>
              {UserIsSeller && (
                <div
                  className={`transition-all duration-300 ease-in-out overflow-hidden text-xs md:text-sm bg-white rounded-xl ${
                    showProfile
                      ? "max-h-[200px] opacity-100 m-3 p-4"
                      : "max-h-0 opacity-0 m-0 p-0"
                  }`}
                >
                  <div>
                    <strong>Name:</strong> {seller.firstName} {seller.lastName}
                    <br />
                    <strong>Email:</strong> {seller.email}
                    <br />
                    <strong>Contact:</strong> {seller.phoneNo}
                    <br />
                    <strong>Role:</strong> {seller.role.toLowerCase()}
                    <br />
                    <button
                      onClick={logout}
                      className="mt-1 flex gap-2 items-center justify-center w-full bg-gradient-to-br from-red-500 to-red-600 hover:bg-gradient-radial rounded-md p-0.5 md:p-1 px-2 text-white"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
            {/* Filters Section */}
            <input
              type="search"
              className="w-full -mt-7 md:max-w-[350px] md:self-end border bg-white-100 p-3 rounded-xl 
                text-xs md:text-sm focus:outline-none
                "
              placeholder="search in store..."
            />
            {featuredItems.length > 0 && (
              <div className="flex flex-col gap-2">
                <h1 className="font-bold">Featured Products</h1>
                <div className="flex gap-4 w-full justify-start overflow-auto hidden_scroll_bar">
                  {featuredItems.map((item) => (
                    <ProductCard_S key={item.id} item={item} alt={true} />
                  ))}
                </div>
              </div>
            )}
            {premiumItems.length > 0 && (
              <div className="flex flex-col gap-2">
                <h1 className="font-bold">Premium Products</h1>
                <div className="flex gap-4 w-full overflow-auto hidden_scroll_bar">
                  {premiumItems.map((item) => (
                    <ProductCard_S key={item.id} item={item} alt={true} />
                  ))}
                </div>
              </div>
            )}
            <div className="flex flex-col gap-2">
              <h1 className="font-bold">All Products</h1>
              {items.length ? (
                <div className="grid h-fit grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3">
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
