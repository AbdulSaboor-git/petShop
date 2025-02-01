"use client";
import React, { useEffect, useState } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import ProductCardAlt from "@/components/productCardAlt";
import FilterCard from "./components/filterCard";

export default function Shop() {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [breeds, setBreeds] = useState([]);
  const [allItems, setAllItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch(`/api/homeItems`); // Update API path if necessary
        const response2 = await fetch(`/api/categories_breeds`); // Update API path if necessary
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

    fetchItems();
  }, []);

  const filterByCategory = (category) => {
    if (category === "All") {
      setItems(allItems);
    } else {
      setItems(allItems.filter((item) => item.category?.name === category));
    }
  };

  const filterByBreed = (breed) => {
    setItems(allItems.filter((item) => item.breed?.name === breed));
  };

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
            <div className="border-none lg:pr-6 border-r border-[#00000060] w-full  lg:w-[27%]">
              <div className="flex flex-col gap-4">
                {/* Categories */}
                <div className="flex flex-col gap-1 lg:gap-5  lg:border lg:border-[#9e6e3b] p-0 lg:p-3 lg:pb-6 rounded-3xl text-white">
                  <h1 className="text-xs lg:text-lg font-normal lg:font-bold text-start lg:text-center p-0 lg:p-2 text-[#7e562b] mx-0.5 lg:mx-0 ">
                    Filter by Categories
                  </h1>
                  <div className="flex flex-row lg:flex-col flex-wrap gap-2">
                    {categories.map((categ, i) => (
                      <button
                        key={i}
                        onClick={() => filterByCategory(categ.name)}
                        className="rounded-full w-fit lg:w-full font-normal border border-[#9e6e3b] lg:border-0 text-xs lg:text-base bg-white lg:bg-[#9e6e3b] text-[#9e6e3b] lg:text-white p-1 px-4 hover:bg-[#9e6e3b] hover:text-white lg:hover:bg-[#7e562b] lg:hover:text-white"
                      >
                        {categ.name}
                      </button>
                    ))}
                  </div>
                </div>
                {/* Breeds */}
                <div className="flex flex-col gap-1 lg:gap-5  lg:border lg:border-[#9e6e3b] p-0 lg:p-3 lg:pb-6 rounded-3xl text-white">
                  <h1 className="text-xs lg:text-lg font-normal lg:font-bold text-start lg:text-center p-0 lg:p-2 text-[#7e562b] mx-0.5 lg:mx-0 ">
                    Filter by Breed
                  </h1>
                  <div className="flex flex-row flex-wrap lg:flex-col gap-2 ">
                    {breeds.map((breed, i) => (
                      <button
                        key={i}
                        onClick={() => filterByBreed(breed?.name)}
                        className="rounded-full w-fit lg:w-full font-normal border border-[#9e6e3b] lg:border-0 text-xs lg:text-base bg-white lg:bg-[#9e6e3b] text-[#9e6e3b] lg:text-white p-1 px-4 hover:bg-[#9e6e3b] hover:text-white lg:hover:bg-[#7e562b] lg:hover:text-white"
                      >
                        {breed.name}
                      </button>
                    ))}
                  </div>
                </div>
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
