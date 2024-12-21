import React from "react";
import Header from "@/components/header";
import WishListItem from "./components/123";
import Footer from "@/components/footer";
import { FaHeart } from "react-icons/fa";

export default function Profile() {
    const wishl = [{
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
        availability: true,
    },
    {
        id: 20,
        name: "Hamburg Chicken",
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
        availability: false,
    }];
    return (
        <div className="flex flex-col items-center gap-10">
            <Header />
            <div className=" flex flex-col w-full max-w-[1400px] items-center px-4">
                <div className="flex flex-col gap-4 w-full max-w-[1200px]">
                    <div className="flex gap-2 items-center">
                        WISHLIST
                        <FaHeart className="text-red-500" />
                    </div>
                    {
                        wishl.map(
                            (item, i) => (
                                <div key={i}>
                                    <WishListItem item={item} />
                                </div>
                            )
                        )
                    }
                </div>
            </div>
            <Footer />
        </div>
    )
} 