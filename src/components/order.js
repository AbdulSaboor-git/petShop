import React, { useState } from "react";
import { MdEmail, MdWhatsapp } from "react-icons/md";

export default function Order({ item, closeOrderPage }) {
  // New state for customer details
  const [customerName, setCustomerName] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [customerContact, setCustomerContact] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [additionalNotes, setAdditionalNotes] = useState("");

  // Check if required fields are filled (trim to avoid whitespace only)
  const isFormValid =
    customerName.trim().length > 1 &&
    customerAddress.trim().length > 5 &&
    customerContact.trim().length > 10;

  const generateOrderMessage = () => {
    if (!item) return "";
    const priceText = item.isDiscounted
      ? `Price: Rs. ${item.discountedPrice}`
      : `Price: Rs. ${item.price}`;

    // Construct a full URL to the product.
    const productLink = `${window.location.origin}/item/${item.id}`;

    return `Hello ${item.seller.firstName} ${item.seller.lastName},
      
I am interested in inquiring about the following item:
      
Item ID: ${item.id}
Item Name: ${item.name}
${priceText}
Product Link: ${productLink}
      
Customer Details:
Name: ${customerName}
Address: ${customerAddress}
Contact No.: ${customerContact}
${customerEmail ? "Email: " + customerEmail : ""}
${additionalNotes ? "Additional Notes: " + '"' + additionalNotes + '"' : ""}
      
Please let me know the next steps to complete my order.
      
Thank you.`;
  };

  const closeOrder = () => {
    closeOrderPage();
    setCustomerName("");
    setCustomerEmail("");
    setAdditionalNotes("");
    setCustomerContact("");
    setCustomerAddress("");
  };
  // Handler for placing an order via WhatsApp.
  const handleWhatsappOrder = () => {
    if (!isFormValid || !item || !item.seller?.phoneNo) return;
    const message = generateOrderMessage();
    const phoneNumber = item.seller.phoneNo.replace(/\D/g, ""); // Remove non-digit characters
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
      message
    )}`;
    window.open(whatsappUrl, "_blank");
    closeOrder();
  };

  // Handler for placing an order via Email.
  const handleEmailOrder = () => {
    if (!isFormValid || !item || !item.seller?.email) return;
    const message = generateOrderMessage();
    const subject = `Order Inquiry: ${item.name}`;
    const mailtoUrl = `mailto:${item.seller.email}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(message)}`;
    window.location.href = mailtoUrl;
    closeOrder();
  };

  return (
    <div className="w-full max-w-[500px]">
      {item && (
        <div className="flex w-full flex-col text-xs md:text-sm gap-4 self-center p-5 py-10 rounded-xl border bg-gray-50 text-gray-700 text-center shadow-md">
          <h2 className="text-base md:text-lg font-bold">Order Inquiry</h2>
          <div className="flex gap-4 items-center w-full border bg-gray-100 p-4 rounded-lg md:min-w-[400px]">
            <img
              src={item.images[0]}
              alt={item.name}
              className="w-16 object-cover aspect-square rounded-lg cursor-pointer"
            />
            <div className="text-sm flex flex-col items-start gap-[1px]">
              <h3 className="font-bold cursor-pointer leading-tight line-clamp-2">
                {item.name}
              </h3>
              <p className="text-xs text-gray-600">{item.breed?.name}</p>
              <p className="text-xs text-green-600">
                Rs. {item.isDiscounted ? item.discountedPrice : item.price}
              </p>
            </div>
          </div>
          {/* New Form Section for Customer Details */}
          <div className="flex flex-col gap-2 border p-4 rounded-lg bg-gray-100">
            <input
              type="text"
              placeholder="Your Name"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="p-2 border rounded focus:outline-none"
              required
              minLength={2}
            />
            <input
              type="text"
              placeholder="Your Address"
              value={customerAddress}
              onChange={(e) => setCustomerAddress(e.target.value)}
              className="p-2 border rounded focus:outline-none"
              required
              minLength={6}
            />
            <input
              type="text"
              placeholder="Contact Number"
              value={customerContact}
              onChange={(e) => setCustomerContact(e.target.value)}
              className="p-2 border rounded focus:outline-none"
              required
              minLength={11}
            />
            <input
              type="email"
              placeholder="Email (Optional)"
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
              className="p-2 border rounded focus:outline-none"
            />
            <textarea
              placeholder="Additional Notes (Optional)"
              value={additionalNotes}
              onChange={(e) => setAdditionalNotes(e.target.value)}
              className="p-2 border rounded focus:outline-none resize-none"
            />
          </div>
          <div className="flex flex-col md:flex-row gap-2 justify-center">
            <h3 className="font-bold text-left">Inquire Order via</h3>
            <button
              onClick={handleWhatsappOrder}
              disabled={!isFormValid}
              className={`flex items-center gap-2 justify-center bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded ${
                !isFormValid && "opacity-50 cursor-not-allowed"
              }`}
            >
              WhatsApp
              <MdWhatsapp size={15} />
            </button>
            <button
              onClick={handleEmailOrder}
              disabled={!isFormValid}
              className={`flex items-center gap-2 justify-center bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded ${
                !isFormValid && "opacity-50 cursor-not-allowed"
              }`}
            >
              Email
              <MdEmail size={15} />
            </button>
            <button
              onClick={closeOrder}
              className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
