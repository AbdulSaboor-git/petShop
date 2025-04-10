"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import FavItem from "./components/fav-item";
import Order from "@/components/order";
import { useRouter } from "next/navigation";
import { MdStore } from "react-icons/md";
import { RiArrowRightSLine } from "react-icons/ri";
import { showMessage } from "@/hooks/useMessage";

export default function Favourites() {
  const [groupedFavorites, setGroupedFavorites] = useState([]); // grouped by seller (from API)
  const [selectedSellerId, setSelectedSellerId] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]); // items selected from the current seller
  const [favoriteIds, setFavoriteIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  const [checkout, setCheckout] = useState(false);
  const orderConfirmationRef = useRef(null);

  function shopClick() {
    router.push(`/shop`);
  }

  const handleCheckout = () => {
    setCheckout(true);
    setTimeout(() => {
      const offset = 10;
      const elementPosition =
        orderConfirmationRef.current.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }, 100);
  };

  useEffect(() => {
    const storedFavoriteIds = localStorage.getItem("favorites");
    if (storedFavoriteIds && storedFavoriteIds !== "undefined") {
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

  // This function loads your favorites from localStorage and then fetches the full grouped data
  const fetchFavorites = useCallback(async () => {
    try {
      if (favoriteIds.length === 0) {
        setGroupedFavorites([]);
        return;
      }
      setLoading(true);
      const queryString = encodeURIComponent(favoriteIds.join(","));
      const response = await fetch(`/api/favItems?ids=${queryString}`);
      if (!response.ok) {
        throw new Error("Failed to fetch favorite items");
      }
      const data = await response.json();
      setGroupedFavorites(data.groupedItemsArray);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [favoriteIds]);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  // Handler for toggling an individual item selection.
  const handleToggleItem = (sellerId, item) => {
    setCheckout(false);

    setSelectedItems((prev) => {
      const isSelected = prev.some((i) => i.id === item.id);

      if (selectedSellerId !== sellerId) {
        setSelectedSellerId(sellerId);
        // Reset selection if switching to a different seller
        return [item];
      }

      const updatedItems = isSelected
        ? prev.filter((i) => i.id !== item.id) //  Remove item if already selected
        : [...prev, item];

      setSelectedSellerId(updatedItems.length ? sellerId : null); //  Updates seller only if items remain
      return updatedItems;
    });
  };

  // Handler for "Select All" within a seller group.
  const handleSelectAllForSeller = (sellerId, items) => {
    const availableItems = items.filter((i) => i.availability === "AVAILABLE");
    setCheckout(false);
    if (
      selectedSellerId === sellerId &&
      selectedItems.length === availableItems.length
    ) {
      // All items already selected, so deselect them.
      setSelectedSellerId(null);
      setSelectedItems([]);
    } else {
      setSelectedSellerId(sellerId);
      setSelectedItems(availableItems);
    }
  };

  // Handler for removing a favorite item completely.
  const handleRemoveFav = (itemId) => {
    setCheckout(false);

    setFavoriteIds((prev) => {
      const updatedIds = prev.filter((id) => id !== itemId);
      localStorage.setItem("favorites", JSON.stringify(updatedIds));
      return updatedIds;
    });

    setGroupedFavorites(
      (prevGroups) =>
        prevGroups
          .map((group) => ({
            ...group,
            items: group.items.filter((item) => item.id !== itemId), // 🔥 Remove only the item
          }))
          .filter((group) => group.items.length > 0) // 🔥 Remove empty groups
    );

    showMessage("Removed from favorites", true);
  };

  function profileClick(sellerId) {
    router.push(`/profile?acc=${sellerId}`);
  }

  return (
    <div className="flex flex-col items-center gap-10 min-h-screen">
      <Header pageOpened={"favorites"} />
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
              <div className="flex w-full items-center justify-between px-[20.5px]">
                {/* Select All checkbox */}
                <div className="flex items-center justify-center gap-4 ">
                  <input
                    type="checkbox"
                    id="selectAll"
                    className="accent-orange-600 size-4 cursor-pointer"
                    checked={
                      selectedSellerId === group.seller.id &&
                      selectedItems.length ===
                        group.items.filter(
                          (i) => i.availability === "AVAILABLE"
                        ).length
                    }
                    onChange={() =>
                      handleSelectAllForSeller(group.seller.id, group.items)
                    }
                  />
                  {groupedFavorites.length > 1 ? (
                    <div
                      onClick={() => profileClick(group.seller.id)}
                      className="flex gap-2 text-gray-600 items-center text-sm md:text-base font-semibold cursor-pointer hover:text-orange-800"
                    >
                      <MdStore size={16} className="mb-0.5" />
                      {group.seller.firstName + " " + group.seller.lastName}
                      <RiArrowRightSLine />
                    </div>
                  ) : (
                    <label
                      htmlFor="selectAll"
                      className="text-gray-600 text-sm md:text-base cursor-pointer"
                    >
                      Select All
                    </label>
                  )}
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
              className="text-sm md:text-base w-fit rounded-lg bg-gradient-to-br hover:bg-gradient-radial from-orange-500 via-orange-500 to-orange-600 text-white p-1 px-3"
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
          className={`w-full max-w-[500px] flex items-start justify-center self-center ${
            checkout
              ? "opacity-100 max-h-[3000px] py-5"
              : "opacity-0 max-h-0 pointer-events-none"
          } transition-all duration-700 overflow-hidden`}
        >
          <Order
            Items={selectedItems}
            closeOrderPage={() => setCheckout(false)}
          />
        </div>
      </div>
      <Footer />
    </div>
  );
}
