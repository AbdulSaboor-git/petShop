"use client";
import React, { useEffect, useRef, useState } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import FavItem from "./components/fav-item";
import Order from "@/components/order";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { triggerNotification } from "@/redux/notificationThunk";
import { MdStore } from "react-icons/md";

export default function Favourites() {
  const [groupedFavorites, setGroupedFavorites] = useState([]); // grouped by seller (from API)
  const [selectedSellerId, setSelectedSellerId] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]); // items selected from the current seller
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  const [checkout, setCheckout] = useState(false);
  const orderConfirmationRef = useRef(null);
  const dispatch = useDispatch();

  const showMessage = (msg, success) => {
    dispatch(
      triggerNotification({
        msg,
        success,
      })
    );
  };

  function shopClick() {
    router.push(`/shop`);
  }

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

  // This function loads your favorites from localStorage and then fetches the full grouped data
  useEffect(() => {
    async function fetchFavorites() {
      try {
        const storedFavoriteIds = localStorage.getItem("favorites");
        if (!storedFavoriteIds) {
          localStorage.setItem("favorites", JSON.stringify([]));
          setGroupedFavorites([]);
          return;
        }
        const favoriteIds = JSON.parse(storedFavoriteIds); // assume this is an array of IDs
        if (favoriteIds.length === 0) {
          setGroupedFavorites([]);
          return;
        }
        const queryString = favoriteIds.join(",");
        const response = await fetch(
          `/api/favItems?ids=${encodeURIComponent(queryString)}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch favorite items");
        }
        const data = await response.json();
        // Assume API returns data.groupedItemsArray (an array of groups)
        // Each group: { seller: { id, firstName, lastName, ... }, items: [ ... ] }
        setGroupedFavorites(data.groupedItemsArray);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchFavorites();
  }, []);

  // Handler for toggling an individual item selection.
  const handleToggleItem = (sellerId, item) => {
    setCheckout(false);
    // If no seller is selected yet or the same seller is selected:
    if (selectedSellerId === null || selectedSellerId === sellerId) {
      if (selectedItems.some((i) => i.id === item.id)) {
        // Remove item from selection
        const newSelection = selectedItems.filter((i) => i.id !== item.id);
        setSelectedItems(newSelection);
        if (newSelection.length === 0) {
          setSelectedSellerId(null);
        }
      } else {
        // Add item to selection
        setSelectedSellerId(sellerId);
        setSelectedItems([...selectedItems, item]);
      }
    } else {
      // Different seller selected: clear previous selection and set new seller with this item
      setSelectedSellerId(sellerId);
      setSelectedItems([item]);
    }
  };

  // Handler for "Select All" within a seller group.
  const handleSelectAllForSeller = (sellerId, items) => {
    setCheckout(false);
    if (
      selectedSellerId === sellerId &&
      selectedItems.length === items.length
    ) {
      // All items already selected, so deselect them.
      setSelectedSellerId(null);
      setSelectedItems([]);
    } else {
      setSelectedSellerId(sellerId);
      setSelectedItems(items);
    }
  };

  // Handler for removing a favorite item completely.
  const handleRemoveFav = (itemId) => {
    // Remove the item from the stored favorite IDs.
    // (You might also update your groupedFavorites state accordingly.)
    const allIds = groupedFavorites.reduce(
      (acc, group) => [...acc, ...group.items.map((i) => i.id)],
      []
    );
    const updatedIds = allIds.filter((id) => id !== itemId);
    localStorage.setItem("favorites", JSON.stringify(updatedIds));
    showMessage("Removed from favorites", true);
    // Re-fetch the favorites after removal.
    // (Alternatively, remove from groupedFavorites manually.)
    // For simplicity, we re-run the useEffect by updating state:
    setLoading(true);
    setGroupedFavorites([]);
    setTimeout(() => {
      // Simulate re-fetching
      window.location.reload();
    }, 500);
  };

  return (
    <div className="flex flex-col items-center gap-10 min-h-screen">
      <Header />
      <div className="flex flex-col gap-3 w-full max-w-[800px] p-4">
        <div className="flex justify-between items-center px-1">
          <h1 className="font-bold md:text-lg">My Favorites</h1>
        </div>
        {loading ? (
          <div className="text-xs md:text-sm w-full rounded-lg bg-gray-100 text-gray-400 border p-2">
            Loading favorites...
          </div>
        ) : error ? (
          <div className="text-xs md:text-sm w-full rounded-lg bg-gray-100 text-gray-400 border p-2">
            {error}
          </div>
        ) : groupedFavorites.length > 0 ? (
          groupedFavorites.map((group) => (
            <div
              key={group.seller.id}
              className="flex flex-col items-center w-full justify-center gap-2 bg-gray-100 p-2 py-4 rounded-lg"
            >
              <div className="flex w-full items-center justify-between px-1.5">
                <div className="flex items-center justify-center gap-4 px-3">
                  {/* Select All checkbox */}
                  <input
                    type="checkbox"
                    className="accent-orange-600"
                    checked={
                      selectedSellerId === group.seller.id &&
                      selectedItems.length === group.items.length
                    }
                    onChange={() =>
                      handleSelectAllForSeller(group.seller.id, group.items)
                    }
                  />
                  <div className="flex gap-2 items-center text-sm md:text-base font-semibold">
                    <MdStore size={15} className="mb-0.5" />
                    {group.seller.firstName + " " + group.seller.lastName}
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-2 w-full">
                {group.items.map((item) => (
                  <FavItem
                    key={item.id}
                    item={item}
                    handleSelectItem={() =>
                      handleToggleItem(group.seller.id, item)
                    }
                    isSelected={
                      selectedSellerId === group.seller.id &&
                      selectedItems.some((i) => i.id === item.id)
                    }
                    handleRemoveFav={() => handleRemoveFav(item.id)}
                  />
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col gap-4 justify-center items-center">
            <div className="text-xs md:text-sm w-full rounded-lg bg-gray-100 text-gray-400 border p-2">
              Favorites list is empty
            </div>
            <button
              onClick={shopClick}
              className="text-sm md:text-base w-fit rounded-lg bg-gradient-to-br from-orange-500 via-orange-500 to-orange-600 text-white p-1 px-3"
            >
              Shop Now
            </button>
          </div>
        )}
        {/* Order section: Pass selectedItems (from the currently selected seller) */}
        <div className="flex flex-col gap-2 border-t border-gray-300 mt-6 p-5">
          <button
            onClick={handleCheckout}
            className="text-xs md:text-sm w-fit cursor-pointer self-end text-white bg-gradient-to-br hover:bg-gradient-radial from-orange-500 via-orange-500 to-orange-600 px-3 py-2 rounded-lg disabled:opacity-75 disabled:cursor-default disabled:hover:bg-gradient-to-br"
            disabled={selectedItems.length === 0}
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
            items={selectedItems}
            closeOrderPage={() => setCheckout(false)}
          />
        </div>
      </div>
      <Footer />
    </div>
  );
}
