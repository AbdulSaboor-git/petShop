"use client";
import React, { useEffect, useRef, useState } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { MdFavorite, MdFavoriteBorder, MdMessage } from "react-icons/md";
import ItemGallery from "./components/itemGallery";
import Order from "@/components/order";
import { useDispatch } from "react-redux";
import { triggerNotification } from "@/redux/notificationThunk";
import Loader from "@/components/loader";

export default function ItemPage({ params }) {
  const itemId = params.itemId;
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [contactSeller, setContactSeller] = useState(false);

  const sendOrderRef = useRef(null);

  const defaultPic =
    "https://lh3.googleusercontent.com/pw/AP1GczM2cnSQPHG8oKKskeSFKCFjs3z_NG31Tt4bQPqb4Fp-Qdteh0m-84BjSvDgQTkscceDPu1eD1Rs2OxUSd0InRuqnowixs1x8kqSVIcu_7BbkBi4XFK13ZqIeq56OxPw0bzq0hoUgYtTHteuYB1cTI-K=w883-h883-s-no-gm";

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      let contactSellerParam = params.get("cs");

      if (contactSellerParam && contactSellerParam != "undefined") {
        setContactSeller(true);
      }
    }
  }, []);

  const dispatch = useDispatch();
  const showMessage = (msg, state) => {
    dispatch(
      triggerNotification({
        msg: msg,
        success: state,
      })
    );
  };

  const handleContactSeller = () => {
    setContactSeller(true);
    setTimeout(() => {
      const offset = 20;
      const elementPosition = sendOrderRef.current.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }, 100);
  };

  // Fetch item data and initialize favorites from localStorage
  useEffect(() => {
    const fetchItemData = async () => {
      try {
        const response = await fetch(`/api/item?productId=${itemId}`);
        if (!response.ok) {
          throw new Error("Item not found");
        }
        const data = await response.json();
        setItem(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    // Get favorites from localStorage, if any.
    const storedFavorites = localStorage.getItem("favorites");
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites));
    } else {
      // Initialize as an empty array.
      localStorage.setItem("favorites", JSON.stringify([]));
      setFavorites([]);
    }

    fetchItemData();
  }, [itemId]);

  const handleFavoriteClick = () => {
    setFavorites((prevFavorites) => {
      let updatedFavorites;
      if (prevFavorites.includes(item.id)) {
        // Remove item from favorites
        updatedFavorites = prevFavorites.filter((favId) => favId !== item.id);
        showMessage("Removed from favorites", true);
      } else {
        // Add item to favorites
        updatedFavorites = [...prevFavorites, item.id];
        showMessage("Added to favorites", true);
      }
      localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
      return updatedFavorites;
    });
  };

  // Generate the order message using item details.

  return (
    <div className="flex flex-col items-center gap-7 md:gap-10">
      <Header />
      <div className="flex flex-col gap-10 max-w-[1200px] w-full px-4">
        {loading ? (
          <div className="h-screen">
            <Loader />
          </div>
        ) : error ? (
          <div className="h-screen text-sm md:text-base text-gray-500 p-2 self-start">
            {error}
          </div>
        ) : (
          <div className="flex flex-col gap-10">
            <div className="flex flex-col justify-start md:flex-row w-full gap-4">
              {/* Image Section */}
              <div className="flex flex-col gap-2 md:gap-3 w-full md:w-2/3 md:max-w-[500px]">
                <ItemGallery item={item} />
              </div>

              {/* Product Details Section */}
              <div className="flex flex-col h-auto md:w-2/3 md:max-w-1/3 md:px-4 gap-2.5 md:gap-4 text-gray-700">
                {item.isDiscounted && (
                  <p className="text-green-600 text-xs md:text-sm font-semibold mx-1">
                    {Math.round(
                      100 - (item?.discountedPrice / item?.price) * 100
                    )}
                    % Discount
                  </p>
                )}
                <div className="bg-gray-100 p-3 px-4 rounded-2xl md:bg-transparent md:p-0">
                  <p className="text-base md:text-xl font-bold ">
                    {item?.name}
                  </p>
                  {item?.breed && (
                    <p className="text-slate-600 text-sm md:text-base">
                      {item?.breed?.name}
                    </p>
                  )}
                  <div className="text-lg md:text-2xl font-bold text-orange-600">
                    {!item?.isDiscounted && (
                      <p>
                        <span> Rs. </span>
                        {item?.price}
                      </p>
                    )}
                    {item?.isDiscounted && (
                      <div className="flex flex-row gap-3 items-baseline">
                        <p>
                          <span> Rs. </span>
                          {item?.discountedPrice}
                        </p>
                        <p className="font-normal text-xs md:text-sm line-through decoration-gray-400 text-gray-500">
                          Rs. {item?.price}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                <div className="bg-gray-100 p-3 px-4 rounded-2xl md:bg-transparent md:p-0">
                  <ul className="text-sm md:text-base ">
                    {item?.height && (
                      <p className="font-bold">
                        Height:{" "}
                        <span className="font-normal text-slate-600">
                          {item?.height} cm
                        </span>
                      </p>
                    )}
                    {item?.weight && (
                      <p className="font-bold">
                        Weight:{" "}
                        <span className="font-normal text-slate-600">
                          {item?.weight} g
                        </span>
                      </p>
                    )}
                    {item?.age && (
                      <p className="font-bold">
                        Age:{" "}
                        <span className="font-normal text-slate-600">
                          {item?.age} years
                        </span>
                      </p>
                    )}
                    {item?.sex && (
                      <p className="font-bold">
                        Gender:{" "}
                        <span className="font-normal text-slate-600">
                          {item?.sex}
                        </span>
                      </p>
                    )}
                    {item?.specifications && (
                      <p className="font-bold">
                        Specifications:{" "}
                        <span className="font-normal text-slate-600">
                          {item?.specifications}
                        </span>
                      </p>
                    )}
                    {item?.nature && (
                      <p className="font-bold">
                        Nature:{" "}
                        <span className="font-normal text-slate-600">
                          {item?.nature}
                        </span>
                      </p>
                    )}
                    <p className="font-bold">
                      Availability:{" "}
                      <span
                        className={`font-normal ${
                          item?.availability === "AVAILABLE"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {item?.availability === "AVAILABLE"
                          ? "Available"
                          : "Not Available"}
                      </span>
                    </p>
                  </ul>
                </div>
                <div className="fixed z-10 bottom-0 left-0 p-3 px-4 md:p-0 backdrop-blur-lg  w-full md:static md:w-auto flex flex-row gap-2 text-sm md:text-base">
                  <button
                    disabled={item.availability != "AVAILABLE"}
                    onClick={handleContactSeller}
                    className={`flex gap-2 items-center justify-center bg-[#8a5e2f] hover:bg-[#644321] text-white py-2 px-4 rounded-xl w-full ${
                      item.availability != "AVAILABLE" &&
                      "cursor-not-allowed hover:bg-[#8a5e2f] opacity-60"
                    }`}
                  >
                    <MdMessage /> Seller{" "}
                  </button>
                  <button
                    onClick={handleFavoriteClick}
                    disabled={item.availability != "AVAILABLE"}
                    className={`border border-orange-600 text-orange-600 py-2 px-4 rounded-xl w-full ${
                      favorites.includes(item.id)
                        ? "bg-gradient-to-br from-orange-500 via-orange-500 to-orange-700 text-white"
                        : "bg-white"
                    }
                    ${
                      item.availability != "AVAILABLE" &&
                      "cursor-not-allowed opacity-60"
                    }`}
                  >
                    {favorites.includes(item.id) ? (
                      <div className="flex items-center justify-center gap-1">
                        Added to{" "}
                        <MdFavorite className="text-[16px] md:text-[18px]" />
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-1">
                        Add to{" "}
                        <MdFavoriteBorder className="text-[16px] md:text-[18px]" />
                      </div>
                    )}
                  </button>
                </div>
              </div>
            </div>
            <div className="text-sm md:text-base">{item.description}</div>
            <div
              ref={sendOrderRef}
              className="w-full max-w-[500px] bg-gray-100 p-2 md:bg-transparent md:p-0 rounded-2xl"
            >
              <div className=" flex gap-3 items-center justify-start">
                <img
                  src={
                    item.seller.profilePicture
                      ? item.seller.profilePicture
                      : defaultPic
                  }
                  alt="seller img"
                  draggable="false"
                  className="rounded-xl border p-1 bg-white border-gray-300 w-14 md:w-16 object-cover aspect-square overflow-hidden"
                />
                <div className="font-bold text-sm md:text-base">
                  {item.seller.firstName} {item.seller.lastName}
                </div>
              </div>
              <div
                className={`flex items-center justify-center ${
                  contactSeller
                    ? "opacity-100 h-full py-5 mt-2"
                    : "opacity-0 h-0 scale-y-105 pointer-events-none"
                } transition-all duration-500`}
              >
                <Order
                  item={item}
                  closeOrderPage={() => setContactSeller(false)}
                />
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
