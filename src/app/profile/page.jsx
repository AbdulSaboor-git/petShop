"use client";
import Footer from "@/components/footer";
import Header from "@/components/header";
import Loader from "@/components/loader";
import ProductCard_S from "@/components/productCard_S";
import React, { use, useEffect, useMemo, useState } from "react";
import useAuthUser from "@/hooks/authUser";
import { MdAccountCircle, MdAdd, MdClose, MdSearch } from "react-icons/md";
import { useRouter } from "next/navigation";

export default function Profile() {
  const [id, setId] = useState(null);
  const [seller, setSeller] = useState(null);
  const [allItems, setAllItems] = useState([]);
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [featuredItems, setFeaturedItems] = useState([]);
  const [premiumItems, setPremiumItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [UserIsSeller, setUserIsSeller] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const { user, userLoading, logout } = useAuthUser();
  const [rawSearchQuery, setRawSearchQuery] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [availableItemsLength, setAvailableItemsLength] = useState(null);

  const router = useRouter();

  const addProductClick = () => {
    router.push("/seller-dashboard/manage-products/add");
  };
  // Compute seller's full name only if seller data exists.
  const sellerName = seller
    ? `${seller.firstName} ${seller.lastName}`.toUpperCase()
    : "";

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const idParam = params.get("acc");

    if (idParam && idParam !== "undefined" && idParam !== null) {
      setId(Number(idParam));
    }
  }, []);

  // Set the user as seller if the current user's id matches the id in the URL.
  useEffect(() => {
    if (!userLoading) {
      setUserIsSeller(user?.id === id);
    }
  }, [user, userLoading, id]);

  function toggleShowProfile() {
    setShowProfile((prev) => !prev);
  }

  const handleSearchQueryChange = (e) => {
    setRawSearchQuery(e.target.value);
    setSearchQuery(e.target.value.trim());
  };

  const filteredItemsTemp = useMemo(() => {
    if (searchQuery === "") return items;
    return items.filter((item) =>
      [
        item.name,
        item.category?.name,
        item.breed?.name,
        item.sex,
        item.specifications,
      ]
        .filter(Boolean) // Remove null/undefined values
        .some((val) => val.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [searchQuery, items]);

  useEffect(() => {
    setFilteredItems(filteredItemsTemp);
  }, [filteredItemsTemp]);

  // Fetch seller and items data based on the id.
  useEffect(() => {
    if (!id || id === "undefined" || (!user && userLoading)) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/user?userId=${id}`);

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to fetch user data.");
        }

        const sellerData = await response.json();

        setSeller(sellerData);
        // setFilteredItems(sellerData.items);
        setAllItems(sellerData.items);
        setAvailableItemsLength(
          sellerData.items.filter((item) => item.availability === "AVAILABLE")
            .length
        );
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, user, userLoading]);

  useEffect(() => {
    if (UserIsSeller) {
      setItems(allItems);
      setFilteredItems(allItems);
    } else {
      setItems(allItems.filter((item) => item.availability === "AVAILABLE"));
      setFilteredItems(
        allItems.filter((item) => item.availability === "AVAILABLE")
      );
    }
  }, [allItems, user, UserIsSeller]);

  // Filter featured items and create premium items without mutating the original items array.
  useEffect(() => {
    setFeaturedItems(items.filter((item) => item.isfeatured));

    items.length > 7 &&
      setPremiumItems(
        [...items]
          .sort(
            (a, b) =>
              (b.isDiscounted ? b.discountedPrice ?? b.price : b.price ?? 0) -
              (a.isDiscounted ? a.discountedPrice ?? a.price : a.price ?? 0)
          )
          .slice(0, 5)
      );
  }, [items]);

  const toggleAvailableFilter = (e) => {
    e.target.checked
      ? setItems(allItems.filter((item) => item.availability === "AVAILABLE"))
      : setItems(allItems);
  };

  return (
    <div className="flex flex-col gap-4 lg:gap-6 items-center ">
      <Header />
      <div className="flex flex-col items-center justify-center w-full max-w-[1400px] overflow-hidden">
        {loading ? (
          <div className="h-screen pt-6 px-5">
            <Loader />
          </div>
        ) : error ? (
          <div className="h-screen text-sm md:text-base text-gray-500 p-2 self-start px-5">
            {error}
          </div>
        ) : (
          <div className="w-full flex flex-col gap-6 pt-0 p-5 justify-start bg-gray-100 rounded-2xl mt-[52px] md:mt-[60px]">
            <div className="flex flex-col items-center justify-start self-center bg-gray-200 p-3 w-[93%] md:max-w-[600px] rounded-2xl -mt-[52px] md:-mt-[60px] overflow-hidden">
              <div className="flex gap-4 md:gap-6 self-start items-center justify-start">
                <img
                  src={seller.profilePicture}
                  alt={seller.firstName}
                  className="h-20 md:h-24 aspect-square rounded-xl"
                />
                <div className="flex flex-col text-xs md:text-sm">
                  <div className="font-extrabold">{sellerName}</div>
                  <div>
                    Total Products:{" "}
                    {UserIsSeller ? allItems.length : items.length}
                  </div>
                  {UserIsSeller && (
                    <div>Available Products: {availableItemsLength}</div>
                  )}
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
                  className={`transition-all duration-300 ease-in-out overflow-hidden bg-white rounded-xl ${
                    showProfile
                      ? "max-h-[200px] opacity-100 m-1 mt-3 text-xs p-4  md:text-sm"
                      : "max-h-0 opacity-0 m-0 text-[2px] p-0 pointer-events-none"
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
                      onClick={() => {
                        logout();
                        setShowProfile(false);
                      }}
                      className={`mt-1 flex gap-2 items-center justify-center w-full
                         bg-gradient-to-br from-red-500 to-red-600 hover:bg-gradient-radial rounded-md  text-white
                         ${
                           showProfile
                             ? "p-1 px-2 text-xs md:text-sm "
                             : "p-0 text-[1px]"
                         }
                         `}
                    >
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
            <div className="flex flex-col gap-7 items-center justify-center md:flex-row w-full md:justify-between">
              {UserIsSeller && (
                <button
                  onClick={addProductClick}
                  className="text-white text-xs md:text-sm  flex items-center justify-center gap-2 self-center md:self-end px-5 py-2
                bg-gradient-to-br from-[#9e6e3b] to-[#6e4519] hover:bg-gradient-radial 
                           rounded-2xl "
                >
                  <p>Add Product</p>
                  <MdAdd size={15} />
                </button>
              )}
              <div className="flex flex-col gap-2  w-full md:max-w-[450px] md:self-end">
                <div className="flex justify-between items-center mx-0.5">
                  <strong>Search</strong>
                  {UserIsSeller && (
                    <div className="flex items-center gap-2 text-xs md:text-sm ">
                      <label
                        htmlFor="available-filter"
                        className=" cursor-pointer"
                      >
                        Show Available Only
                      </label>
                      <input
                        id="available-filter"
                        type="checkbox"
                        className=" cursor-pointer accent-[#9e6e3b]"
                        onChange={toggleAvailableFilter}
                      />
                    </div>
                  )}
                </div>

                <div className="relative w-full bg-white border border-[#9e6e3b] rounded-xl overflow-hidden">
                  <input
                    type="input"
                    className="w-full p-3 rounded-xl pr-12
                                text-xs md:text-sm focus:outline-none"
                    placeholder="Search in store..."
                    aria-label="Search"
                    value={rawSearchQuery}
                    onChange={handleSearchQueryChange}
                  />
                  <div
                    className="absolute right-0 top-0 bg-gradient-to-br from-[#9e6e3b] to-[#6e4519] h-full w-10 flex items-center  cursor-pointer text-white"
                    onClick={() =>
                      handleSearchQueryChange({ target: { value: "" } })
                    }
                  >
                    <MdSearch
                      className={`absolute h-full w-fit p-2.5 transition-all duration-300 ${
                        searchQuery == ""
                          ? "opacity-100"
                          : "opacity-0 rotate-90"
                      }`}
                    />
                    <MdClose
                      className={`absolute h-full w-fit p-2.5 transition-all duration-300 ${
                        searchQuery !== ""
                          ? "opacity-100 "
                          : "opacity-0 -rotate-90"
                      }`}
                    />
                  </div>
                </div>
              </div>
            </div>
            {searchQuery != "" && (
              <p className="text-sm font-semibold leading-tight text-gray-700 -mb-3">
                Serach Results
              </p>
            )}
            {searchQuery === "" && featuredItems.length > 0 && (
              <div className="flex flex-col gap-2">
                <h1 className="font-bold">Featured Products</h1>
                <div className="flex gap-2 w-full justify-start overflow-auto hidden_scroll_bar">
                  {featuredItems.map((item) => (
                    <ProductCard_S key={item.id} item={item} alt={true} />
                  ))}
                </div>
                <div className="h-3 mt-4 bg-white w-[120%] self-center" />
              </div>
            )}
            {searchQuery === "" && premiumItems.length > 0 && (
              <div className="flex flex-col gap-2">
                <h1 className="font-bold">Premium Products</h1>
                <div className="flex gap-2 w-full overflow-auto hidden_scroll_bar">
                  {premiumItems.map((item) => (
                    <ProductCard_S key={item.id} item={item} alt={true} />
                  ))}
                </div>
                <div className="h-3 mt-4 bg-white w-[120%] self-center" />
              </div>
            )}
            <div className="flex flex-col gap-2">
              {searchQuery === "" && (
                <h1 className="font-bold">All Products</h1>
              )}
              {filteredItems.length ? (
                <div className="grid h-fit grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3">
                  {filteredItems.map((item, i) => (
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
