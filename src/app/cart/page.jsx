"use client";
import React, { useEffect, useState } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { FaTrashAlt } from "react-icons/fa";
import CartItem from "./components/cart-item";

export default function Cart() {
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedAll, setSelectedAll] = useState(false);

  const cart_items = [
    {
      id: 18,
      name: "Orpington Chicken",
      breed: "Orpington",
      img: "/3.jpg",
      price: 2400,
      discountedPrice: 2200,
      isDiscounted: true,
      weight: 2.7,
      height: 300,
      age: 2.4,
      sex: "female",
      nature: "Gentle, hardy, good for egg production",
      specifications: "Large, glossy black feathers",
      type: "Egg-laying bird",
      availability: true,
    },
    {
      id: 11,
      name: "Indian Game Chicken",
      breed: "Indian Game",
      img: "/2.jpg",
      price: 2200,
      discountedPrice: 2000,
      isDiscounted: true,
      weight: 3.0,
      height: 310,
      age: 1.8,
      sex: "male",
      nature: "Aggressive, hardy",
      specifications: "Feathers in vibrant colors, strong build",
      type: "Show and meat bird",
      availability: true,
    },
    {
      id: 20,
      name: "Indian Game Chicken",
      breed: "Indian Game",
      img: "/2.jpg",
      price: 2200,
      discountedPrice: 2000,
      isDiscounted: true,
      weight: 3.0,
      height: 310,
      age: 1.8,
      sex: "male",
      nature: "Aggressive, hardy",
      specifications: "Feathers in vibrant colors, strong build",
      type: "Show and meat bird",
      availability: false,
    },
    {
      id: 21,
      name: "Indian Game Chicken",
      breed: "Indian Game",
      img: "/2.jpg",
      price: 2200,
      discountedPrice: 2000,
      isDiscounted: true,
      weight: 3.0,
      height: 310,
      age: 1.8,
      sex: "male",
      nature: "Aggressive, hardy",
      specifications: "Feathers in vibrant colors, strong build",
      type: "Show and meat bird",
      availability: true,
    },
  ];

  const handleSelectItem = (itemId) => {
    setSelectedItems((prevSelectedItems) =>
      prevSelectedItems.includes(itemId)
        ? prevSelectedItems.filter((id) => id !== itemId)
        : [...prevSelectedItems, itemId]
    );
  };

  useEffect(() => {
    selectedItems.length === cart_items.length
      ? setSelectedAll(true)
      : setSelectedAll(false);
  }, [cart_items, selectedItems]);

  const handleCheckout = () => {
    // Handle checkout logic here
    console.log("Selected items for checkout:", selectedItems);
  };

  const handleDeleteItem = () => {};

  const handleSelectAll = () => {
    selectedItems.length != cart_items.length && setSelectedItems([]);
    cart_items.map((item) => handleSelectItem(item.id));
  };

  const totalAmount = selectedItems.reduce((total, itemId) => {
    const item = cart_items.find((item) => item.id === itemId);
    return total + item.price;
  }, 0);

  return (
    <div className="flex flex-col items-center gap-10 min-h-screen">
      <Header />
      <div className="flex flex-col gap-3 w-full max-w-[800px] p-4">
        <div className="flex justify-between items-center px-1">
          <h1 className="font-bold ">My Cart ({cart_items.length})</h1>
          <button
            className={`items-center text-sm md:text-base text-gray-500 cursor-default  ${
              selectedItems.length &&
              "text-red-500 cursor-pointer hover:text-red-600"
            }`}
            onClick={() => handleDeleteItem()}
          >
            <FaTrashAlt />{" "}
          </button>
        </div>
        <div className="flex flex-col gap-2">
          {cart_items.map((item) => (
            <CartItem
              key={item.id}
              item={item}
              selectedItems={selectedItems}
              handleSelectItem={handleSelectItem}
            />
          ))}
          {cart_items.length === 0 && (
            <div className="text-xs md:text-sm  bg-white text-gray-400 text-center border-2 p-2">
              Cart is empty
            </div>
          )}
        </div>
        <div className="flex flex-col gap-2 border-t border-gray-300 mt-6 p-5">
          <div className="flex gap-2 w-full justify-between items-center">
            <div className="flex gap-2 items-center text-[13px] md:text-sm">
              <input
                className="accent-orange-600 mb-0.5 size-3 md:size-4"
                type="checkbox"
                onClick={handleSelectAll}
                checked={selectedAll ? true : false}
              />{" "}
              All
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className=" text-sm md:text-base ">
                Subtotal:{" "}
                <span className="font-bold text-base md:text-lg text-orange-500">
                  Rs. {totalAmount}
                </span>
              </div>
            </div>
          </div>
          <button
            className="text-xs md:text-sm w-fit self-end text-white bg-orange-500 border border-orange-500 px-3 py-2 rounded hover:bg-orange-600 "
            onClick={handleCheckout}
          >
            Checkout{" "}
            {selectedItems.length != 0 && "(" + selectedItems.length + ")"}
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
}
