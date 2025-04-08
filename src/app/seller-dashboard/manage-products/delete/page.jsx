"use client";
import Footer from "@/components/footer";
import Header from "@/components/header";
import Loader from "@/components/loader";
import useAuthUser from "@/hooks/authUser";
import { showMessage } from "@/hooks/useMessage";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";

export default function DeleteProduct() {
  const { user, userLoading, logout } = useAuthUser();

  const [item, setItem] = useState(null);
  const [itemID, setItemId] = useState(null);
  const [itemLoading, setItemLoading] = useState(true);
  const [itemError, setItemError] = useState(null);

  const [name, setName] = useState("");
  const [image, setImage] = useState("");

  const userId = user?.id;
  const [sellerId, setSellerId] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      let idParam = params.get("id");

      // showMessage(idParam + ", " + typeof idParam, true);
      idParam = parseInt(idParam, 10);
      if (idParam > 0 && !isNaN(idParam)) {
        // showMessage(idParam + ", " + typeof idParam, true);
        setItemId(idParam);
      }
    }
  }, []);

  const fetchItemData = useCallback(
    async (itemId) => {
      // showMessage(itemId + ", " + typeof itemId, true);
      if (!itemId || !userId) {
        // setItem(null);
        resetForm();
        return;
      }
      setItemLoading(true);
      setItemError(null);
      try {
        const response = await fetch(`/api/itemName?productId=${itemId}`);
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(errorText || "Product not found");
        }
        const data = await response.json();
        setSellerId(data.sellerId);
        setItem(data);
      } catch (err) {
        setItemError("Failed to load product. Please check your connection.");
        showMessage(err.message, false);
      } finally {
        setItemLoading(false);
      }
    },
    [userId]
  );

  useEffect(() => {
    if (!itemID || !user) return;
    fetchItemData(itemID);
  }, [itemID, fetchItemData, user]);

  const handleDeleteProductSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (!item) return;
      if (userId != sellerId) return;

      try {
        const res = await fetch(`/api/item?productId=${itemID}`, {
          method: "DELETE",
        });
        if (!res.ok) {
          const errorResponse = await res.json();
          throw new Error(errorResponse.message || "Failed to delete product.");
        }
        showMessage(`Product "${item.name}" deleted successfully!`, true);
        setTimeout(() => {
          window.history.back();
        }, 1500);
      } catch (err) {
        showMessage(err.message, false);
      }
    },
    [item, userId, sellerId]
  );

  useEffect(() => {
    if (!item || userId != sellerId) return;
    setName(item.name || "");
    setImage(item.images[0] || "");
  }, [item, sellerId, userId]);

  useEffect(() => {
    if ((!userLoading && !user) || (sellerId && userId != sellerId)) {
      showMessage("Unauthorized Access", false);
      setTimeout(() => {
        router.push("/home");
      }, 1000);
    }
  }, [userLoading, user, router, userId, sellerId]);

  return (
    <div className="flex flex-col items-center gap-5 md:gap-10">
      <Header />
      <div className="w-full max-w-[1200px] px-4">
        {itemLoading ? (
          <div className="h-screen pt-5">
            <Loader />
          </div>
        ) : itemError ? (
          <div>Error</div>
        ) : (
          <div className="w-full">
            <div className="flex flex-col gap-4 md:max-w-[500px] ">
              <div>
                <h3 className="font-bold text-orange-800 text-base">
                  Delete Product
                </h3>
                <p className="text-sm md:text-base text-gray-500">
                  Are you sure you want to delete this product? This action can
                  not be undone.
                </p>
                <div
                  className={`mt-5 flex flex-col justify-between gap-4 items-center w-full rounded-xl bg-gray-100 p-4`}
                >
                  <div className={`flex gap-4 items-center w-full `}>
                    <div>
                      <img
                        src={image}
                        className="w-full bg-white aspect-square h-auto max-w-16 object-cover rounded-xl"
                        alt="Product Image"
                      />
                    </div>
                    <h3 className="font-semibold leading-tight text-sm tracking-tight line-clamp-2 ">
                      {name}
                    </h3>
                  </div>
                  <div className="flex gap-2 text-xs">
                    <button
                      disabled={!item || itemLoading}
                      onClick={handleDeleteProductSubmit}
                      className={`p-1.5 px-4 rounded-xl border bg-green-500 hover:bg-green-600 text-white disabled:opacity-60  disabled:hover:bg-green-500`}
                    >
                      Confirm
                    </button>
                    <button
                      onClick={() => {
                        window.history.back();
                      }}
                      disabled={itemLoading}
                      className=" p-1.5 px-4 rounded-xl border bg-gray-400 hover:bg-gray-500 text-white  disabled:hover:bg-gray-400 disabled:opacity-60"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
