"use client";
import React, { useEffect, useState } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import ProductCardAlt from "@/components/productCardAlt";

export default function Shop() {
  const [items, setItems] = useState([]);
  const [allItems, setAllItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [breeds, setBreeds] = useState([]);

  // Use arrays for filtering; "All" is the default selection.
  const [selectedCategories, setSelectedCategories] = useState(["All"]);
  const [selectedBreeds, setSelectedBreeds] = useState(["All"]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch items, categories, and breeds.
  useEffect(() => {
    const fetchData = async () => {
      try {
        const resItems = await fetch(`/api/homeItems`);
        const resCatBreed = await fetch(`/api/categories_breeds`);
        if (!resItems.ok || !resCatBreed.ok) {
          throw new Error("Failed to fetch data.");
        }
        const dataItems = await resItems.json();
        const dataCatBreed = await resCatBreed.json();

        setItems(dataItems.items);
        setAllItems(dataItems.items);
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

  // Whenever the selected filters change, update the displayed items.
  useEffect(() => {
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

    setItems(filtered);
  }, [selectedCategories, selectedBreeds, allItems]);

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

    // If the newly selected categories do not include "chicken" or "eggs" (case‐insensitive),
    // then reset the breed filter to "All" because breeds only apply to chicken/eggs.
    const hasChickenOrEggs = newSelected.some((c) => {
      const lc = c.toLowerCase();
      return lc === "chicken" || lc === "eggs";
    });
    if (!hasChickenOrEggs) {
      setSelectedBreeds(["All"]);
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

  // Determine whether to show the breed filter.
  // We show it if either "All" is selected for categories OR if at least one selected
  // category is either "chicken" or "eggs".
  const showBreedFilter =
    selectedCategories.includes("All") ||
    selectedCategories.some((c) => c === "Chicken" || c === "Eggs");

  return (
    <div className="flex flex-col gap-4 lg:gap-6 items-center ">
      <Header />
      <div className="flex flex-col items-center justify-center max-w-[1400px] w-full px-5">
        {loading ? (
          <div>loading...</div>
        ) : error ? (
          <div>{error}</div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Filters Section */}
            <div className="border-none lg:pr-6 border-r border-[#00000060] w-full lg:w-[27%]">
              <div className="flex flex-col gap-4">
                {/* Categories Filter */}
                <div className="flex flex-col gap-1 lg:gap-5 lg:border lg:border-[#9e6e3b] p-0 lg:p-3 lg:pb-6 rounded-3xl text-white">
                  <h1 className="text-xs lg:text-lg font-normal lg:font-bold text-start lg:text-center p-0 lg:p-2 text-[#7e562b] mx-0.5 lg:mx-0">
                    Filter by Categories
                  </h1>
                  <div className="flex flex-row lg:flex-col flex-wrap gap-2">
                    {/* "All" button */}
                    <button
                      onClick={() => handleCategoryClick("All")}
                      className={`rounded-full w-fit lg:w-full font-normal border border-[#9e6e3b] lg:border-0 text-xs lg:text-base lg:bg-[#9e6e3b]  lg:text-white p-1 px-4 hover:bg-[#9e6e3b] hover:text-white lg:hover:bg-[#7e562b] lg:hover:text-white ${
                        selectedCategories.includes("All")
                          ? "bg-[#9e6e3b] text-white"
                          : "text-[#9e562b]"
                      }`}
                    >
                      All
                    </button>
                    {categories.map((categ, i) => (
                      <button
                        key={i}
                        onClick={() => handleCategoryClick(categ.name)}
                        className={`rounded-full w-fit lg:w-full font-normal border border-[#9e6e3b] lg:border-0 text-xs lg:text-base lg:bg-[#9e6e3b]  lg:text-white p-1 px-4 hover:bg-[#9e6e3b] hover:text-white lg:hover:bg-[#7e562b] lg:hover:text-white ${
                          selectedCategories.includes(categ.name)
                            ? "bg-[#9e6e3b] text-white"
                            : "text-[#9e562b]"
                        }`}
                      >
                        {categ.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Breeds Filter (only show if applicable) */}
                {showBreedFilter && (
                  <div className="flex flex-col gap-1 lg:gap-5 lg:border lg:border-[#9e6e3b] p-0 lg:p-3 lg:pb-6 rounded-3xl text-white">
                    <h1 className="text-xs lg:text-lg font-normal lg:font-bold text-start lg:text-center p-0 lg:p-2 text-[#7e562b] mx-0.5 lg:mx-0">
                      Filter by Breed
                    </h1>
                    <div className="flex flex-row flex-wrap lg:flex-col gap-2">
                      {/* "All" button for breeds */}
                      <button
                        onClick={() => handleBreedClick("All")}
                        className={`rounded-full w-fit lg:w-full font-normal border border-[#9e6e3b] lg:border-0 text-xs lg:text-base lg:bg-[#9e6e3b]  lg:text-white p-1 px-4 hover:bg-[#9e6e3b] hover:text-white lg:hover:bg-[#7e562b] lg:hover:text-white ${
                          selectedBreeds.includes("All")
                            ? "bg-[#9e6e3b] text-white"
                            : "text-[#9e562b]"
                        }`}
                      >
                        All
                      </button>
                      {breeds.map((breed, i) => (
                        <button
                          key={i}
                          onClick={() => handleBreedClick(breed.name)}
                          className={`rounded-full w-fit lg:w-full font-normal border border-[#9e6e3b] lg:border-0 text-xs lg:text-base lg:bg-[#9e6e3b]  lg:text-white p-1 px-4 hover:bg-[#9e6e3b] hover:text-white lg:hover:bg-[#7e562b] lg:hover:text-white ${
                            selectedBreeds.includes(breed.name)
                              ? "bg-[#9e6e3b] text-white"
                              : "text-[#9e562b]"
                          }`}
                        >
                          {breed.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Items Section */}
            <div
              className={`grid h-fit grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3 ${
                !items.length &&
                "min-w-[320px] sm:min-w-[480px] md:min-w-[640px] xl:min-w-[800px]"
              }`}
            >
              {items.map((item, i) => (
                <ProductCardAlt key={i} item={item} />
              ))}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
