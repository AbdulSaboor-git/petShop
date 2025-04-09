"use client";
import Footer from "@/components/footer";
import Header from "@/components/header";
import Loader from "@/components/loader";
import useAuthUser from "@/hooks/authUser";
import { showMessage } from "@/hooks/useMessage";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import { MdDelete, MdEdit } from "react-icons/md";

export default function ManageProducts() {
  const { user, userLoading, logout } = useAuthUser();
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  const router = useRouter();
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

  const handleEditClick = (itemId) => {
    router.push(`/seller-dashboard/manage-products/edit?id=${itemId}`);
  };
  const handleDeleteClick = (itemId) => {
    router.push(`/seller-dashboard/manage-products/delete?id=${itemId}`);
  };
  const handleItemClick = (itemId) => {
    router.push(`/item/${itemId}`);
  };

  const loadingItems = [1, 2, 3, 4, 5];

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
            <div className="bg-gray-100 rounded-xl p-4 flex flex-col gap-6 w-full items-center justify-center">
              <h1 className="text-xl text-gray-700 md:2xl font-semibold text-center">
                Manage Products
              </h1>
              <div className="flex flex-col gap-2 max-w-xl w-full">
                {loading
                  ? loadingItems.map((i) => (
                      <div
                        key={i}
                        className="flex gap-3 items-center justify-between bg-gradient-to-br from-gray-400 via-gray-300 to-gray-400 animate-pulse rounded-xl w-full p-2"
                      >
                        <div className="h-20"></div>
                      </div>
                    ))
                  : items?.map((item) => (
                      <div
                        key={item.id}
                        className="flex gap-3 items-center justify-between bg-white rounded-xl w-full p-2"
                      >
                        <div className="flex gap-2 items-center justify-start">
                          <div className="bg-red-100 rounded-md">
                            <img
                              onClick={() => {
                                handleItemClick(item.id);
                              }}
                              src={item.images[0]}
                              alt="image"
                              className={`w-20 aspect-square rounded-md cursor-pointer ${
                                item.availability != "AVAILABLE" && "opacity-60"
                              }`}
                            />
                          </div>
                          <div
                            onClick={() => {
                              handleItemClick(item.id);
                            }}
                            className={`cursor-pointer flex flex-col items-start font-normal text-xs md:text-sm text-gray-700 ${
                              item.availability != "AVAILABLE" && "opacity-60"
                            }`}
                          >
                            <h1 className="font-semibold text-sm md:text-base">
                              {item.name}
                            </h1>
                            <h1 className="">{item.breed?.name}</h1>
                            <h1 className="">
                              Created at:{" "}
                              {new Date(item.createdAt).toLocaleDateString()}
                            </h1>
                            <h1 className="">
                              Last updated:{" "}
                              {new Date(item.updatedAt).toLocaleDateString()}
                            </h1>
                          </div>
                        </div>
                        <div className="flex gap-1.5 items-center justify-end ">
                          <button
                            onClick={() => {
                              handleEditClick(item.id);
                            }}
                            className="hover:bg-green-500 hover:text-white rounded-lg p-1 aspect-square cursor-pointer transition-colors duration-150"
                          >
                            <MdEdit />
                          </button>
                          <button
                            onClick={() => {
                              handleDeleteClick(item.id);
                            }}
                            className="hover:bg-red-500 hover:text-white rounded-lg p-1 aspect-square cursor-pointer transition-colors duration-150"
                          >
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
