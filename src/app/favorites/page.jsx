"use client";
import React, { useEffect, useRef, useState } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import FavItem from "./components/fav-item";
import Order from "@/components/order";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { triggerNotification } from "@/redux/notificationThunk";

export default function Favourites() {
  const [selectedItem, setSelectedItem] = useState(null);
  const [checkout, setCheckout] = useState(false);
  const orderConfirmationRef = useRef(null);
  const [favoriteIds, setFavoriteIds] = useState([]);
  const [favorites, setFavorites] = useState([]); // these are the full item objects
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  const dispatch = useDispatch();
  const showMessage = (msg, state) => {
    dispatch(
      triggerNotification({
        msg: msg,
        success: state,
      })
    );
  };
  // Handle selecting an item (for example to show details in checkout)
  const handleSelectItem = (item) => {
    setCheckout(false);
    setSelectedItem((prev) => (prev === item ? null : item));
  };

  function shopClick() {
    router.push(`/shop`);
  }
  // Handle checkout (scroll to confirmation section)
  const handleCheckout = () => {
    setCheckout(true);
    setTimeout(() => {
      const offset = 0;
      const elementPosition =
        orderConfirmationRef.current.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }, 100);
  };

  // Load favorite IDs from localStorage once when the component mounts
  useEffect(() => {
    const storedFavoriteIds = localStorage.getItem("favorites");
    if (storedFavoriteIds) {
      try {
        const parsedIds = JSON.parse(storedFavoriteIds);
        setFavoriteIds(parsedIds);
      } catch (err) {
        console.error("Error parsing favorites", err);
        setFavoriteIds([]);
      }
    } else {
      localStorage.setItem("favorites", JSON.stringify([]));
      setFavoriteIds([]);
    }
  }, []);

  // Whenever favoriteIds change, fetch the full item details from your backend.
  // You should create an API endpoint (e.g. /api/itemsByIds) that accepts the IDs.
  useEffect(() => {
    async function fetchFavorites() {
      if (favoriteIds.length === 0) {
        setFavorites([]);
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        // Build a query string of ids, e.g., ?ids=1,2,3
        const queryString = favoriteIds.join(",");
        const response = await fetch(
          `/api/favItems?ids=${encodeURIComponent(queryString)}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch favorite items");
        }
        const data = await response.json();
        // Assume the API returns an array of item objects
        setFavorites(data.items);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchFavorites();
  }, [favoriteIds]);

  // Remove a favorite item by its ID.
  const handleRemoveFav = (itemId) => {
    setCheckout(false);
    const updatedIds = favoriteIds.filter((id) => id !== itemId);
    setFavoriteIds(updatedIds);
    localStorage.setItem("favorites", JSON.stringify(updatedIds));
    showMessage("Removed from favorites", true);
  };

  return (
    <div className="flex flex-col items-center gap-10 min-h-screen">
      <Header />
      <div className="flex flex-col gap-3 w-full max-w-[800px] p-4">
        <div className="flex justify-between items-center px-1">
          <h1 className="font-bold ">My Favorites ({favorites.length})</h1>
          {/* You can add bulk delete functionality here if needed */}
        </div>
        <div className="flex flex-col gap-2">
          {loading ? (
            <div className="text-xs md:text-sm w-full rounded-lg bg-gray-100 text-gray-400 border p-2">
              loading favorites...
            </div>
          ) : error ? (
            <div className="text-xs md:text-sm w-full rounded-lg bg-gray-100 text-gray-400 border p-2">
              {error}
            </div>
          ) : favorites.length > 0 ? (
            favorites.map((item) => (
              <FavItem
                key={item.id}
                item={item}
                handleSelectItem={handleSelectItem}
                handleRemoveFav={handleRemoveFav}
                isSelected={selectedItem?.id === item.id}
              />
            ))
          ) : (
            <div className="flex flex-col gap-4 justify-center items-center">
              <div className="text-xs md:text-sm w-full rounded-lg bg-gray-100 text-gray-400 border p-2">
                Favorites list is empty
              </div>
              <button
                onClick={shopClick}
                className="text-sm md:text-base w-fit rounded-lg bg-gradient-to-br hover:bg-gradient-radial from-orange-500 via-orange-500 to-orange-600 text-white p-1 px-3"
              >
                Shop Now
              </button>
            </div>
          )}
        </div>
        <div className="flex flex-col gap-2 border-t border-gray-300 mt-6 p-5">
          <button
            className="text-xs md:text-sm w-fit cursor-pointer self-end text-white bg-gradient-to-br hover:bg-gradient-radial from-orange-500 via-orange-500 to-orange-600 px-3 py-2 rounded-lg disabled:opacity-75 disabled:cursor-default disabled:hover:bg-orange-500"
            onClick={handleCheckout}
            disabled={selectedItem === null}
          >
            Inquire from Seller
          </button>
        </div>

        <div
          ref={orderConfirmationRef}
          className={`w-full max-w-[500px] flex items-center justify-center ${
            checkout
              ? "opacity-100 h-full py-5"
              : "opacity-0 h-0 pointer-events-none"
          } transition-all duration-500`}
        >
          <Order
            item={selectedItem}
            closeOrderPage={() => setCheckout(false)}
          />
        </div>
      </div>
      <Footer />
    </div>
  );
}
