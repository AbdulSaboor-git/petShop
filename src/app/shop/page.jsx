"use client";
import React, { useEffect, useState } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import ProductCardAlt from "@/components/productCardAlt";
import FilterCard from "./components/filterCard";

export default function Shop() {
  const [items, setItems] = useState([]);
  const [allItems, setAllItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch(`/api/items`); // Update API path if necessary
        if (!response.ok) {
          throw new Error("Failed to fetch items.");
        }
        const data = await response.json();
        setItems(data.items);
        setAllItems(data.items); // Keep a backup of all items for filtering
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
      setItems(allItems.filter((item) => item.category === category));
    }
  };

  const filterByBreed = (breed) => {
    setItems(allItems.filter((item) => item.breed === breed));
  };

  const categories = ["All", "Hens", "Feed", "Utensils", "Eggs"];
  const breeds = ["Shamo", "Aseel", "Misri", "Cross Breeds"];

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (items.length === 0) return <div>No items available.</div>;

  return (
    <div className="flex flex-col gap-4 lg:gap-6 items-center ">
      <Header />
      <FilterCard />

      <div className="flex flex-col items-center justify-center max-w-[1400px] w-full px-4">
        <div className="flex gap-6">
          {/* Filters Section */}
          <div className="w-[27%] pr-6 border-r border-[#00000060] hidden lg:block">
            <div className="flex flex-col gap-7">
              {/* Categories */}
              <div className="flex flex-col gap-5 border border-orange-950 p-3 pb-6 rounded-3xl text-white">
                <h1 className="text-lg font-bold text-center p-2 text-orange-950">
                  Filter by Categories
                </h1>
                <div className="flex flex-col gap-2">
                  {categories.map((categ, i) => (
                    <button
                      key={i}
                      onClick={() => filterByCategory(categ)}
                      className="rounded-full w-full border border-orange-950 bg-orange-950 text-white p-1.5"
                    >
                      {categ}
                    </button>
                  ))}
                </div>
              </div>
              {/* Breeds */}
              <div className="flex flex-col gap-5 border border-orange-950 p-3 pb-6 rounded-3xl text-white">
                <h1 className="text-lg font-bold text-center p-2 text-orange-950">
                  Filter by Breed
                </h1>
                <div className="flex flex-col gap-2">
                  {breeds.map((b, i) => (
                    <button
                      key={i}
                      onClick={() => filterByBreed(b)}
                      className="rounded-full w-full border border-orange-950 bg-orange-950 text-white p-1.5"
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
          {/* Items Section */}
          <div className="grid h-fit grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-2">
            {items.map((item, i) => (
              <ProductCardAlt key={i} item={item} />
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
