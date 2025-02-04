"use client";
import React, { useEffect, useRef, useState } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { MdFavorite, MdFavoriteBorder } from "react-icons/md";
import ItemGallery from "./components/itemGallery";

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

  const handleContactSeller = () => {
    setContactSeller(true);
    setTimeout(() => {
      const offset = 0;
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
        const response = await fetch(`/api/item/${itemId}`);
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
      } else {
        // Add item to favorites
        updatedFavorites = [...prevFavorites, item.id];
      }
      localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
      return updatedFavorites;
    });
  };

  // Generate the order message using item details.
  const generateOrderMessage = () => {
    if (!item) return "";
    const priceText = item.isDiscounted
      ? `Discounted Price: Rs. ${item.discountedPrice} (Original: Rs. ${item.price})`
      : `Price: Rs. ${item.price}`;
    return `Hello ${item.seller.firstName},

I am interested in placing an order for the following item:

Item: ${item.name}
${priceText}
Description: ${item.description.substring(0, 100)}...

Please let me know the next steps to complete my order.

Thank you.`;
  };

  // Handler for placing an order via WhatsApp.
  const handleWhatsappOrder = () => {
    if (!item || !item.seller.phoneNo) return;
    const message = generateOrderMessage();
    const phoneNumber = item.seller.phoneNo.replace(/\D/g, ""); // Remove non-digit characters
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
      message
    )}`;
    window.open(whatsappUrl, "_blank");
  };

  // Handler for placing an order via Email.
  const handleEmailOrder = () => {
    if (!item || !item.seller.email) return;
    const message = generateOrderMessage();
    const subject = `Order Inquiry: ${item.name}`;
    const mailtoUrl = `mailto:${item.seller.email}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(message)}`;
    window.location.href = mailtoUrl;
  };

  return (
    <div className="flex flex-col items-center md:gap-10">
      <Header />
      <div className="flex flex-col gap-10 max-w-[1200px] w-full px-4">
        {loading ? (
          <div>loading...</div>
        ) : error ? (
          <div>{error}</div>
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
                  {item.breed && (
                    <p className="text-slate-600 text-sm md:text-base">
                      {item.breed.name}
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
                    {item.height && (
                      <p className="font-bold">
                        Height:{" "}
                        <span className="font-normal text-slate-600">
                          {item.height} cm
                        </span>
                      </p>
                    )}
                    {item.weight && (
                      <p className="font-bold">
                        Weight:{" "}
                        <span className="font-normal text-slate-600">
                          {item.weight} g
                        </span>
                      </p>
                    )}
                    {item.age && (
                      <p className="font-bold">
                        Age:{" "}
                        <span className="font-normal text-slate-600">
                          {item.age} years
                        </span>
                      </p>
                    )}
                    {item.sex && (
                      <p className="font-bold">
                        Gender:{" "}
                        <span className="font-normal text-slate-600">
                          {item.sex}
                        </span>
                      </p>
                    )}
                    {item.specifications && (
                      <p className="font-bold">
                        Specifications:{" "}
                        <span className="font-normal text-slate-600">
                          {item.specifications}
                        </span>
                      </p>
                    )}
                    {item.nature && (
                      <p className="font-bold">
                        Nature:{" "}
                        <span className="font-normal text-slate-600">
                          {item.nature}
                        </span>
                      </p>
                    )}
                    <p className="font-bold">
                      Availability:{" "}
                      <span
                        className={`font-normal ${
                          item.availability ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {item.availability ? "Available" : "Not Available"}
                      </span>
                    </p>
                  </ul>
                </div>
                <div className="fixed bottom-0 left-0 p-3 px-4 md:p-0 bg-white w-full md:static md:w-auto flex flex-row gap-2 text-sm md:text-base">
                  <button
                    onClick={handleContactSeller}
                    className={`bg-[#8a5e2f] hover:bg-[#644321] text-white py-2 px-4 rounded-xl w-full `}
                  >
                    Contact Seller
                  </button>
                  <button
                    onClick={handleFavoriteClick}
                    className={`border border-orange-600 text-orange-600 py-2 px-4 rounded-xl w-full hover:bg-orange-500 hover:border-orange-500 hover:text-white ${
                      favorites.includes(item.id)
                        ? "bg-orange-500 text-white"
                        : "bg-white"
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
              className="flex flex-col gap-2 w-full max-w-[600px] bg-gray-100 p-2 md:bg-transparent md:p-0 rounded-2xl"
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
                    ? "opacity-100 h-full py-5"
                    : "opacity-0 h-0 pointer-events-none"
                } transition-all duration-500`}
              >
                <div className="flex w-full flex-col text-xs md:text-sm gap-4 max-w-[600px] self-center p-5 py-10 rounded-xl border bg-gray-50 text-gray-700 text-center">
                  <h2 className="text-base md:text-lg font-bold">
                    Order Inquiry
                  </h2>
                  {/* Display selected item details or any additional order info */}
                  <p>
                    <strong>Item:</strong> {item.name}
                  </p>
                  <p>
                    <strong>{item.isDiscounted ? "Price" : "Price"}:</strong>{" "}
                    {item.isDiscounted ? item.discountedPrice : item.price}
                  </p>
                  <h3 className="font-bold text-center">Place Order via:</h3>
                  <div className="flex flex-col md:flex-row gap-4 justify-center">
                    <button
                      onClick={handleWhatsappOrder}
                      className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded"
                    >
                      WhatsApp
                    </button>
                    <button
                      onClick={handleEmailOrder}
                      className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
                    >
                      Email
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
