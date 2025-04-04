"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/header";
import Footer from "@/components/footer";
import useAuthUser from "@/hooks/authUser";
import { showMessage } from "@/hooks/useMessage";
import Loader from "@/components/loader";

export default function AdminDashboardMainPage() {
  const { user, userLoading, logout } = useAuthUser();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (!userLoading) {
      if (!user || user.role !== "ADMIN") {
        showMessage("Unauthorized Access", false);
        setTimeout(() => {
          router.push("/home");
        }, 1000);
      }
    }
  }, [user, userLoading, router]);

  return (
    <div className="flex flex-col items-center gap-5 md:gap-10 min-h-screen">
      <Header />
      <div className="w-full max-w-[1200px] px-4 py-6">
        {!user && !userLoading ? (
          <div className="h-screen text-sm md:text-base text-gray-500 p-2 self-start">
            Unauthorized Access.
          </div>
        ) : userLoading ? (
          <div className="h-screen">
            <Loader />
          </div>
        ) : user.role != "ADMIN" ? (
          <div className="h-screen text-sm md:text-base text-gray-500 p-2 self-start">
            Unauthorized Access.
          </div>
        ) : (
          <div className="flex flex-col gap-8 md:gap-4">
            {/* Headings */}
            <div className="flex flex-col gap-2">
              <h1 className="text-xl md:2xl font-semibold text-center">
                Admin Dashboard
              </h1>
            </div>

            {/* Navigation Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 md:gap-4">
              <button
                onClick={() => router.push("/admin-dashboard/manage-users")}
                className="block p-4 text-center border border-[#9e6e3b] rounded-xl text-[#9e6e3b] hover:bg-[#9e6e3b] hover:text-white transition"
              >
                <h3 className="text-xl md:text-2xl font-bold mb-2">
                  Manage Users
                </h3>
                <p className="text-xs md:text-sm">
                  View, add, edit, and delete users.
                </p>
              </button>
              <button
                onClick={() =>
                  router.push("/admin-dashboard/manage-categories")
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
                onClick={() => router.push("/admin-dashboard/manage-breeds")}
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
