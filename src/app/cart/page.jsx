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

  const totalAmount = selectedItems.reduce((total, itemId) => {
    const item = cart_items.find((item) => item.id === itemId);
    return total + item.price;
  }, 0);

  return (
    <div className="flex flex-col items-center gap-10 bg-gray-100 min-h-screen">
      <Header />
      <div className="flex flex-col w-full max-w-[1400px] items-center px-4 py-8">
        <div className="flex flex-col gap-8 w-full max-w-[1200px] bg-white p-6 rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold text-center">Shopping Cart</h1>
          <div className="flex flex-col gap-4">
            {cart_items.map((item) => (
              <CartItem
                key={item.id}
                item={item}
                selectedItems={selectedItems}
                handleSelectItem={handleSelectItem}
              />
            ))}
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center p-4 bg-white shadow-lg shadow-red-500/50">
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
      </div>
      <Footer />
    </div>
  );
}
