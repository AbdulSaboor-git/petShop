"use client";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import ProductCardAlt from "@/components/productCardAlt";
import { MdClose, MdSearch } from "react-icons/md";
import { RiArrowDownSLine } from "react-icons/ri";
import Loader from "@/components/loader";

export default function Shop() {
  const [items, setItems] = useState([]);
  const [allItems, setAllItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [breeds, setBreeds] = useState([]);
  const [ShowCategories, setShowCategories] = useState(false);
  const [showBreeds, setShowBreeds] = useState(false);
  const [ShowMoreFilters, setShowMoreFilters] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [isOnSale, setIsOnSale] = useState(false);
  const [rawSearchQuery, setRawSearchQuery] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Use arrays for filtering; "All" is the default selection.
  const [selectedCategories, setSelectedCategories] = useState(["All"]);
  const [selectedBreeds, setSelectedBreeds] = useState(["All"]);

  // Additional filters and sorting
  const [onSale, setOnSale] = useState(false);
  const [sortOption, setSortOption] = useState("default");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleSearchQueryChange = (e) => {
    setRawSearchQuery(e.target.value);
    setSearchQuery(e.target.value.trim());
  };

  function clearFilters() {
    setSelectedCategories(() => ["All"]);
    setSelectedBreeds(() => ["All"]);
    setOnSale(() => false);
    setSortOption(() => "default");
  }

  const filteredItemsTemp = useMemo(() => {
    if (searchQuery === "") return allItems;
    return allItems.filter((item) =>
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
  }, [searchQuery, allItems]);

  useEffect(() => {
    setItems(filteredItemsTemp);
  }, [filteredItemsTemp]);

  useEffect(() => {
    if (typeof window === "undefined") return; // Prevent execution during SSR

    const searchParams = window.location.search; // Extracted to avoid complex dependencies

    const params = new URLSearchParams(searchParams);
    const categoryParam = params.get("category");
    const breedParam = params.get("breed");
    const saleParam = params.get("sale") === "true"; // Ensure boolean value
    const sortParam = params.get("sort");

    setSelectedCategories(
      categoryParam && categoryParam !== "undefined" ? [categoryParam] : ["All"]
    );
    setSelectedBreeds(
      breedParam && breedParam !== "undefined" ? [breedParam] : ["All"]
    );
    setOnSale(saleParam);
    setSortOption(
      sortParam && sortParam !== "undefined" ? sortParam : "default"
    );
  }, []);

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
      const isFavorite = prevFavorites.includes(itemId);
      return isFavorite
        ? prevFavorites.filter((favId) => favId !== itemId)
        : [...prevFavorites, itemId];
    });
  };

  // Automatically sync favorites with localStorage
  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  // Fetch items, categories, and breeds.
  const fetchData = useCallback(async () => {
    try {
      const resItems = await fetch(`/api/homeItems`);
      if (!resItems.ok) {
        throw new Error("Failed to fetch data.");
      }
      const dataItems = await resItems.json();

      setItems(dataItems.items);
      setAllItems(dataItems.items);
      dataItems.items.some((item) => {
        item.isDiscounted && setIsOnSale(true);
      });
      setCategories(dataItems.categories.filter((c) => c._count.items > 0));
      setBreeds(dataItems.breeds.filter((b) => b._count.items > 0));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Whenever the selected filters, onSale toggle, or sorting options change, update the displayed items.
  useEffect(() => {
    if (searchQuery != "") return;
    let filtered = allItems;

    const isFilteringCategories = !(
      selectedCategories.length === 1 && selectedCategories[0] === "All"
    );
    const isFilteringBreeds = !(
      selectedBreeds.length === 1 && selectedBreeds[0] === "All"
    );

    if (isFilteringCategories) {
      const categorySet = new Set(selectedCategories); // Convert to Set for O(1) lookups
      filtered = filtered.filter((item) =>
        categorySet.has(item.category?.name)
      );
    }

    if (isFilteringBreeds) {
      const breedSet = new Set(selectedBreeds); // Convert to Set for O(1) lookups
      filtered = filtered.filter((item) => breedSet.has(item.breed?.name));
    }

    // Filter by onSale flag if active.
    if (onSale) {
      filtered = filtered.filter((item) => item.isDiscounted);

      // Precompute discount percentage to avoid redundant calculations
      filtered.sort((a, b) => {
        const discountA = ((a.price - a.discountedPrice) / a.price) * 100;
        const discountB = ((b.price - b.discountedPrice) / b.price) * 100;
        return discountB - discountA; // Sort in descending order
      });
    }

    // Sorting: Make a shallow copy before sorting.
    filtered = [...filtered];
    if (sortOption === "priceAsc") {
      filtered.sort(
        (a, b) =>
          (a.isDiscounted ? a.discountedPrice : a.price) -
          (b.isDiscounted ? b.discountedPrice : b.price)
      );
    } else if (sortOption === "priceDesc") {
      filtered.sort(
        (a, b) =>
          (b.isDiscounted ? b.discountedPrice : b.price) -
          (a.isDiscounted ? a.discountedPrice : a.price)
      );
    } else if (sortOption === "newest") {
      filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    setItems(filtered);
  }, [
    selectedCategories,
    selectedBreeds,
    allItems,
    onSale,
    sortOption,
    searchQuery,
  ]);

  // Handle category selection.
  const handleCategoryClick = (category) => {
    // If "All" is clicked, reset both category and breed filters.
    if (category === "All") {
      setSelectedCategories(["All"]);
      setSelectedBreeds(["All"]);
      return;
    }

    let newSelected = selectedCategories.includes("All")
      ? []
      : [...selectedCategories];

    // Toggle the category in the array.
    if (newSelected.includes(category)) {
      newSelected = newSelected.filter((c) => c !== category);
    } else {
      newSelected.push(category);
    }

    // If nothing is selected, default back to "All".
    if (newSelected.length === 0) {
      newSelected = ["All"];
    }

    setSelectedCategories(newSelected);
  };

  // Handle breed selection.
  const handleBreedClick = (breed) => {
    // If "All" is clicked, reset the breed selection.
    if (breed === "All") {
      setSelectedBreeds(["All"]);
      return;
    }

    let newSelected = selectedBreeds.includes("All") ? [] : [...selectedBreeds];

    // Toggle the breed in the array.
    if (newSelected.includes(breed)) {
      newSelected = newSelected.filter((b) => b !== breed);
    } else {
      newSelected.push(breed);
    }

    // If nothing is selected, default back to "All".
    if (newSelected.length === 0) {
      newSelected = ["All"];
    }

    setSelectedBreeds(newSelected);
  };

  return (
    <div className="flex flex-col gap-4 lg:gap-6 items-center ">
      <Header pageOpened={"shop"} />
      <div className="flex flex-col items-center justify-center max-w-[1400px] w-full px-5">
        {loading ? (
          <div className="h-screen pt-6">
            <Loader />
          </div>
        ) : error ? (
          <div className="h-screen text-sm md:text-base text-gray-500 p-2  self-start">
            {error}
          </div>
        ) : (
          <div className="flex flex-col w-full lg:flex-row gap-6 transition-all duration-500 lg:mt-20">
            {
              <div className="border-none lg:pr-6 border-r border-[#00000060] w-full lg:w-[27%] transition-all duration-500">
                <div className="flex flex-col w-full items-end gap-3 transition-all duration-500">
                  <div className="relative w-full md:max-w-[350px] md:self-end bg-gray-100 border border-[#9e6e3b] rounded-xl overflow-hidden">
                    <input
                      type="input"
                      className="w-full p-3 pr-12 rounded-xl 
                    text-xs md:text-sm focus:outline-none"
                      placeholder="Search..."
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
                  {
                    /* Categories Filter */
                    searchQuery === "" && (
                      <div className="w-full overflow-hidden bg-gray-100 lg:bg-transparent p-3 flex flex-col lg:border lg:border-[#9e6e3b] rounded-xl text-white transition-all duration-500">
                        <div
                          onClick={() =>
                            ShowCategories
                              ? setShowCategories(false)
                              : (setShowCategories(true),
                                setShowBreeds(false),
                                setShowMoreFilters(false))
                          }
                          className="flex bg-gray-100 shadow-md shadow-gray-100   z-[1] items-center cursor-pointer justify-between text-xs lg:text-lg font-normal lg:font-bold text-start lg:text-center p-0 lg:p-2 text-[#7e562b] mx-0.5 lg:mx-0 transition-all duration-500"
                        >
                          Filter by Categories
                          <RiArrowDownSLine
                            size={18}
                            className={`${
                              ShowCategories ? "-rotate-180" : "rotate-0"
                            } transition-all duration-[400ms]`}
                          />
                        </div>
                        <div
                          className={`flex flex-row overflow-hidden lg:flex-col flex-wrap lg:flex-nowrap px-1  gap-2 transition-all duration-300 ease-in-out ${
                            !ShowCategories
                              ? "opacity-0 -translate-y-5 lg:-translate-y-10 scale-y-50 lg:scale-y-75 max-h-0 mt-0"
                              : `opacity-100 translate-y-0 scale-y-100 ${
                                  categories?.length <= 7
                                    ? "max-h-[140px]"
                                    : breeds?.length <= 15
                                    ? "max-h-[220px]"
                                    : breeds.length <= 20
                                    ? "max-h-[280px]"
                                    : "max-h-screen"
                                } lg:max-h-screen mt-2 lg:pb-3`
                          }`}
                        >
                          <button
                            onClick={() => handleCategoryClick("All")}
                            className={`rounded-full w-fit lg:w-full font-normal border border-[#9e6e3b] lg:border-0 text-xs lg:text-base  lg:text-white p-1 px-4 ${
                              selectedCategories.includes("All")
                                ? "bg-[#9e6e3b] text-white lg:bg-[#7e562b]"
                                : "text-[#9e562b] bg-white lg:bg-[#9e6e3b] "
                            }`}
                          >
                            All
                          </button>
                          {categories.map((categ, i) => (
                            <button
                              key={i}
                              onClick={() => handleCategoryClick(categ.name)}
                              className={`rounded-full w-fit lg:w-full overflow-hidden font-normal border border-[#9e6e3b] lg:border-0 text-xs lg:text-base  lg:text-white p-1 px-3 ${
                                selectedCategories.includes(categ.name)
                                  ? "bg-[#9e6e3b] text-white lg:bg-[#644422] pr-6"
                                  : "text-[#9e562b]  bg-white lg:bg-[#9e6e3b] "
                              }`}
                            >
                              <div className="relative flex items-center">
                                {categ.name}
                                <MdClose
                                  className={`text-white ${
                                    !selectedCategories.includes(categ.name)
                                      ? " opacity-0 -right-[8px] pointer-events-none"
                                      : "opacity-100 -right-[18px]  pointer-events-auto"
                                  } absolute  top-[2.5px] lg:hidden transition-all duration-300`}
                                />
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )
                  }
                  {searchQuery === "" && (
                    <div className="w-full overflow-hidden bg-gray-100 p-3 flex flex-col lg:border lg:border-[#9e6e3b] rounded-xl text-white transition-all duration-300">
                      <div
                        onClick={() =>
                          showBreeds
                            ? setShowBreeds(false)
                            : (setShowCategories(false),
                              setShowBreeds(true),
                              setShowMoreFilters(false))
                        }
                        className="flex bg-gray-100 shadow-md shadow-gray-100 z-[1] items-center cursor-pointer justify-between text-xs lg:text-lg font-normal lg:font-bold text-start lg:text-center p-0 lg:p-2 text-[#7e562b] mx-0.5 lg:mx-0 transition-all duration-500"
                      >
                        Filter by Breeds
                        <RiArrowDownSLine
                          size={18}
                          className={`${
                            showBreeds ? "-rotate-180" : "rotate-0"
                          } transition-all duration-[400ms]`}
                        />
                      </div>
                      <div
                        className={`flex flex-row overflow-hidden lg:flex-col flex-wrap lg:flex-nowrap px-1  gap-2 transition-all duration-300 ease-in-out ${
                          !showBreeds
                            ? "opacity-0 -translate-y-5 lg:-translate-y-10 scale-y-50 lg:scale-y-75 max-h-0 mt-0"
                            : `opacity-100 translate-y-0 scale-y-100 ${
                                breeds?.length <= 7
                                  ? "max-h-[140px]"
                                  : breeds?.length <= 15
                                  ? "max-h-[220px]"
                                  : breeds.length <= 20
                                  ? "max-h-[280px]"
                                  : "max-h-screen"
                              } md:max-h-screen mt-2 lg:pb-3`
                        }`}
                      >
                        <button
                          onClick={() => handleBreedClick("All")}
                          className={`rounded-full w-fit lg:w-full font-normal border border-[#9e6e3b] lg:border-0 text-xs lg:text-base  lg:text-white p-1 px-4 ${
                            selectedBreeds.includes("All")
                              ? "bg-[#9e6e3b] text-white lg:bg-[#644422]"
                              : "text-[#9e562b] bg-white lg:bg-[#9e6e3b]"
                          }`}
                        >
                          All
                        </button>
                        {breeds.map((breed, i) => (
                          <button
                            key={i}
                            onClick={() => handleBreedClick(breed.name)}
                            className={`rounded-full w-fit lg:w-full font-normal border border-[#9e6e3b] lg:border-0 text-xs lg:text-base  lg:text-white p-1 px-3 ${
                              selectedBreeds.includes(breed.name)
                                ? "bg-[#9e6e3b] text-white lg:bg-[#644422] pr-6"
                                : "text-[#9e562b] bg-white lg:bg-[#9e6e3b] "
                            }`}
                          >
                            <div className="relative">
                              {breed.name}
                              <MdClose
                                className={`text-white ${
                                  !selectedBreeds.includes(breed.name)
                                    ? " opacity-0 -right-[8px] pointer-events-none"
                                    : "opacity-100 -right-[18px]  pointer-events-auto"
                                } absolute  top-[2.5px] lg:hidden transition-all duration-300`}
                              />
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  {isOnSale && searchQuery === "" && (
                    <div className="w-full overflow-hidden bg-gray-100 p-3 flex flex-col lg:border lg:border-[#9e6e3b] rounded-xl text-white transition-all duration-300">
                      <div
                        onClick={() =>
                          ShowMoreFilters
                            ? setShowMoreFilters(false)
                            : (setShowCategories(false),
                              setShowBreeds(false),
                              setShowMoreFilters(true))
                        }
                        className="flex bg-gray-100 shadow-md shadow-gray-100   z-[1] items-center cursor-pointer justify-between text-xs lg:text-lg font-normal lg:font-bold text-start lg:text-center p-0 lg:p-2 text-[#7e562b] mx-0.5 lg:mx-0 transition-all duration-500"
                      >
                        More Filters
                        <RiArrowDownSLine
                          size={18}
                          className={`${
                            ShowMoreFilters ? "-rotate-180" : "rotate-0"
                          } transition-all duration-[400ms]`}
                        />
                      </div>
                      <div
                        className={`flex flex-row overflow-hidden lg:flex-col flex-wrap lg:flex-nowrap px-1  gap-2 transition-all duration-300 ease-in-out ${
                          !ShowMoreFilters
                            ? "opacity-0 -translate-y-5 lg:-translate-y-10 scale-y-50 lg:scale-y-75 max-h-0 mt-0"
                            : "opacity-100 translate-y-0 scale-y-100 max-h-[120px] lg:max-h-screen mt-2 lg:pb-3"
                        }`}
                      >
                        <button
                          onClick={() => setOnSale((prev) => !prev)}
                          className={`rounded-full w-fit lg:w-full font-normal border border-[#9e6e3b] lg:border-0 text-xs lg:text-base  lg:text-white p-1 px-3 ${
                            onSale
                              ? "bg-[#9e6e3b] text-white lg:bg-[#644422] pr-6"
                              : "text-[#9e562b] bg-white lg:bg-[#9e6e3b] "
                          }`}
                        >
                          <div className="relative">
                            On Sale
                            <MdClose
                              className={`text-white ${
                                !onSale
                                  ? " opacity-0 -right-[8px] pointer-events-none"
                                  : "opacity-100 -right-[18px]  pointer-events-auto"
                              } absolute  top-[2.5px] lg:hidden transition-all duration-300`}
                            />
                          </div>{" "}
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2 self-start flex-wrap lg:hidden">
                    {selectedCategories.length > 0 &&
                      selectedCategories[0] != "All" &&
                      selectedCategories.map((category, i) => (
                        <button
                          key={i}
                          onClick={() => handleCategoryClick(category)}
                          className={`rounded-full w-fit font-normal text-xs p-1 px-3 pr-6 bg-[#9e6e3b] text-white`}
                        >
                          <div className="relative">
                            {category}
                            <MdClose className="absolute text-white -right-[18px] top-[2px] lg:hidden" />
                          </div>
                        </button>
                      ))}
                    {selectedBreeds.length > 0 &&
                      selectedBreeds[0] != "All" &&
                      selectedBreeds.map((breed, i) => (
                        <button
                          key={i}
                          onClick={() => handleBreedClick(breed)}
                          className={`rounded-full w-fit font-normal text-xs p-1 px-3 pr-6 bg-[#9e6e3b] text-white`}
                        >
                          <div className="relative">
                            {breed}
                            <MdClose className="absolute text-white -right-[18px] top-[2px] lg:hidden" />
                          </div>
                        </button>
                      ))}
                    {onSale && (
                      <button
                        onClick={() => setOnSale((prev) => !prev)}
                        className={`rounded-full w-fit font-normal text-xs p-1 px-3 pr-6 bg-[#9e6e3b] text-white`}
                      >
                        <div className="relative">
                          On Sale
                          <MdClose className="absolute text-white -right-[18px]  top-[2px] lg:hidden" />
                        </div>{" "}
                      </button>
                    )}
                  </div>
                  <div className="flex w-fit lg:w-full flex-row gap-2 mt-2">
                    <select
                      value={sortOption}
                      onChange={(e) => setSortOption(e.target.value)}
                      className="rounded-full w-fit lg:w-full font-normal border border-[#9e6e3b] p-1 px-4 text-xs lg:text-base text-[#9e562b] bg-white"
                    >
                      <option value="default">Default</option>
                      <option value="priceAsc">Price: Low to High</option>
                      <option value="priceDesc">Price: High to Low</option>
                      <option value="newest">Newest</option>
                    </select>
                  </div>
                </div>
              </div>
            }
            {/* Items Section */}
            <div className="flex flex-col gap-3">
              {searchQuery != "" && (
                <p className="text-sm lg:text-base font-semibold leading-tight text-gray-700 mx-0.5">
                  Serach Results
                </p>
              )}
              <div
                className={`grid h-fit grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3 ${
                  !items.length &&
                  "min-w-[320px] sm:min-w-[480px] md:min-w-[640px] xl:min-w-[800px]"
                }`}
              >
                {items.length ? (
                  items.map((item, i) => (
                    <ProductCardAlt
                      key={i}
                      item={item}
                      favClick={() => {
                        handleFavoriteClick(item.id);
                      }}
                      isFav={favorites.includes(item.id)}
                    />
                  ))
                ) : (
                  <div className="text-xs md:text-sm text-gray-500 p-2">
                    No items found.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
