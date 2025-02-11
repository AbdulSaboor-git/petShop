"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/header";
import Footer from "@/components/footer";

export default function SellerDashboardMainPage() {
  const [metrics, setMetrics] = useState({
    totalProducts: 0,
    totalCategories: 0,
    totalBreeds: 0,
  });
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchMetricsAndAnalytics = async () => {
      try {
        // Fetch products data
        const responseProducts = await fetch(`/api/homeItems`);
        if (!responseProducts.ok) {
          throw new Error("Failed to fetch products.");
        }
        const dataProducts = await responseProducts.json();
        const totalProducts = dataProducts.items
          ? dataProducts.items.length
          : 0;

        // Fetch categories and breeds data
        const responseCatBreed = await fetch(`/api/categories_breeds`);
        if (!responseCatBreed.ok) {
          throw new Error("Failed to fetch categories and breeds.");
        }
        const dataCatBreed = await responseCatBreed.json();
        const totalCategories = dataCatBreed.categories
          ? dataCatBreed.categories.length
          : 0;
        const totalBreeds = dataCatBreed.breeds
          ? dataCatBreed.breeds.length
          : 0;

        // Update metrics state
        setMetrics({ totalProducts, totalCategories, totalBreeds });

        // (Optional) Fetch analytics data
        // const responseAnalytics = await fetch(`/api/seller-analytics`);
        // if (responseAnalytics.ok) {
        //   const analyticsData = await responseAnalytics.json();
        //   setAnalytics(analyticsData);
        // }
      } catch (err) {
        setError(err.message);
        alert(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMetricsAndAnalytics();
  }, []);

  return (
    <div className="flex flex-col items-center gap-5 md:gap-10 min-h-screen">
      <Header />
      <div className="w-full max-w-[1200px] px-4 py-6">
        {loading ? (
          <div className="text-sm md:text-base text-gray-500 p-2 self-start">
            loading...
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
              <div className="p-4 border bg-white  rounded-xl shadow text-center">
                <h2 className="text-base md:text-lg font-bold">
                  Total Products
                </h2>
                <p className="text-2xl md:text-3xl mt-2 text-[#9e6e3b]">
                  {metrics.totalProducts}
                </p>
              </div>
              <div className="p-4 border bg-white  rounded-xl shadow text-center">
                <h2 className="text-base md:text-lg font-bold">
                  Total Categories
                </h2>
                <p className="text-2xl md:text-3xl mt-2 text-[#9e6e3b]">
                  {metrics.totalCategories}
                </p>
              </div>
              <div className="p-4 border bg-white  rounded-xl shadow text-center">
                <h2 className="text-base md:text-lg font-bold">Total Breeds</h2>
                <p className="text-2xl md:text-3xl mt-2 text-[#9e6e3b]">
                  {metrics.totalBreeds}
                </p>
              </div>
            </div>

            {/* Analytics Section */}
            <div className="p-4 border bg-gray-100 rounded-xl">
              <h2 className="text-base md:text-lg font-bold mb-4">Analytics</h2>
              {analytics ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs md:text-sm">
                      <span className="font-semibold">Sales:</span>{" "}
                      {analytics.sales}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs md:text-sm">
                      <span className="font-semibold">Visits:</span>{" "}
                      {analytics.visits}
                    </p>
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
              <button
                onClick={() =>
                  router.push("/seller-dashboard/manage-categories")
                }
                className="block p-4 text-center border border-[#9e6e3b] rounded-xl text-[#9e6e3b] hover:bg-[#9e6e3b] hover:text-white transition"
              >
                <h3 className="text-xl md:text-2xl font-bold mb-2">
                  Manage Categories
                </h3>
                <p className="text-xs md:text-sm">
                  View, add, edit, and delete categories.
                </p>
              </button>
              <button
                onClick={() => router.push("/seller-dashboard/manage-breeds")}
                className="block p-4 text-center border border-[#9e6e3b] rounded-xl text-[#9e6e3b] hover:bg-[#9e6e3b] hover:text-white transition"
              >
                <h3 className="text-xl md:text-2xl font-bold mb-2">
                  Manage Breeds
                </h3>
                <p className="text-xs md:text-sm">
                  View, add, edit, and delete breeds.
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
