"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import {
  MdDelete,
  MdEdit,
  MdFavorite,
  MdFavoriteBorder,
  MdMessage,
  MdStore,
} from "react-icons/md";
import ItemGallery from "./components/itemGallery";
import Order from "@/components/order";
import { showMessage } from "@/hooks/useMessage";
import Loader from "@/components/loader";
import { useRouter } from "next/navigation";
import ProductCard from "@/components/productCard";
import useAuthUser from "@/hooks/authUser";
import { RiArrowRightSLine } from "react-icons/ri";
import ItemGalleryLoader from "./components/ItemGalleryLoader";
import DetailsLoader from "./components/detailsLoader";

export default function ItemPage({ params }) {
  const itemId = params.itemId;
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loading2, setLoading2] = useState(true);
  const [error2, setError2] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [allItems, setAllItems] = useState([]);
  const [relatedItems, setRelatedItems] = useState([]);
  const [boughtTogetherItems, setBoughtTogetherItems] = useState([]);
  const [contactSeller, setContactSeller] = useState(false);
  const { user, userLoading, logout } = useAuthUser();
  const router = useRouter();

  const sendOrderRef = useRef(null);

  const defaultPic =
    "https://lh3.googleusercontent.com/pw/AP1GczM2cnSQPHG8oKKskeSFKCFjs3z_NG31Tt4bQPqb4Fp-Qdteh0m-84BjSvDgQTkscceDPu1eD1Rs2OxUSd0InRuqnowixs1x8kqSVIcu_7BbkBi4XFK13ZqIeq56OxPw0bzq0hoUgYtTHteuYB1cTI-K=w883-h883-s-no-gm";

  function profileClick(sellerId) {
    router.push(`/profile?acc=${sellerId}`);
  }

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      let contactSellerParam = params.get("cs");

      if (contactSellerParam && contactSellerParam != "undefined" && !loading) {
        handleContactSeller();
      }
    }
  }, [loading]);

  useEffect(() => {
    if (!itemId) {
      setError("No itemId provided.");
      setLoading(false);
      return;
    }
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

    fetchItemData();
  }, [itemId]);

  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem("favorites"));
    if (storedFavorites) {
      setFavorites(storedFavorites);
    } else {
      localStorage.setItem("favorites", JSON.stringify([]));
    }
  }, []);

  const fetchRelatedItems = useCallback(async () => {
    if (!item) return;
    try {
      const allItems = await fetch(
        `/api/relatedItems?category=${item.categoryId}&breed=${item.breedId}&sex=${item.sex}&itemId=${item.id}`
      );
      if (!allItems.ok) {
        throw new Error("Failed to fetch related items.");
      }
      const dataItems = await allItems.json();
      setBoughtTogetherItems(dataItems.boughtTogetherItems);
      setRelatedItems(dataItems.relatedItems);
    } catch (err) {
      setError2(err.message);
    } finally {
      setLoading2(false);
    }
  }, [item]);

  useEffect(() => {
    fetchRelatedItems();
  }, [fetchRelatedItems]);

  //related items effect
  // useEffect(() => {
  //   if (!item || !item.sex || item.sex === "" || !item.breedId) return;
  //   const RelatedItems = allItems
  //     .filter(
  //       (i) =>
  //         i.id !== item.id &&
  //         i.sex === item.sex &&
  //         i.breedId === item.breedId &&
  //         i.categoryId === item.categoryId
  //     )
  //     .slice(0, 4);
  //   setRelatedItems(RelatedItems);
  // }, [allItems, item]);

  // // Bought Together Effect
  // useEffect(() => {
  //   if (!item || !item.sex || item.sex === "" || !item.breedId) return;
  //   const boughtTogether = allItems
  //     .filter(
  //       (i) =>
  //         i.sex &&
  //         i.sex != item.sex &&
  //         i.breedId === item.breedId &&
  //         i.categoryId === item.categoryId
  //     )
  //     .slice(0, 2);
  //   setBoughtTogetherItems(boughtTogether);
  // }, [allItems, item]);

  function shopClick(categFilter, breedFilter, saleFilter, sortFilter) {
    router.push(
      `/shop?category=${categFilter}&breed=${breedFilter}&sale=${saleFilter}&sort=${sortFilter}`
    );
  }

  function handleEdit() {
    router.push(`/seller-dashboard/manage-products/edit?id=${itemId}`);
  }
  function handleDelete() {
    router.push(`/seller-dashboard/manage-products/delete?id=${itemId}`);
  }

  const handleContactSeller = () => {
    setContactSeller(true);
    setTimeout(() => {
      if (sendOrderRef.current) {
        const offset = 20;
        const elementPosition =
          sendOrderRef.current.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;
        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
      }
    }, 100);
  };

  // Fetch item data and initialize favorites from localStorage

  const handleFavoriteClick = (itemId) => {
    setFavorites((prevFavorites) => {
      let updatedFavorites;
      if (prevFavorites.includes(itemId)) {
        // Remove item from favorites
        updatedFavorites = prevFavorites.filter((favId) => favId !== itemId);
        showMessage("Item removed from favorites", true);
      } else {
        // Add item to favorites
        updatedFavorites = [...prevFavorites, itemId];
        showMessage("Item added to favorites", true);
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
        {error ? (
          <div className="h-screen text-sm md:text-base text-gray-500 p-2 self-start">
            {error}
          </div>
        ) : (
          <div className="flex flex-col gap-10">
            <div className="flex flex-col justify-start md:flex-row w-full gap-4">
              {/* Image Section */}
              <div className="flex flex-col gap-2 md:gap-3 w-full md:w-2/3 md:max-w-[500px]">
                {loading ? <ItemGalleryLoader /> : <ItemGallery item={item} />}
              </div>

              {/* Product Details Section */}
              <div className="flex flex-col h-auto md:w-2/3 md:max-w-1/3 md:px-4 gap-2.5 md:gap-4 text-gray-700">
                {item?.isDiscounted && (
                  <p className="text-green-600 text-xs md:text-sm font-semibold mx-1">
                    {Math.round(
                      100 - (item?.discountedPrice / item?.price) * 100
                    )}
                    % Discount
                  </p>
                )}
                {loading ? (
                  DetailsLoader()
                ) : (
                  <div className="flex flex-col gap-2.5 md:gap-4">
                    <div className="bg-gray-100 p-3 px-4 rounded-2xl md:bg-transparent md:p-0">
                      <div className="flex justify-between gap-4 items-center">
                        <p className="text-base md:text-xl font-bold ">
                          {item?.name}
                        </p>

                        {user && user?.id == item?.sellerId && (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={handleEdit}
                              className=" bg-green-600 hover:bg-green-700 text-white p-1 px-3 rounded-md"
                            >
                              <MdEdit />
                            </button>
                            <button
                              onClick={handleDelete}
                              className=" bg-red-500 hover:bg-red-600 text-white p-1 px-3 rounded-md"
                            >
                              <MdDelete />
                            </button>
                          </div>
                        )}
                      </div>
                      {item?.breed && (
                        <p className="text-slate-600 text-sm md:text-base">
                          {item?.breed?.name}
                        </p>
                      )}
                      <div className="text-xl md:text-3xl font-Maston tracking-wider font-bold text-orange-600">
                        {!item?.isDiscounted && (
                          <p>
                            <span className="text-sm"> Rs. </span>
                            {item?.price}
                          </p>
                        )}
                        {item?.isDiscounted && (
                          <div className="flex flex-row gap-3 items-baseline">
                            <p>
                              <span className="text-sm"> Rs. </span>
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
                        <p className="font-bold">
                          Category:{" "}
                          <span className="font-normal text-slate-600">
                            {item?.category.name}
                          </span>
                        </p>
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
                              {item?.age < 1
                                ? item.age * 10 + " months"
                                : item.age + " years"}
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
                        {item?.nature && (
                          <p className="font-bold">
                            Nature:{" "}
                            <span className="font-normal text-slate-600">
                              {item?.nature}
                            </span>
                          </p>
                        )}
                        {item?.specifications && (
                          <p className="font-bold">
                            Specification:{" "}
                            <span className="font-normal text-slate-600">
                              {item?.specifications}
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
                        {user &&
                          (user?.id == item?.sellerId ||
                            user?.role === "ADMIN") && (
                            <p className="font-bold">
                              Date Added:{" "}
                              <span className="font-normal text-slate-600">
                                {new Date(item?.createdAt).toLocaleString()}
                              </span>
                            </p>
                          )}
                        {user &&
                          (user?.id == item?.sellerId ||
                            user?.role === "ADMIN") && (
                            <p className="font-bold">
                              Last Updated:{" "}
                              <span className="font-normal text-slate-600">
                                {new Date(item?.updatedAt).toLocaleString()}
                              </span>
                            </p>
                          )}
                      </ul>
                    </div>
                  </div>
                )}
                <div className="fixed z-10 bottom-0 left-0 p-3 px-4 md:p-0 backdrop-blur-lg  w-full md:static md:w-auto flex flex-row gap-2 text-sm md:text-base">
                  <button
                    disabled={item?.availability != "AVAILABLE"}
                    onClick={handleContactSeller}
                    className={`flex gap-2 items-center justify-center text-white py-2 px-4 rounded-xl w-full bg-gradient-to-br from-[#9e6e3b] via-[#855b2e] to-[#52371a] hover:bg-gradient-radial transition-all duration-300 ${
                      item?.availability != "AVAILABLE" &&
                      "cursor-not-allowed hover:bg-gradient-to-br opacity-60"
                    }`}
                  >
                    <MdMessage /> Seller{" "}
                  </button>
                  <button
                    onClick={() => handleFavoriteClick(item?.id)}
                    disabled={item?.availability != "AVAILABLE"}
                    className={`border  border-orange-600 text-orange-600 py-2 px-4 rounded-xl w-full transition-all duration-300  ${
                      favorites.includes(item?.id)
                        ? "bg-gradient-to-br hover:bg-gradient-radial from-orange-500 via-orange-500 to-orange-600 text-white"
                        : "bg-gradient-to-b hover:bg-gradient-radial from-white via-white to-orange-100"
                    }
                    ${
                      item?.availability != "AVAILABLE" &&
                      "cursor-not-allowed  hover:bg-gradient-to-b opacity-60"
                    }`}
                  >
                    {favorites.includes(item?.id) ? (
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
            {!loading && item?.description && (
              <div className="text-sm md:text-base ">
                <strong>Description</strong>
                <div className="mt-2 formatted-text text-justify">
                  {item.description}
                </div>
              </div>
            )}

            {/* seller details section */}
            {!loading && (
              <div
                onClick={() => profileClick(item.sellerId)}
                className="w-full cursor-pointer hover:text-orange-900 max-w-[400px] transition-all duration-300 bg-gray-100 p-2 rounded-2xl flex gap-3 items-center justify-start"
              >
                <img
                  src={
                    item?.seller.profilePicture
                      ? item.seller.profilePicture
                      : defaultPic
                  }
                  alt="seller img"
                  draggable="false"
                  className="rounded-xl border p-1 bg-white border-gray-300 w-16 md:w-[70px] object-cover aspect-square overflow-hidden"
                />
                <div className="w-full flex  gap-2 justify-between items-center">
                  <div className="font-semibold text-sm truncate">
                    {item?.seller.firstName} {item?.seller.lastName}
                  </div>
                  <div className="flex gap-1">
                    <MdStore size={18} />
                    <RiArrowRightSLine size={18} />
                  </div>
                </div>
              </div>
            )}

            {/* Contact Seller Section */}
            {!loading && (
              <div
                ref={sendOrderRef}
                className={`flex items-center justify-center ${
                  contactSeller
                    ? "opacity-100 h-full py-5 mt-2"
                    : "opacity-0 h-0 scale-y-105 pointer-events-none"
                } transition-all duration-500`}
              >
                <Order
                  Items={[item]}
                  closeOrderPage={() => setContactSeller(false)}
                />
              </div>
            )}

            {/* bought together Items Section */}
            {!loading && boughtTogetherItems.length != 0 && (
              <div className="flex flex-col gap-3 text-sm md:text-base">
                <strong>Perfect Match</strong>

                <div className="flex flex-col gap-3 items-center justify-center">
                  <div
                    className={`self-start grid h-fit grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3`}
                  >
                    {boughtTogetherItems.map((Item, i) => (
                      <ProductCard
                        key={i}
                        item={Item}
                        favClick={() => {
                          handleFavoriteClick(Item.id);
                        }}
                        isFav={favorites.includes(Item.id)}
                        alt={true}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Related Items Section */}
            {!loading && relatedItems.length != 0 && !loading2 && (
              <div className="flex flex-col gap-3 text-sm md:text-base">
                <strong>Related Items</strong>

                <div className="flex flex-col gap-6 items-center justify-center">
                  <div
                    className={`self-start grid h-fit grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3`}
                  >
                    {relatedItems.map((Item, i) => (
                      <ProductCard
                        key={i}
                        item={Item}
                        favClick={() => {
                          handleFavoriteClick(Item.id);
                        }}
                        isFav={favorites.includes(Item.id)}
                        alt={true}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* imagess section */}
            {!loading && (
              <div className="text-sm md:text-base ">
                <strong>Images</strong>
                <div className="mt-2 flex w-full gap-2 flex-wrap">
                  {item?.images.map((img, i) => (
                    <div key={i} className="w-full max-w-sm">
                      <img
                        src={img}
                        alt="item image"
                        className="w-full rounded-lg"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
