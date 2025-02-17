import React, { useState } from "react";
import { MdEmail, MdWhatsapp } from "react-icons/md";

export default function Order({ items, closeOrderPage }) {
  // New state for customer details
  const [customerName, setCustomerName] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [customerContact, setCustomerContact] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [additionalNotes, setAdditionalNotes] = useState("");

  // State for error messages for required fields
  const [nameError, setNameError] = useState("");
  const [addressError, setAddressError] = useState("");
  const [contactError, setContactError] = useState("");

  // Validation functions
  const validateName = (value) => {
    if (value.trim().length < 2) {
      setNameError("Name must be at least 2 characters.");
    } else {
      setNameError("");
    }
  };

  const validateAddress = (value) => {
    if (value.trim().length < 6) {
      setAddressError("Address must be at least 6 characters.");
    } else {
      setAddressError("");
    }
  };

  const validateContact = (value) => {
    if (value.trim().length < 11) {
      setContactError("Contact number must be at least 11 digits.");
    } else {
      setContactError("");
    }
  };

  // Check if required fields are filled and valid
  const isFormValid =
    customerName.trim().length >= 2 &&
    customerAddress.trim().length >= 6 &&
    customerContact.trim().length >= 11 &&
    !nameError &&
    !addressError &&
    !contactError;

  const generateOrderMessage = () => {
    if (!items || items.length === 0) return "";

    // Build product details for each item
    const productDetails = items
      .map((item) => {
        const priceText = item.isDiscounted
          ? `Price: Rs. ${item.discountedPrice} (Discounted from Rs. ${item.price})`
          : `Price: Rs. ${item.price}`;
        const productLink = `${window.location.origin}/item/${item.id}`;
        return `Item ID: ${item.id}
    Item Name: ${item.name}
    ${priceText}
    Product Link: ${productLink}`;
      })
      .join("\n\n");

    // Use seller details from the first item (assuming all items are from the same seller)
    const seller = items[0].seller;

    return `Hello ${seller.firstName} ${seller.lastName},
    
    I am interested in inquiring about the following item${
      items.length > 1 ? "s" : ""
    }:
    
    ${productDetails}
    
    Customer Details:
    Name: ${customerName}
    Address: ${customerAddress}
    Contact No.: ${customerContact}
    ${customerEmail ? "Email: " + customerEmail : ""}
    ${additionalNotes ? 'Additional Notes: "' + additionalNotes + '"' : ""}
    
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
    setNameError("");
    setAddressError("");
    setContactError("");
  };

  // Handler for placing an order via WhatsApp.
  const handleWhatsappOrder = () => {
    if (
      !isFormValid ||
      !items ||
      items.length === 0 ||
      !items[0].seller?.phoneNo
    )
      return;
    const message = generateOrderMessage();
    const phoneNumber = items[0].seller.phoneNo.replace(/\D/g, ""); // Remove non-digit characters
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
      message
    )}`;
    window.open(whatsappUrl, "_blank");
    closeOrder();
  };

  // Handler for placing an order via Email.
  const handleEmailOrder = () => {
    if (!isFormValid || !items || items.length === 0 || !items[0].seller?.email)
      return;
    const message = generateOrderMessage();
    const subject = `Order Inquiry`;
    const mailtoUrl = `mailto:${
      items[0].seller.email
    }?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(
      message
    )}`;
    window.location.href = mailtoUrl;
    closeOrder();
  };

  return (
    <div className="w-full max-w-[500px]">
      {items.length != 0 && (
        <div className="flex w-full flex-col text-xs md:text-sm gap-4 self-center p-5 py-10 rounded-xl border bg-gray-50 text-gray-700 text-center shadow-md">
          <h2 className="text-base md:text-lg font-bold">
            Product{items.length > 1 && "s"} Inquiry
          </h2>
          <div className="flex flex-col items-center justify-center gap-2">
            {items.map((item, i) => (
              <div
                key={i}
                className="flex gap-4 items-center w-full border bg-gray-100 p-2 rounded-lg md:min-w-[400px]"
              >
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
            ))}
          </div>
          {/* Customer Info Form */}
          <div className="flex flex-col gap-2 border p-4 rounded-lg bg-gray-100">
            <input
              type="text"
              placeholder="Your Name"
              value={customerName}
              onChange={(e) => {
                setCustomerName(e.target.value);
                validateName(e.target.value);
              }}
              onBlur={(e) => validateName(e.target.value)}
              className="p-2 border rounded focus:outline-none"
              required
              minLength={2}
            />
            {nameError && (
              <p className="text-red-600 text-xs mt-1">{nameError}</p>
            )}
            <input
              type="text"
              placeholder="Your Address"
              value={customerAddress}
              onChange={(e) => {
                setCustomerAddress(e.target.value);
                validateAddress(e.target.value);
              }}
              onBlur={(e) => validateAddress(e.target.value)}
              className="p-2 border rounded focus:outline-none"
              required
              minLength={6}
            />
            {addressError && (
              <p className="text-red-600 text-xs mt-1">{addressError}</p>
            )}
            <input
              type="number"
              placeholder="Contact Number (03001234567)"
              value={customerContact}
              onChange={(e) => {
                setCustomerContact(e.target.value);
                validateContact(e.target.value);
              }}
              onBlur={(e) => validateContact(e.target.value)}
              className="p-2 no-spinner border rounded focus:outline-none"
              required
              minLength={11}
            />
            {contactError && (
              <p className="text-red-600 text-xs mt-1">{contactError}</p>
            )}
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
            <button
              onClick={handleWhatsappOrder}
              disabled={!isFormValid}
              className={`flex items-center gap-2 justify-center bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded ${
                !isFormValid && "opacity-50 cursor-not-allowed"
              }`}
            >
              Proceed via WhatsApp
              <MdWhatsapp size={15} />
            </button>
            <button
              onClick={handleEmailOrder}
              disabled={!isFormValid}
              className={`flex items-center gap-2 justify-center bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded ${
                !isFormValid && "opacity-50 cursor-not-allowed"
              }`}
            >
              Proceed via Email
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
