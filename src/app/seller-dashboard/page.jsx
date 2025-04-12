"use client";
import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/header";
import Footer from "@/components/footer";
import useAuthUser from "@/hooks/authUser";
import Loader from "@/components/loader";
import { showMessage } from "@/hooks/useMessage";

export default function SellerDashboardMainPage() {
  const { user, userLoading, logout } = useAuthUser();
  const userId = user?.id;
  const [metrics, setMetrics] = useState({
    totalProducts: 0,
    totalCategories: 0,
    totalBreeds: 0,
    totalAvailableProducts: 0,
    productsSold: 0,
  });
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [breeds, setBreeds] = useState([]);
  const [error, setError] = useState(null);
  const [showCategories, setShowCategories] = useState(false);
  const [showBreeds, setShowBreeds] = useState(false);

  const router = useRouter();

  const fetchMetricsAndAnalytics = useCallback(async () => {
    if (!userId) return; // Ensure sellerId exists before making the request

    try {
      setLoading(true);
      const response = await fetch(`/api/sellerDashboard?sellerId=${userId}`);

      if (!response.ok) {
        throw new Error("Failed to fetch seller metrics.");
      }

      const result = await response.json();

      if (result?.success && result?.data) {
        const { totalItems, availableItems, categories, breeds } = result.data;

        const totalProducts = totalItems ?? 0;
        const totalAvailableProducts = availableItems ?? 0;
        const productsSold = totalProducts - totalAvailableProducts;
        const totalCategories = categories.length ?? 0;
        const totalBreeds = breeds.length ?? 0;
        setCategories(categories);
        setBreeds(breeds);
        setMetrics({
          totalProducts,
          totalCategories,
          totalBreeds,
          totalAvailableProducts,
          productsSold,
        });
      } else {
        throw new Error("Invalid response structure.");
      }
    } catch (err) {
      setError(err.message);
      showMessage(err.message, false);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    let isMounted = true; //  Define isMounted inside useEffect

    setLoading(true); //  Set loading before making the request
    fetchMetricsAndAnalytics().finally(() => {
      if (isMounted) setLoading(false);
    });

    return () => {
      isMounted = false; // Cleanup function to prevent state updates on unmount
    };
  }, [fetchMetricsAndAnalytics]); //  Ensure `fetchMetricsAndAnalytics` is re-called when sellerId changes

  useEffect(() => {
    if (!userLoading && !user) {
      showMessage("Unauthorized Access", false);
      setTimeout(() => {
        router.push("/home");
      }, 1000);
    }
  }, [userLoading, user, router]);

  return (
    <div className="flex flex-col items-center gap-5 md:gap-10 min-h-screen">
      <Header />
      <div className="w-full max-w-[1200px] px-4 py-6">
        {!user && !userLoading ? (
          <div className="h-screen text-sm md:text-base text-gray-500 p-2 self-start">
            Unauthorized Access.
          </div>
        ) : (
          <div className="flex flex-col gap-8 md:gap-4">
            {/* Headings */}
            <div className="flex flex-col gap-2">
              <h1 className="text-xl md:2xl font-semibold text-center">
                Seller Dashboard
              </h1>
              <h2 className="text-base md:text-lg font-semibold text-center">
                Manage Your Store
              </h2>
            </div>

            {/* Metrics Cards */}
            <div className="grid grid-cols-1 bg-gray-100 p-4 rounded-xl sm:grid-cols-2 md:grid-cols-3 gap-2 md:gap-4">
              <div className="p-4 border bg-white text-gray-700  rounded-xl shadow text-center">
                <h2 className="text-base md:text-lg font-bold">
                  Total Products
                </h2>
                <div className="text-2xl md:text-3xl mt-2 text-[#9e6e3b]">
                  {loading ? (
                    <p className="font-bold animate-bounce">...</p>
                  ) : (
                    metrics.totalProducts
                  )}
                </div>
                <h2 className="text-base md:text-lg mt-4 font-bold text-green-800">
                  Available Products
                </h2>
                <div className="text-2xl md:text-3xl mt-2 text-green-800">
                  {loading ? (
                    <p className="font-bold animate-bounce">...</p>
                  ) : (
                    metrics.totalAvailableProducts
                  )}
                </div>
                <h2 className="text-base md:text-lg mt-4 font-bold text-red-800">
                  Products Sold
                </h2>
                <div className="text-2xl md:text-3xl mt-2 text-red-800">
                  {loading ? (
                    <p className="font-bold animate-bounce">...</p>
                  ) : (
                    metrics.productsSold
                  )}
                </div>
              </div>
              <div className="p-4 border bg-white  rounded-xl shadow text-center">
                <h2 className="text-base md:text-lg font-bold">
                  Total Categories
                </h2>
                <div className="text-2xl md:text-3xl mt-2 text-[#9e6e3b]">
                  {loading ? (
                    <p className="font-bold animate-bounce">...</p>
                  ) : (
                    <div className="flex flex-col gap-2 items-center justify-center transition-all duration-300">
                      {metrics.totalCategories}
                      <button
                        onClick={() => setShowCategories(!showCategories)}
                        className="p-1.5 px-4 text-xs md:text-base rounded-lg border border-[#9e6e3b] bg-white text-[#9e6e3b] hover:bg-[#9e6e3b2c]"
                      >
                        View
                      </button>
                      <div
                        className={`flex flex-col gap-[0.7px] items-center justify-center text-sm md:text-base text-gray-700 
                          border border-[#9e6e3b] rounded-lg overflow-hidden w-full transition-all duration-300 bg-[#9e6e3b]
                          ${
                            showCategories
                              ? "pointer-events-all"
                              : "pointer-events-none"
                          }`}
                        style={{
                          height: showCategories
                            ? `${categories.length * 36}px`
                            : "0px",
                          opacity: showCategories ? 1 : 0,
                          transition: "height 300ms, opacity 300ms",
                        }}
                      >
                        {categories.map((category) => (
                          <div
                            key={category.id}
                            className={` transition-all duration-300 w-full p-2 bg-white
                          ${
                            showCategories
                              ? "text-gray-700"
                              : "text-transparent"
                          }
                          `}
                          >
                            {category.name}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="p-4 border bg-white  rounded-xl shadow text-center">
                <h2 className="text-base md:text-lg font-bold">Total Breeds</h2>
                <div className="text-2xl md:text-3xl mt-2 text-[#9e6e3b]">
                  {loading ? (
                    <p className="font-bold animate-bounce">...</p>
                  ) : (
                    <div className="flex flex-col gap-2 items-center justify-center transition-all duration-300">
                      {metrics.totalBreeds}
                      <button
                        onClick={() => setShowBreeds(!showBreeds)}
                        className="p-1.5 px-4 text-xs md:text-base rounded-lg border border-[#9e6e3b] bg-white text-[#9e6e3b] hover:bg-[#9e6e3b2c]"
                      >
                        View
                      </button>
                      <div
                        className={`flex flex-col gap-[0.7px] items-center justify-center text-sm md:text-base text-gray-700 
                      border border-[#9e6e3b] rounded-lg overflow-hidden w-full transition-all duration-300 bg-[#9e6e3b]
                      ${
                        showBreeds
                          ? "pointer-events-all"
                          : "pointer-events-none"
                      }`}
                        style={{
                          height: showBreeds
                            ? `${breeds.length * 36}px`
                            : "0px",
                          opacity: showBreeds ? 1 : 0,
                          transition: "height 300ms, opacity 300ms",
                        }}
                      >
                        {breeds.map((breed) => (
                          <div
                            key={breed.id}
                            className={` transition-all duration-300 w-full p-2 bg-white
                      ${showBreeds ? "text-gray-700" : "text-transparent"}
                      `}
                          >
                            {breed.name}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Analytics Section */}
            <div className="p-4 border bg-gray-100 rounded-xl">
              <h2 className="text-base md:text-lg font-bold mb-4">Analytics</h2>
              {analytics ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs md:text-sm">
                      <p className="font-semibold">Sales:</p> {analytics.sales}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs md:text-sm">
                      <p className="font-semibold">Visits:</p>{" "}
                      {analytics.visits}
                    </div>
                  </div>
                  {/* More analytics metrics as needed */}
                </div>
              ) : (
                <p className="text-xs md:text-sm">No analytics available.</p>
              )}
            </div>

            {/* Navigation Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 md:gap-4">
              <button
                onClick={() => router.push("/seller-dashboard/manage-products")}
                className="block p-4 text-center border border-[#9e6e3b] rounded-xl text-[#9e6e3b] hover:bg-[#9e6e3b] hover:text-white transition"
              >
                <h3 className="text-xl md:text-2xl font-bold mb-2">
                  Manage Products
                </h3>
                <p className="text-xs md:text-sm">
                  View, add, edit, and delete products.
                </p>
              </button>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
