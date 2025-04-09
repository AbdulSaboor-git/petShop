"use client";
import Footer from "@/components/footer";
import Header from "@/components/header";
import Loader from "@/components/loader";
import useAuthUser from "@/hooks/authUser";
import { showMessage } from "@/hooks/useMessage";
import React, { useCallback, useEffect, useState } from "react";
import { MdDelete, MdEdit } from "react-icons/md";

export default function ManageProducts() {
  const { user, userLoading, logout } = useAuthUser();
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);

  const fetchItems = useCallback(async () => {
    if (!user) return; // Ensure userId exists before making the request

    try {
      setLoading(true);
      const response = await fetch(`/api/manageProducts?sellerId=${user.id}`);

      if (!response.ok) {
        throw new Error("Failed to fetch seller products.");
      }

      const data = await response.json();

      setItems(data.items);
    } catch (err) {
      showMessage(err.message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!user) return;
    fetchItems();
  }, [user, fetchItems]);

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
            <div className="flex flex-col gap-4 w-full items-center justify-center">
              <h1 className="text-xl md:2xl font-semibold text-center">
                Manage Products
              </h1>
              <div className="bg-gray-100 rounded-xl p-4 flex flex-col gap-2 items-center justify-center max-w-md w-full">
                {!loading &&
                  items?.map((item) => (
                    <div
                      key={item.id}
                      className="flex gap-3 items-center justify-between bg-white rounded-xl w-full p-2"
                    >
                      <div className="flex gap-2 items-center justify-start">
                        <img
                          src={item.images[0]}
                          alt="image"
                          className="w-16 aspect-square rounded-md"
                        />
                        <div className="flex flex-col items-start font-semibold text-sm md:text-base text-gray-900">
                          <h1 className="">{item.name}</h1>
                          <h1 className="font-normal text-xs md:text-sm text-gray-700">
                            {item.breed?.name}
                          </h1>
                        </div>
                      </div>
                      <div className="flex gap-1.5 items-center justify-end">
                        <button className="rounded-lg p-1 aspect-square cursor-pointer">
                          <MdEdit />
                        </button>
                        <button className="rounded-lg p-1 aspect-square cursor-pointer">
                          <MdDelete />
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
