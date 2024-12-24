"use client";
import React, { useState } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import OrderObj from "./components/ordersObj";
import WishListItem from "../wishlist/components/wishlistItem";
import { FaEdit, FaHeart } from "react-icons/fa";
import { MdLocationOn, MdMail, MdMap, MdPhone } from "react-icons/md";
import { useRouter } from "next/navigation";

export default function Profile() {
  const router = useRouter();
  const [ordersToShow, setOrdersToShow] = useState(3);
  const user = {
    id: 1,
    email: "abc@example.com",
    password: "securepassword123",
    createdAt: new Date(),
    updatedAt: new Date(),
    firstName: "John",
    lastName: "Doe",
    lastLogin: new Date(),
    profilePicture: "3.jpg",
    isActive: true,
    role: "user",
    address: "123 Main St, Anytown, USA",
    phone: "(123) 456-7890",
  };

  const wishlist = [
    {
      id: 18,
      name: "Orpington Chicken",
      breed: "Orpington",
      img: "/3.jpg",
      images: ["/1.jpg", "/3.jpg", "/2.jpg"],
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
      id: 18,
      name: "Orpington Chicken",
      breed: "Orpington",
      img: "/3.jpg",
      images: ["/1.jpg", "/3.jpg", "/2.jpg"],
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
      images: ["/1.jpg", "/3.jpg", "/2.jpg"],
      price: 2700,
      discountedPrice: 2500,
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
      id: 20,
      name: "Hamburg Chicken sdfsd sdg ds sdg s gd g",
      breed: "Hamburg",
      img: "/3.jpg",
      images: ["/1.jpg", "/3.jpg", "/2.jpg"],
      price: 2200,
      discountedPrice: 2000,
      isDiscounted: true,
      weight: 2.1,
      height: 280,
      age: 1.5,
      sex: "female",
      nature: "Active, good foragers, lays white eggs",
      specifications: "Feathers are predominantly white, reliable",
      type: "Egg-laying bird",
      availability: true,
    },
  ];

  const orders = [
    {
      id: 49337,
      date: new Date(),
      total: 4600,
      status: "Processing",
      items: [
        {
          id: 18,
          name: "Orpington Chicken",
          breed: "Orpington",
          img: "/3.jpg",
          images: ["/1.jpg", "/3.jpg", "/2.jpg"],
          price: 2400,
          discountedPrice: 2200,
          isDiscounted: true,
          weight: 2.7,
          height: 300,
          age: 1.5,
          sex: "female",
          nature: "Active, good foragers, lays white eggs",
          specifications: "Feathers are predominantly white, reliable",
          type: "Egg-laying bird",
          availability: false,
        },
        {
          id: 19,
          name: "Indian Game Chicken",
          breed: "Indian Game",
          img: "/2.jpg",
          images: ["/1.jpg", "/3.jpg", "/2.jpg"],
          price: 2700,
          discountedPrice: 2500,
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
      ],
    },
    {
      id: 43323,
      date: new Date(),
      total: 7100,
      status: "Completed",
      items: [
        {
          id: 18,
          name: "Orpington Chicken",
          breed: "Orpington",
          img: "/3.jpg",
          images: ["/1.jpg", "/3.jpg", "/2.jpg"],
          price: 2400,
          discountedPrice: 2200,
          isDiscounted: true,
          weight: 2.7,
          height: 300,
          age: 1.5,
          sex: "female",
          nature: "Active, good foragers, lays white eggs",
          specifications: "Feathers are predominantly white, reliable",
          type: "Egg-laying bird",
          availability: false,
        },
      ],
    },
    {
      id: 49986,
      date: new Date(),
      total: 5100,
      status: "Completed",
      items: [
        {
          id: 18,
          name: "Orpington Chicken",
          breed: "Orpington",
          img: "/3.jpg",
          images: ["/1.jpg", "/3.jpg", "/2.jpg"],
          price: 2400,
          discountedPrice: 2200,
          isDiscounted: true,
          weight: 2.7,
          height: 300,
          age: 1.5,
          sex: "female",
          nature: "Active, good foragers, lays white eggs",
          specifications: "Feathers are predominantly white, reliable",
          type: "Egg-laying bird",
          availability: false,
        },
        {
          id: 19,
          name: "Indian Game Chicken",
          breed: "Indian Game",
          img: "/2.jpg",
          images: ["/1.jpg", "/3.jpg", "/2.jpg"],
          price: 2700,
          discountedPrice: 2500,
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
      ],
    },
    {
      id: 49990,
      date: new Date(),
      total: 10300,
      status: "Canceled",
      items: [
        {
          id: 18,
          name: "Orpington Chicken",
          breed: "Orpington",
          img: "/3.jpg",
          images: ["/1.jpg", "/3.jpg", "/2.jpg"],
          price: 2400,
          discountedPrice: 2200,
          isDiscounted: true,
          weight: 2.7,
          height: 300,
          age: 1.5,
          sex: "female",
          nature: "Active, good foragers, lays white eggs",
          specifications: "Feathers are predominantly white, reliable",
          type: "Egg-laying bird",
          availability: false,
        },
      ],
    },
  ];

  function wishlistClick() {
    router.push("/wishlist");
  }

  return (
    <div className="flex flex-col items-center gap-10 min-h-screen">
      <Header />
      <div className="flex flex-col w-full max-w-[1400px] items-center p-4 pt-0 md:pt-4">
        <div className="flex flex-col gap-8 w-full max-w-[1200px] items-center">
          <div className="flex flex-col justify-center items-center md:items-start md:flex-row md:gap-8 w-full ">
            <img
              src={user.profilePicture}
              alt={`${user.firstName} ${user.lastName}`}
              className="w-28 h-28 rounded-full mb-4 md:mb-0"
            />
            <div className="flex flex-col items-center md:items-start mb-5 md:mb-0">
              <h1 className="text-lg md:text-xl font-bold mb-1">{`${user.firstName} ${user.lastName}`}</h1>
              <p className=" text-sm md:text-base text-gray-600 flex items-center gap-2">
                {<MdMail />}
                {user.email}
              </p>
              <button className="text-xs md:text-sm text-orange-500 border border-orange-500 px-3 py-1 rounded mt-4 hover:bg-orange-500 hover:text-white flex gap-2 items-center">
                Edit <FaEdit />
              </button>
            </div>
            <div className="text-sm flex flex-col gap-5 w-full max-w-[450px] md:max-w-fit md:flex-row">
              <div className="flex flex-col gap-1 w-full  md:w-fit md:min-w-[200px] md:max-w-[300px] ">
                <p className="flex gap-2 items-center text-black ">
                  {<MdPhone />} Contact
                </p>
                <p className="text-gray-600 flex items-center gap-2  border p-2 px-3  border-gray-400">
                  {user.phone}
                </p>
              </div>
              <div className="flex flex-col gap-1 w-full md:w-fit  md:min-w-[200px] md:max-w-[500px] ">
                <p className="flex gap-2 items-center text-black ">
                  {<MdLocationOn />} Address
                </p>
                <p className="text-gray-600 flex items-center gap-2  border p-2 px-3  border-gray-400">
                  {user.address}
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-col w-full max-w-[800px] gap-8">
            <div className="flex flex-col gap-4">
              <h2 className="px-1 text-base md:text-lg font-semibold">
                Wishlist
              </h2>
              <div className="flex flex-col gap-2 w-full">
                {wishlist.slice(0, 3).map((item, i) => (
                  <div key={i} className="">
                    <WishListItem item={item} />
                  </div>
                ))}
                {wishlist.length === 0 && (
                  <div className="text-sm md:text-base bg-white text-gray-500 text-center border-2 p-2">
                    Wishlist is empty
                  </div>
                )}
              </div>
              {wishlist.length > 3 && (
                <div
                  className="z-30 flex justify-center items-center p-1 -mx-3"
                  // style={{ boxShadow: "0 -15px 25px 10px rgba(255, 255, 255)" }}
                >
                  <button
                    onClick={wishlistClick}
                    className=" text-xs md:text-sm bg-white text-orange-500 border border-orange-500 px-3 py-1 rounded hover:bg-orange-500 hover:text-white flex gap-2 items-center justify-center"
                  >
                    View All
                  </button>
                </div>
              )}
            </div>
            <div className="flex flex-col gap-4">
              <div className="px-1 flex justify-between items-center gap-4">
                <h2 className="text-base md:text-lg font-semibold">
                  Your Orders
                </h2>
                {orders.length > 0 && (
                  <h2 className="text-sm md:text-base text-gray-500">
                    ({ordersToShow}/{orders.length})
                  </h2>
                )}
              </div>
              <div className="flex flex-col p-1.5 gap-0.5 w-full rounded-lg bg-orange-400">
                {orders.slice(0, ordersToShow).map((order, i) => (
                  <div key={i} className="">
                    <OrderObj order={order} />
                  </div>
                ))}
                {orders.length === 0 && (
                  <div className="text-sm md:text-base bg-white rounded-lg text-gray-500 text-center  p-2">
                    No Orders Yet
                  </div>
                )}
              </div>
              {orders.length > 3 && orders.length > ordersToShow && (
                <div className="flex justify-center z-10 items-center p-1 -mx-2">
                  <button
                    onClick={() => setOrdersToShow(ordersToShow + 1)}
                    className="text-xs md:text-sm text-orange-500 border border-orange-500 px-3 py-1 rounded hover:bg-orange-500 hover:text-white flex gap-2 items-center justify-center"
                  >
                    View More
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
