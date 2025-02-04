import React, { useState } from "react";
import { MdEmail, MdWhatsapp } from "react-icons/md";

export default function Order({ item }) {
  const generateOrderMessage = () => {
    if (!item) return "";
    const priceText = item.isDiscounted
      ? `Discounted Price: Rs. ${item.discountedPrice} (Original: Rs. ${item.price})`
      : `Price: Rs. ${item.price}`;
    return `Hello ${item.seller.firstName + " " + item.seller.lastName},

I am interested in placing an order for the following item:

Item ID: ${item.id}
Item: ${item.name}
${priceText}
Description: ${item.description.substring(0, 100)}...

Please let me know the next steps to complete my order.

Thank you.`;
  };

  // Handler for placing an order via WhatsApp.
  const handleWhatsappOrder = () => {
    if (!item || !item.seller.phoneNo) return;
    const message = generateOrderMessage();
    const phoneNumber = item.seller.phoneNo.replace(/\D/g, ""); // Remove non-digit characters
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
      message
    )}`;
    window.open(whatsappUrl, "_blank");
  };

  // Handler for placing an order via Email.
  const handleEmailOrder = () => {
    if (!item || !item.seller.email) return;
    const message = generateOrderMessage();
    const subject = `Order Inquiry: ${item.name}`;
    const mailtoUrl = `mailto:${item.seller.email}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(message)}`;
    window.location.href = mailtoUrl;
  };

  return (
    <div className="w-full max-w-[500px]">
      {item && (
        <div className="flex w-full flex-col text-xs md:text-sm gap-4 self-center p-5 py-10 rounded-xl border bg-gray-50 text-gray-700 text-center shadow-md">
          <h2 className="text-base md:text-lg font-bold">Order Inquiry</h2>
          <div className="flex gap-4 items-center w-full bg-gray-100 p-4 rounded-lg md:min-w-[400px]">
            <img
              src={item.images[0]}
              alt={item.name}
              className="w-16 object-cover aspect-square rounded-lg cursor-pointer"
            />
            <div className="text-sm  flex flex-col items-start gap-[1px] ">
              <h3 className="font-bold cursor-pointer leading-tight line-clamp-2 ">
                {item.name}
              </h3>
              <p className="text-xs  text-gray-600">{item.breed?.name} </p>
              <p className="text-xs  text-green-600">
                Rs. {item.isDiscounted ? item.discountedPrice : item.price}{" "}
              </p>
            </div>
          </div>
          <div className="flex flex-col md:flex-row gap-2 justify-center">
            <h3 className="font-bold text-left">Place Order via</h3>
            <button
              onClick={handleWhatsappOrder}
              className="flex items-center gap-2 justify-center bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded"
            >
              WhatsApp
              <MdWhatsapp />
            </button>
            <button
              onClick={handleEmailOrder}
              className="flex items-center gap-2 justify-center bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
            >
              Email
              <MdEmail />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
