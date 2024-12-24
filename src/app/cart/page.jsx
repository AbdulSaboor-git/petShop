"use client";
import React, { useState } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { FaTrashAlt } from "react-icons/fa";
import CartItem from "./components/cart-item";

export default function Cart() {
  const [selectedItems, setSelectedItems] = useState([]);
  const [quantities, setQuantities] = useState({});

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
      id: 19,
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

  const handleCheckout = () => {
    // Handle checkout logic here
    console.log("Selected items for checkout:", selectedItems);
  };

  const handleDeleteItem = () => {};

  const totalAmount = selectedItems.reduce((total, itemId) => {
    const item = cart_items.find((item) => item.id === itemId);
    return total + item.price;
  }, 0);

  return (
    <div className="flex flex-col items-center gap-10 min-h-screen">
      <Header />
      <div className="flex flex-col gap-3 w-full max-w-[800px] p-4">
        <h1 className="font-bold pl-1 ">My Cart ({cart_items.length})</h1>
        <div className="flex flex-col gap-2">
          {cart_items.map((item) => (
            <CartItem
              key={item.id}
              item={item}
              selectedItems={selectedItems}
              handleSelectItem={handleSelectItem}
              handleDeleteItem={handleDeleteItem}
            />
          ))}
          {cart_items.length === 0 && (
            <div className="text-xs md:text-sm  bg-white text-gray-400 text-center border-2 p-2">
              Cart is empty
            </div>
          )}
        </div>
        <div className="flex flex-col w-full bg-red-100 md:flex-row justify-between items-center p-4 ">
          <div className="text-lg font-bold mb-4 md:mb-0">
            Total: {totalAmount} PKR
          </div>
          <button
            className="text-xs md:text-sm text-orange-500 border border-orange-500 px-3 py-1 rounded hover:bg-orange-500 hover:text-white flex gap-2 items-center justify-center"
            onClick={handleCheckout}
          >
            Checkout
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
}
