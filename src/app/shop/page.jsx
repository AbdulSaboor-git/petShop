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
      setItems(allItems.filter((item) => item.category.name === category));
    }
  };

  const filterByBreed = (breed) => {
    setItems(allItems.filter((item) => item.breed.name === breed));
  };

  return (
    <div className="flex flex-col gap-4 lg:gap-6 items-center ">
      <Header />
      {/* <FilterCard /> */}

      <div className="flex flex-col items-center max-w-[1400px] w-full px-4">
        {loading ? (
          <div>loading...</div>
        ) : error ? (
          <div>{error}</div>
        ) : (
          <div className="flex gap-6">
            {/* Filters Section */}
            <div className="w-[27%] pr-6 border-r border-[#00000060] hidden lg:block">
              <div className="flex flex-col gap-7">
                {/* Categories */}
                <div className="flex flex-col gap-5 border border-[#9e6e3b] p-3 pb-6 rounded-3xl text-white">
                  <h1 className="text-lg font-bold text-center p-2 text-[#9e6e3b]">
                    Filter by Categories
                  </h1>
                  <div className="flex flex-col gap-2">
                    {categories.map((categ, i) => (
                      <button
                        key={i}
                        onClick={() => filterByCategory(categ.name)}
                        className="rounded-full w-full border border-[#9e6e3b] bg-[#9e6e3b] text-white p-1.5"
                      >
                        {categ.name}
                      </button>
                    ))}
                  </div>
                </div>
                {/* Breeds */}
                <div className="flex flex-col gap-5 border border-[#9e6e3b] p-3 pb-6 rounded-3xl text-white">
                  <h1 className="text-lg font-bold text-center p-2 text-[#9e6e3b]">
                    Filter by Breed
                  </h1>
                  <div className="flex flex-col gap-2">
                    {breeds.map((breed, i) => (
                      <button
                        key={i}
                        onClick={() => filterByBreed(breed.name)}
                        className="rounded-full w-full border border-[#9e6e3b] bg-[#9e6e3b] text-white p-1.5"
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
