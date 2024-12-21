import React from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { FaHeart } from "react-icons/fa";

export default function Profile() {
    const user = {
        id: 1,
        email: "abc@example.com",
        password: "securepassword123",
        createdAt: new Date(),
        updatedAt: new Date(),
        firstName: "John",
        lastName: "Doe",
        lastLogin: new Date(),
        profilePicture: "1.jpg",
        isActive: true,
        role: "user",
        address: "123 Main St, Anytown, USA",
        phone: "(123) 456-7890",
    };

    const pastPurchases = [
        {
            id: 1,
            name: "Orpington Chicken",
            price: 2400,
            purchaseDate: new Date('2023-01-15'),
            img: "/3.jpg",
        },
        {
            id: 2,
            name: "Indian Game Chicken",
            price: 2200,
            purchaseDate: new Date('2023-02-20'),
            img: "/2.jpg",
        },
    ];

    const wishlist = [
        {
            id: 1,
            name: "Silkie Chicken",
            price: 1800,
            img: "/4.jpg",
        },
        {
            id: 2,
            name: "Leghorn Chicken",
            price: 2000,
            img: "/5.jpg",
        },
    ];

    return (
        <div className="flex flex-col items-center gap-10 bg-gray-100 min-h-screen">
            <Header />
            <div className="flex flex-col w-full max-w-[1400px] items-center px-4 py-8">
                <div className="flex flex-col md:flex-row gap-8 w-full max-w-[1200px] bg-white p-6 rounded-lg shadow-lg">
                    <div className="flex flex-col items-center md:w-1/3">
                        <img src={user.profilePicture} alt={`${user.firstName} ${user.lastName}`} className="w-32 h-32 rounded-full mb-4" />
                        <h1 className="text-2xl font-bold">{`${user.firstName} ${user.lastName}`}</h1>
                        <p className="text-gray-600">{user.email}</p>
                        <p className="text-gray-600">{user.address}</p>
                        <p className="text-gray-600">{user.phone}</p>
                        <button className="bg-blue-500 text-white px-4 py-2 rounded mt-4">Edit Profile</button>
                    </div>
                    <div className="flex flex-col md:w-2/3 gap-8">
                        <div className="flex flex-col gap-4">
                            <h2 className="text-xl font-semibold">Past Purchases</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {pastPurchases.map(purchase => (
                                    <div key={purchase.id} className="flex flex-col items-center border p-4 rounded-lg bg-gray-50">
                                        <img src={purchase.img} alt={purchase.name} className="w-32 h-32 object-cover rounded-lg mb-2" />
                                        <h3 className="text-lg font-bold">{purchase.name}</h3>
                                        <p className="text-gray-600">{purchase.price} PKR</p>
                                        <p className="text-gray-500 text-sm">Purchased on: {purchase.purchaseDate.toDateString()}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="flex flex-col gap-4">
                            <h2 className="text-xl font-semibold">Wishlist</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {wishlist.map(item => (
                                    <div key={item.id} className="flex flex-col items-center border p-4 rounded-lg bg-gray-50">
                                        <img src={item.img} alt={item.name} className="w-32 h-32 object-cover rounded-lg mb-2" />
                                        <h3 className="text-lg font-bold">{item.name}</h3>
                                        <p className="text-gray-600">{item.price} PKR</p>
                                        <button className="bg-green-500 text-white px-4 py-2 rounded mt-2">Add to Cart</button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}