"use client";
import React, { useEffect, useState } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import ProductCardAlt from "@/components/productCardAlt";
import { MdClose } from "react-icons/md";
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
    setSearchQuery(e.target.value.trim());
  };

  function clearFilters() {
    setSelectedCategories(["All"]);
    setSelectedBreeds(["All"]);
    setOnSale(false);
    setSortOption("default");
  }

  useEffect(() => {
    if (searchQuery === "") {
      setItems(allItems);
    } else {
      const fItems = allItems.filter((item) => {
        return (
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (item.category?.name &&
            item.category.name
              .toLowerCase()
              .includes(searchQuery.toLowerCase())) ||
          (item.breed?.name &&
            item.breed.name
              .toLowerCase()
              .includes(searchQuery.toLowerCase())) ||
          (item.sex &&
            item.sex.toLowerCase().includes(searchQuery.toLowerCase()))
        );
      });
      setItems(fItems);
    }
  }, [searchQuery, allItems]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      let categoryParam = params.get("category");
      let breedParam = params.get("breed");
      let saleParam = params.get("sale");
      let sortParam = params.get("sort");

      if (categoryParam && categoryParam !== "undefined") {
        setSelectedCategories([categoryParam]);
      }
      if (breedParam && breedParam !== "undefined") {
        setSelectedBreeds([breedParam]);
      }
      if (saleParam === "true" && saleParam !== "undefined") {
        setOnSale(true);
      }
      if (sortParam && sortParam !== "undefined") {
        setSortOption(sortParam);
      }
    }
  }, []);

  useEffect(() => {
    const storedFavorites = localStorage.getItem("favorites");
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites));
    } else {
      localStorage.setItem("favorites", JSON.stringify([]));
      setFavorites([]);
    }
  }, []);

  const handleFavoriteClick = (itemId) => {
    setFavorites((prevFavorites) => {
      let updatedFavorites;
      if (prevFavorites.includes(itemId)) {
        updatedFavorites = prevFavorites.filter((favId) => favId !== itemId);
      } else {
        updatedFavorites = [...prevFavorites, itemId];
      }
      localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
      return updatedFavorites;
    });
  };

  // Fetch items and categories/breeds concurrently.
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resItems, resCatBreed] = await Promise.all([
          fetch(`/api/homeItems`),
          fetch(`/api/categories_breeds`),
        ]);

        if (!resItems.ok || !resCatBreed.ok) {
          throw new Error("Failed to fetch data.");
        }

        const dataItems = await resItems.json();
        const dataCatBreed = await resCatBreed.json();

        setItems(dataItems.items);
        setAllItems(dataItems.items);
        // Calculate isOnSale based on whether any item is discounted.
        const anyDiscounted = dataItems.items.some((item) => item.isDiscounted);
        setIsOnSale(anyDiscounted);
        setCategories(dataCatBreed.categories);
        setBreeds(dataCatBreed.breeds);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filtering items based on selected categories, breeds, onSale toggle, and sorting.
  useEffect(() => {
    if (searchQuery !== "") return;
    let filtered = allItems;

    // Filter by category only if "All" is not selected.
    if (!(selectedCategories.length === 1 && selectedCategories[0] === "All")) {
      filtered = filtered.filter((item) =>
        selectedCategories.includes(item.category?.name)
      );
    }

    // Filter by breed only if "All" is not selected.
    if (!(selectedBreeds.length === 1 && selectedBreeds[0] === "All")) {
      filtered = filtered.filter((item) =>
        selectedBreeds.includes(item.breed?.name)
      );
    }

    // Filter by onSale flag if active.
    if (onSale) {
      filtered = filtered.filter((item) => item.isDiscounted);
      filtered.sort(
        (a, b) =>
          (((b.price - b.discountedPrice) * 100) / b.price).toFixed(0) -
          (((a.price - a.discountedPrice) * 100) / a.price).toFixed(0)
      );
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
    if (category === "All") {
      setSelectedCategories(["All"]);
      setSelectedBreeds(["All"]);
      return;
    }

    let newSelected = selectedCategories.includes("All")
      ? []
      : [...selectedCategories];

    if (newSelected.includes(category)) {
      newSelected = newSelected.filter((c) => c !== category);
    } else {
      newSelected.push(category);
    }

    if (newSelected.length === 0) {
      newSelected = ["All"];
    }

    setSelectedCategories(newSelected);
  };

  // Handle breed selection.
  const handleBreedClick = (breed) => {
    if (breed === "All") {
      setSelectedBreeds(["All"]);
      return;
    }

    let newSelected = selectedBreeds.includes("All") ? [] : [...selectedBreeds];

    if (newSelected.includes(breed)) {
      newSelected = newSelected.filter((b) => b !== breed);
    } else {
      newSelected.push(breed);
    }

    if (newSelected.length === 0) {
      newSelected = ["All"];
    }

    setSelectedBreeds(newSelected);
  };

  const breedsToShow = breeds.filter((b) => b.items != 0);
  const categoriesToShow = categories.filter((c) => c.items != 0);

  return (
    <div className="flex flex-col gap-4 lg:gap-6 items-center">
      <Header />
      <div className="flex flex-col items-center justify-center max-w-[1400px] w-full px-5">
        {loading ? (
          <div className="h-screen pt-6">
            <Loader />
          </div>
        ) : error ? (
          <div className="h-screen text-sm md:text-base text-gray-500 p-2 self-start">
            {error}
          </div>
        ) : (
          <div className="flex flex-col w-full lg:flex-row gap-6 transition-all duration-500">
            <input
              type="search"
              className="w-full -my-3 md:max-w-[350px] md:self-end bg-gray-100 p-3 rounded-xl text-xs md:text-sm focus:outline-none"
              placeholder="Search..."
              aria-label="Search"
              value={searchQuery}
              onChange={handleSearchQueryChange}
            />
            {searchQuery === "" && (
              <div className="border-none lg:pr-6 border-r border-[#00000060] w-full lg:w-[27%] transition-all duration-500">
                <div className="flex flex-col w-full items-end gap-3 transition-all duration-500">
                  {categoriesToShow.length > 0 && (
                    <div className="w-full overflow-hidden bg-gray-100 lg:bg-transparent p-3 flex flex-col lg:border lg:border-[#9e6e3b] rounded-xl text-white transition-all duration-500">
                      <div
                        onClick={() =>
                          ShowCategories
                            ? setShowCategories(false)
                            : setShowCategories(true)
                        }
                        className="flex bg-gray-100 shadow-md shadow-gray-100 z-[1] items-center cursor-pointer justify-between text-xs lg:text-lg font-normal lg:font-bold text-start lg:text-center p-0 lg:p-2 text-[#7e562b] mx-0.5 lg:mx-0 transition-all duration-500"
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
                        className={`flex flex-row overflow-hidden lg:flex-col flex-wrap lg:flex-nowrap px-1 gap-2 transition-all duration-300 ease-in-out ${
                          !ShowCategories
                            ? "opacity-0 -translate-y-5 lg:-translate-y-10 scale-y-50 lg:scale-y-75 max-h-0 mt-0"
                            : `opacity-100 translate-y-0 scale-y-100 ${
                                categories?.length <= 7
                                  ? "max-h-[140px]"
                                  : categories?.length <= 15
                                  ? "max-h-[220px]"
                                  : categories.length <= 20
                                  ? "max-h-[280px]"
                                  : "max-h-screen"
                              } lg:max-h-screen mt-2 lg:pb-3`
                        }`}
                      >
                        <button
                          onClick={() => handleCategoryClick("All")}
                          className={`rounded-full w-fit lg:w-full font-normal border border-[#9e6e3b] lg:border-0 text-xs lg:text-base lg:text-white p-1 px-4 ${
                            selectedCategories.includes("All")
                              ? "bg-[#9e6e3b] text-white lg:bg-[#7e562b]"
                              : "text-[#9e562b] bg-white lg:bg-[#9e6e3b]"
                          }`}
                        >
                          All
                        </button>
                        {categoriesToShow.map((categ, i) => (
                          <button
                            key={i}
                            onClick={() => handleCategoryClick(categ.name)}
                            className={`rounded-full w-fit lg:w-full font-normal border border-[#9e6e3b] lg:border-0 text-xs lg:text-base lg:text-white p-1 px-3 ${
                              selectedCategories.includes(categ.name)
                                ? "bg-[#9e6e3b] text-white lg:bg-[#644422] pr-6"
                                : "text-[#9e562b] bg-white lg:bg-[#9e6e3b]"
                            }`}
                          >
                            <div className="relative">
                              {categ.name}
                              <MdClose
                                className={`${
                                  !selectedCategories.includes(categ.name) &&
                                  "hidden"
                                } absolute text-white -right-[18px] top-[2px] lg:hidden`}
                              />
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  {breedsToShow.length > 0 && (
                    <div className="w-full overflow-hidden bg-gray-100 lg:bg-transparent p-3 flex flex-col lg:border lg:border-[#9e6e3b] rounded-xl text-white transition-all duration-300">
                      <div
                        onClick={() =>
                          showBreeds
                            ? setShowBreeds(false)
                            : setShowBreeds(true)
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
                        className={`flex flex-row overflow-hidden lg:flex-col flex-wrap lg:flex-nowrap px-1 gap-2 transition-all duration-300 ease-in-out ${
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
                          className={`rounded-full w-fit lg:w-full font-normal border border-[#9e6e3b] lg:border-0 text-xs lg:text-base lg:text-white p-1 px-4 ${
                            selectedBreeds.includes("All")
                              ? "bg-[#9e6e3b] text-white lg:bg-[#644422]"
                              : "text-[#9e562b] bg-white lg:bg-[#9e6e3b]"
                          }`}
                        >
                          All
                        </button>
                        {breedsToShow.map((breed, i) => (
                          <button
                            key={i}
                            onClick={() => handleBreedClick(breed.name)}
                            className={`rounded-full w-fit lg:w-full font-normal border border-[#9e6e3b] lg:border-0 text-xs lg:text-base lg:text-white p-1 px-3 ${
                              selectedBreeds.includes(breed.name)
                                ? "bg-[#9e6e3b] text-white lg:bg-[#644422] pr-6"
                                : "text-[#9e562b] bg-white lg:bg-[#9e6e3b]"
                            }`}
                          >
                            <div className="relative">
                              {breed.name}
                              <MdClose
                                className={`${
                                  !selectedBreeds.includes(breed.name) &&
                                  "hidden"
                                } absolute text-white -right-[18px] top-[2px] lg:hidden`}
                              />
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  {isOnSale && (
                    <div className="w-full overflow-hidden bg-gray-100 lg:bg-transparent p-3 flex flex-col lg:border lg:border-[#9e6e3b] rounded-xl text-white transition-all duration-300">
                      <div
                        onClick={() =>
                          ShowMoreFilters
                            ? setShowMoreFilters(false)
                            : setShowMoreFilters(true)
                        }
                        className="flex bg-gray-100 shadow-md shadow-gray-100 z-[1] items-center cursor-pointer justify-between text-xs lg:text-lg font-normal lg:font-bold text-start lg:text-center p-0 lg:p-2 text-[#7e562b] mx-0.5 lg:mx-0 transition-all duration-500"
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
                        className={`flex flex-row overflow-hidden lg:flex-col flex-wrap lg:flex-nowrap px-1 gap-2 transition-all duration-300 ease-in-out ${
                          !ShowMoreFilters
                            ? "opacity-0 -translate-y-5 lg:-translate-y-10 scale-y-50 lg:scale-y-75 max-h-0 mt-0"
                            : "opacity-100 translate-y-0 scale-y-100 max-h-[120px] lg:max-h-screen mt-2 lg:pb-3"
                        }`}
                      >
                        <button
                          onClick={() => setOnSale((prev) => !prev)}
                          className={`rounded-full w-fit lg:w-full font-normal border border-[#9e6e3b] lg:border-0 text-xs lg:text-base lg:text-white p-1 px-3 ${
                            onSale
                              ? "bg-[#9e6e3b] text-white lg:bg-[#644422] pr-6"
                              : "text-[#9e562b] bg-white lg:bg-[#9e6e3b]"
                          }`}
                        >
                          <div className="relative">
                            On Sale
                            <MdClose
                              className={`${
                                !onSale && "hidden"
                              } absolute text-white -right-[18px] top-[2px] lg:hidden`}
                            />
                          </div>
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2 self-start flex-wrap lg:hidden">
                    {selectedCategories.length > 0 &&
                      selectedCategories[0] !== "All" &&
                      selectedCategories.map((category, i) => (
                        <button
                          key={i}
                          onClick={() => handleCategoryClick(category)}
                          className="rounded-full w-fit font-normal text-xs p-1 px-3 pr-6 bg-[#9e6e3b] text-white"
                        >
                          <div className="relative">
                            {category}
                            <MdClose className="absolute text-white -right-[18px] top-[2px] lg:hidden" />
                          </div>
                        </button>
                      ))}
                    {selectedBreeds.length > 0 &&
                      selectedBreeds[0] !== "All" &&
                      selectedBreeds.map((breed, i) => (
                        <button
                          key={i}
                          onClick={() => handleBreedClick(breed)}
                          className="rounded-full w-fit font-normal text-xs p-1 px-3 pr-6 bg-[#9e6e3b] text-white"
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
                        className="rounded-full w-fit font-normal text-xs p-1 px-3 pr-6 bg-[#9e6e3b] text-white"
                      >
                        <div className="relative">
                          On Sale
                          <MdClose className="absolute text-white -right-[18px] top-[2px] lg:hidden" />
                        </div>
                      </button>
                    )}
                  </div>
                  <div className="flex w-fit flex-row gap-2 mt-2">
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
            )}
            {/* Items Section */}
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
                    favClick={() => handleFavoriteClick(item.id)}
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
        )}
      </div>
      <Footer />
    </div>
  );
}
