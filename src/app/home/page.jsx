"use client";
import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import {
  MdAdd,
  MdArrowForward,
  MdCall,
  MdDiscount,
  MdMessage,
} from "react-icons/md";
import { useRouter } from "next/navigation";
import Header from "@/components/header";
import { FaHeart, FaShieldAlt } from "react-icons/fa";
import ProductCard from "@/components/productCard";
import Footer from "@/components/footer";
import { useDispatch } from "react-redux";
import { triggerNotification } from "@/redux/notificationThunk";
import Loader from "@/components/loader";
import useAuthUser from "@/hooks/authUser";

export default function HomePage() {
  const router = useRouter();
  const [slidesToShow, setSlidesToShow] = useState(4); // Default value for large screens
  const [centerMode, setCenterMode] = useState(false);
  const [randomItems, setRandomItems] = useState([]);
  const [items, setItems] = useState([]);
  const [allItems, setAllItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [breeds, setBreeds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState([]);
  const [error, setError] = useState(null);
  const [nameHover, setNameHover] = useState(false);
  const { user, userLoading, logout } = useAuthUser();

  const defaultPic = "https://i.sstatic.net/5ykYD.png";
  let categImages = [];
  let breedImages = [];

  const dispatch = useDispatch();
  const showMessage = (msg, state) => {
    dispatch(
      triggerNotification({
        msg: msg,
        success: state,
      })
    );
  };

  function handleAddClick() {
    router.push(`seller-dashboard/manage-products?function=add`);
  }

  function shopClick(categFilter, breedFilter, saleFilter, sortFilter) {
    router.push(
      `/shop?category=${categFilter}&breed=${breedFilter}&sale=${saleFilter}&sort=${sortFilter}`
    );
  }

  function itemClick(itemId, contactSeller) {
    if (contactSeller != true) router.push(`/item/${itemId}`);
    else router.push(`/item/${itemId}?cs=${contactSeller}`);
  }

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch(`/api/homeItems`);
        const response2 = await fetch(`/api/categories_breeds`);
        if (!response.ok || !response2.ok) {
          throw new Error("Failed to fetch data.");
        }
        const data = await response.json();
        const data2 = await response2.json();

        setItems(data.items);
        setAllItems(data.items);
        setCategories(data2.categories);
        setBreeds(data2.breeds);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (!localStorage.getItem("favorites")) {
      localStorage.setItem("favorites", []);
    }
    fetchItems();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 450) {
        setSlidesToShow(1);
        setCenterMode(true);
      } else if (width < 640) {
        setSlidesToShow(2);
        setCenterMode(false);
      } else if (width < 850) {
        setSlidesToShow(3);
        setCenterMode(false);
      } else if (width < 1050) {
        setSlidesToShow(4);
        setCenterMode(false);
      } else if (width < 1300) {
        setSlidesToShow(5);
        setCenterMode(false);
      } else {
        setSlidesToShow(6);
        setCenterMode(false);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const mostValuedItems = allItems
    .sort(
      (a, b) =>
        (b.isDiscounted ? b.discountedPrice : b.price) -
        (a.isDiscounted ? a.discountedPrice : a.price)
    )
    .slice(0, 5);

  const mostAffordableItems = allItems
    .sort(
      (a, b) =>
        (a.isDiscounted ? a.discountedPrice : a.price) -
        (b.isDiscounted ? b.discountedPrice : b.price)
    )
    .slice(0, 5);

  useEffect(() => {
    const getRandomItems = () => {
      if (items.length <= 5) {
        setRandomItems(items);
      } else {
        const shuffled = [...items].sort(() => 0.5 - Math.random());
        setRandomItems(shuffled.slice(0, 5));
      }
    };

    getRandomItems();
  }, [items]);

  categImages = categories.map((category) => {
    const item = items.find((item) => item.categoryId === category.id);
    return { id: category.id, image: item?.images?.[0] || defaultPic };
  });

  breedImages = breeds.map((breed) => {
    const item = items.find((item) => item.breedId === breed.id);
    return { id: breed.id, image: item?.images?.[0] || defaultPic };
  });

  const discountedItems = items.filter((item) => item.isDiscounted).slice(0, 5);

  useEffect(() => {
    const storedFavorites = localStorage.getItem("favorites");
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites));
    } else {
      // Initialize as an empty array.
      localStorage.setItem("favorites", JSON.stringify([]));
      setFavorites([]);
    }
  }, []);

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

  const settings = {
    dots: true,
    infinite: randomItems.length > 1 ? true : false,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    autoplay: true,
    autoplaySpeed: 5000,
    touchThreshold: 20,
  };

  const settings2 = {
    dots: false,
    infinite: false,
    speed: 400,
    slidesToShow: items.length < slidesToShow ? items.length : slidesToShow,
    slidesToScroll: 1,
    arrows: true,
    autoplay: false,
    swipeToSlide: true,
    touchThreshold: 20,
    centerMode: centerMode,
    centerPadding: "70px",
    draggable: false,
  };

  const settings3 = {
    dots: false,
    infinite: false,
    speed: 400,
    slidesToShow:
      discountedItems.length < slidesToShow
        ? discountedItems.length
        : slidesToShow,
    slidesToScroll: 1,
    arrows: true,
    autoplay: false,
    swipeToSlide: true,
    touchThreshold: 20,
    draggable: false,
    centerMode: centerMode,
    centerPadding: "70px",
  };

  return (
    <div className="flex flex-col items-center gap-10">
      <Header />
      <div className="max-w-[1400px] w-full p-0 m-0 md:px-6">
        {loading ? (
          <div className="h-screen">
            <Loader />
          </div>
        ) : error ? (
          <div className="h-screen text-sm md:text-base text-gray-500 mx-6 p-2 self-start">
            {error}
          </div>
        ) : (
          <div className="flex flex-col gap-20 -mt-5 md:-mt-0">
            {/*Add item btn */}
            {user && (
              <button
                onClick={handleAddClick}
                className="text-white text-xl md:text-2xl flex items-center justify-center fixed bottom-5 right-5 
              bg-gradient-to-br from-[#9e6e3b] to-[#6e4519] hover:bg-gradient-radial 
              h-12 md:h-14 aspect-square rounded-full z-50 shadow-md shadow-[#0000003e]"
              >
                <MdAdd />
              </button>
            )}
            {/* Random Items Slider */}
            <Slider {...settings} className="">
              {randomItems.map((item, index) => (
                <div key={index}>
                  <div className="flex flex-col bg-gray-100 md:flex-row mx-3 mb-2 p-10 px-16 items-center justify-evenly gap-6 md:gap-10 rounded-xl  transition-transform duration-300 shadow-md ">
                    <div className="flex md:w-[50%] flex-col gap-6 w-full md:max-w-[400px]">
                      <div className="relative">
                        {nameHover && (
                          <div className="w-full flex justify-center absolute -top-8 left-0 z-50">
                            <div className=" text-center text-xs  text-white bg-[#6e451994] shadow-md p-1 px-2 rounded-3xl">
                              {item.name.toUpperCase()}
                            </div>
                          </div>
                        )}
                        <h2
                          className="text-xl md:text-3xl text-center md:text-left font-extrabold text-[#6e4519] tracking-wide truncate"
                          onMouseEnter={() => setNameHover(true)}
                          onMouseLeave={() => setNameHover(false)}
                        >
                          {item.name.toUpperCase()}
                        </h2>
                        <div className="pt-4 mx-1 text-base md:text-lg space-y-1">
                          {item.breed ? (
                            <p>
                              <strong className="text-[#6e4519]">
                                Breed:{" "}
                              </strong>
                              {item.breed.name}
                            </p>
                          ) : (
                            <p>
                              <strong className="text-[#6e4519]">
                                Category:{" "}
                              </strong>
                              {item.category.name}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex text-sm md:text-base flex-col w-full sm:flex-row gap-3 items-center justify-start">
                        <button
                          onClick={() => itemClick(item.id)}
                          className=" flex gap-2 items-center justify-center w-full md:w-auto px-7 py-2 bg-gradient-to-br from-[#9e6e3b] via-[#855b2e] to-[#52371a] hover:bg-gradient-radial text-white rounded-full transition-all duration-300"
                        >
                          View <MdArrowForward size={20} />
                        </button>
                        <button
                          onClick={() => itemClick(item.id, true)}
                          className=" flex gap-2 items-center justify-center w-full md:w-auto px-7 py-2 bg-gradient-to-br from-[#9e6e3b] via-[#855b2e] to-[#52371a] hover:bg-gradient-radial text-white rounded-full transition-all duration-300"
                        >
                          <MdMessage /> Seller
                        </button>
                      </div>
                    </div>
                    <div className="">
                      <img
                        src={item.images[0] || defaultPic}
                        alt={item.name}
                        width={230}
                        height={230}
                        className="w-[230px] md:w-[350px] rounded-xl object-cover aspect-square shadow-md"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </Slider>

            {/* Top Breeds */}
            <div className="flex flex-col px-6  gap-8">
              <div className="text-xl md:text-2xl font-extrabold text-[#6e4519]">
                Top Breeds
              </div>
              <div className="grid grid-cols-1 gap-2 md:grid-cols-2 justify-center">
                {breeds.map(
                  (breed, i) =>
                    breed.items.length != 0 && (
                      <div
                        key={i}
                        className={`relative flex items-center justify-between p-8 rounded-xl  transition-transform duration-300 overflow-hidden ${
                          i % 3 == 1
                            ? "bg-gradient-to-br from-[#9e6e3b] to-[#6c4922]"
                            : "bg-gradient-to-br from-[#252525] to-[#111111]"
                        }`}
                      >
                        {/* Absolute positioned text container with gradient overlay */}
                        <div
                          className={`absolute inset-0 z-20 flex flex-col justify-center pl-6 pr-40 ${
                            i % 3 == 1 ? "bg-gradient-to-t" : "bg-gradient-to-b"
                          }  from-[#9e6e3b]/40 via-transparent to-black/40`}
                        >
                          <h2 className="text-white text-[22px] md:text-3xl font-extrabold tracking-wide break-words">
                            {breed.name.toUpperCase()}
                          </h2>
                          <button
                            onClick={() =>
                              shopClick("All", breed.name, false, "default")
                            }
                            className="mt-4 self-start text-xs md:text-sm border-2  py-2 px-4 transition-colors duration-300 bg-[#f0f0f0] text-[#5c3a15] hover:scale-105 rounded-md"
                          >
                            VIEW MORE
                          </button>
                        </div>
                        <div className="relative z-10 flex-shrink-0 ml-auto">
                          <img
                            src={
                              breedImages.find((image) => image.id === breed.id)
                                ?.image || defaultPic
                            }
                            alt={breed.name}
                            className="w-[120px]  md:w-44 aspect-square object-cover rounded-lg mix-blend-multiply opacity-90"
                          />
                        </div>
                      </div>
                    )
                )}
              </div>
            </div>

            {/* On Sale Slider */}
            {discountedItems.length != 0 && (
              <div className="flex flex-col gap-2 overflow-hidden">
                <div className="text-xl md:text-2xl px-6 font-extrabold text-[#6e4519]">
                  On Sale
                </div>
                <div className="relative">
                  <Slider {...settings3}>
                    {discountedItems.map((item, i) => (
                      <ProductCard
                        key={i}
                        item={item}
                        favClick={() => {
                          handleFavoriteClick(item.id);
                        }}
                        isFav={favorites.includes(item.id)}
                        alt={false}
                      />
                    ))}
                  </Slider>
                </div>
                <button
                  onClick={() => {
                    shopClick("All", "All", true, "default");
                  }}
                  className="bg-gradient-to-br from-[#9e6e3b] via-[#855b2e] to-[#52371a] hover:bg-gradient-radial text-white  border border-[#9e6e3b] rounded-lg w-fit p-1 px-4 text-sm md:text-base self-center transition-all duration-300"
                >
                  View More
                </button>
              </div>
            )}

            {/* Most Valuable Section */}
            <div className="flex flex-col gap-2 overflow-hidden">
              <div className="text-xl md:text-2xl px-6 font-extrabold text-[#6e4519]">
                Most Valuable
              </div>
              {items.length != 0 ? (
                <div className="relative">
                  <Slider {...settings2}>
                    {mostValuedItems.map((item, i) => (
                      <ProductCard
                        key={i}
                        item={item}
                        favClick={() => {
                          handleFavoriteClick(item.id);
                        }}
                        isFav={favorites.includes(item.id)}
                        alt={false}
                      />
                    ))}
                  </Slider>
                </div>
              ) : (
                <div className="text-sm md:text-base text-gray-500 mx-6 p-2 self-start">
                  Empty
                </div>
              )}
              <button
                onClick={() => {
                  shopClick("All", "All", false, "priceDesc");
                }}
                className="bg-gradient-to-br from-[#9e6e3b] via-[#855b2e] to-[#52371a] hover:bg-gradient-radial text-white  border border-[#9e6e3b] rounded-lg w-fit p-1 px-4 text-sm md:text-base self-center transition-all duration-300"
              >
                View More
              </button>
            </div>

            {/* Top Categories */}
            <div className="flex flex-col px-6  gap-8">
              <div className="text-xl md:text-2xl font-extrabold text-[#6e4519]">
                Top Categories
              </div>
              <div className="grid grid-cols-1 gap-2 md:grid-cols-2 justify-center">
                {categories.map(
                  (categ, i) =>
                    categ.items.length != 0 && (
                      <div
                        key={i}
                        className={`relative flex items-center justify-between p-8 rounded-xl  transition-transform duration-300 overflow-hidden ${
                          i % 3 == 1
                            ? "bg-gradient-to-br from-[#9e6e3b] to-[#6c4922]"
                            : "bg-gradient-to-br from-[#252525] to-[#111111]"
                        }`}
                      >
                        {/* Absolute positioned text container with gradient overlay */}
                        <div
                          className={`absolute inset-0 z-20 flex flex-col justify-center pl-6 pr-40 ${
                            i % 3 == 1 ? "bg-gradient-to-t" : "bg-gradient-to-b"
                          }  from-[#9e6e3b]/40 via-transparent to-black/40`}
                        >
                          <h2 className="text-white text-[22px] md:text-3xl font-extrabold tracking-wide break-words">
                            {categ.name.toUpperCase()}
                          </h2>
                          <button
                            onClick={() =>
                              shopClick(categ.name, "All", false, "default")
                            }
                            className="mt-4 self-start text-xs md:text-sm border-2  py-2 px-4 transition-colors duration-300 bg-[#f0f0f0] text-[#5c3a15] hover:scale-105 rounded-md"
                          >
                            VIEW MORE
                          </button>
                        </div>
                        <div className="relative z-10 flex-shrink-0 ml-auto">
                          <img
                            src={
                              categImages.find((image) => image.id === categ.id)
                                ?.image || defaultPic
                            }
                            alt={categ.name}
                            className="w-[120px]  md:w-44 aspect-square object-cover rounded-lg mix-blend-multiply opacity-90"
                          />
                        </div>
                      </div>
                    )
                )}
              </div>
            </div>

            {/* Most Affordable Section */}
            <div className="flex flex-col gap-2 overflow-hidden">
              <div className="text-xl md:text-2xl px-6 font-extrabold text-[#6e4519]">
                Most Affordable
              </div>
              {items.length != 0 ? (
                <div className="relative">
                  <Slider {...settings2}>
                    {mostAffordableItems.map((item, i) => (
                      <ProductCard
                        key={i}
                        item={item}
                        favClick={() => {
                          handleFavoriteClick(item.id);
                        }}
                        isFav={favorites.includes(item.id)}
                        alt={false}
                      />
                    ))}
                  </Slider>
                </div>
              ) : (
                <div className="text-sm md:text-base text-gray-500 mx-6 p-2 self-start">
                  Empty
                </div>
              )}
              <button
                onClick={() => {
                  shopClick("All", "All", false, "priceAsc");
                }}
                className="bg-gradient-to-br from-[#9e6e3b] via-[#855b2e] to-[#52371a] hover:bg-gradient-radial text-white  border border-[#9e6e3b] rounded-lg w-fit p-1 px-4 text-sm md:text-base self-center transition-all duration-300"
              >
                View More
              </button>
            </div>

            {/* Feature / Benefits Section */}
            <div className="px-6">
              <div className="flex flex-col md:flex-row justify-evenly gap-16 bg-gradient-radial from-[#9e6e3b]  to-[#5e3f1d] text-white p-10 rounded-xl ">
                <div className="flex flex-col items-center text-center justify-center gap-1">
                  <div className="flex flex-col gap-0.5 items-center">
                    <FaHeart className="w-16 h-16 md:w-20 md:h-20" />
                    <p className="text-base md:text-lg font-extrabold">
                      Perfect Health
                    </p>
                  </div>
                  <p className="text-xs md:text-sm">
                    We provide pets with perfect health
                  </p>
                </div>
                <div className="flex flex-col items-center text-center justify-center gap-1">
                  <div className="flex flex-col gap-0.5 items-center">
                    <FaShieldAlt className="w-16 h-16 md:w-20 md:h-20" />
                    <p className="text-base md:text-lg font-extrabold">
                      High Immunity
                    </p>
                  </div>
                  <p className="text-xs md:text-sm">
                    We ensure high immunity for a long and happy life
                  </p>
                </div>
                <div className="flex flex-col items-center text-center justify-center gap-1">
                  <div className="flex flex-col gap-0.5 items-center">
                    <MdDiscount className="w-16 h-16 md:w-20 md:h-20" />
                    <p className="text-base md:text-lg font-extrabold">
                      Huge Discounts
                    </p>
                  </div>
                  <p className="text-xs md:text-sm">
                    Get exclusive offers and great discounts
                  </p>
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
