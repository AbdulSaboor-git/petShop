"use client";
import React, { useEffect, useRef, useState } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { FaTrashAlt } from "react-icons/fa";
import CartItem from "./components/cart-item";

export default function Cart() {
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedAll, setSelectedAll] = useState(false);
  const [checkout, setCheckout] = useState(false);
  const orderConfirmationRef = useRef(null);

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

  const new_cart_items = cart_items.filter((item) => item.availability);

  const handleSelectItem = (itemId) => {
    setCheckout(false);
    setSelectedItems((prevSelectedItems) =>
      prevSelectedItems.includes(itemId)
        ? prevSelectedItems.filter((id) => id !== itemId)
        : [...prevSelectedItems, itemId]
    );
  };

  useEffect(() => {
    selectedItems.length === new_cart_items.length
      ? setSelectedAll(true)
      : setSelectedAll(false);
  }, [new_cart_items, selectedItems]);

  const handleCheckout = () => {
    setCheckout(true);
    setTimeout(() => {
      const offset = 30;
      const elementPosition =
        orderConfirmationRef.current.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }, 100);
  };

  const handleDeleteItem = (itemId) => {};
  const handlePlaceOrder = () => {};

  const handleSelectAll = () => {
    selectedItems.length != new_cart_items.length && setSelectedItems([]);
    new_cart_items.map((item) => handleSelectItem(item.id));
  };

  const totalAmount = selectedItems.reduce((total, itemId) => {
    const item = new_cart_items.find((item) => item.id === itemId);
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
              handleDeleteItem={handleDeleteItem}
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
            className="text-xs md:text-sm w-fit cursor-pointer self-end text-white bg-orange-500 border border-orange-500 px-3 py-2 rounded hover:bg-orange-600 "
            onClick={handleCheckout}
            disabled={selectedItems.length === 0}
          >
            Checkout{" "}
            {selectedItems.length != 0 && "(" + selectedItems.length + ")"}
          </button>
        </div>
      </div>
      {checkout && (
        <div
          ref={orderConfirmationRef}
          className="flex flex-col mx-4 md:mx-10 text-xs md:text-sm w-fit gap-4 max-w-[400px] self-center p-5 py-10 rounded-xl border border-gray-300 border-dashed bg-white text-gray-700 text-center shadow-xl relative"
        >
          <h2 className="text-base md:text-lg font-bold">Order Confirmation</h2>

          <div className="flex flex-col text-start font-semibold gap-1 py-2">
            <h3 className="text-sm md:text-base font-bold px-2">Items:</h3>
            <div className="flex flex-col">
              {selectedItems.map((itemId) => {
                const item = cart_items.find((item) => item.id === itemId);
                return (
                  <div
                    key={item.id}
                    className="flex justify-between border-b px-2 border-gray-200 py-1"
                  >
                    <span className="font-normal">{item.name}</span>
                    <span className="font-normal">Rs. {item.price}</span>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="flex flex-col text-start font-semibold px-2 gap-1 border-t border-b border-gray-300 py-2">
            <p className="flex justify-between">
              <span>Total Items:</span>
              <span className="font-normal">{selectedItems.length}</span>
            </p>
            <p className="flex justify-between">
              <span>Total Amount:</span>
              <span className="font-normal">Rs. {totalAmount}</span>
            </p>
          </div>
          <div className="flex flex-col text-start font-semibold gap-1 mt-4 border-gray-300 py-2">
            <h3 className="text-sm md:text-base font-bold">
              Terms and Conditions:
            </h3>
            <p className="font-normal text-xs md:text-sm">
              By placing this order, you agree to our terms and conditions.
              Please ensure that all the information provided is accurate. Once
              the order is placed, it cannot be modified or canceled.
            </p>
          </div>
          <button
            className="bg-orange-500 text-white w-fit self-center px-4 py-1.5 rounded hover:bg-orange-600 mt-4"
            onClick={handlePlaceOrder}
          >
            Place Order
          </button>
        </div>
      )}
      <Footer />
    </div>
  );
}
