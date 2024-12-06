import React from "react";
import { Card, CardMedia, CardContent, Typography, Button, Box, IconButton } from "@mui/material";
import { MdDiscount, MdFavorite, MdFavoriteBorder, MdShoppingCart } from "react-icons/md";
import { FaCartPlus, FaSalesforce } from "react-icons/fa";
import { useRouter } from "next/navigation";

export default function ProductCard({ item }) {
    const name = item.name.toUpperCase();
    const router = useRouter();

    function prodClick() {
        router.push(`/product/${item.id}`);
    }
    return (
        <div
            onClick={prodClick}
        >

            <Card
                sx={{
                    cursor: "pointer",
                    maxWidth: 220,
                    minWidth: 160,
                    borderRadius: 5,
                    boxShadow: 3,
                    overflow: "hidden",
                    transform: "scale(1)",
                    transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
                    "&:hover": {
                        boxShadow: 6,
                    },
                    mx: 1.2,
                    mt: 2,
                    mb: 3,
                }}
                className="sm:hover:scale-105 sm:min-w-[200px]"
            >
                <Box sx={{
                    position: "relative",
                    width: "100%",
                    paddingTop: "100%",
                }}>
                    <CardMedia
                        component="img"
                        image={item.img}
                        alt={name}
                        sx={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            backgroundColor: "#fff",
                            border: 0
                        }}
                    />
                    <div className="absolute h-[50%] top-[51%] border-0 w-full z-20 bg-gradient-to-b from-transparent via-[#ffffff49] to-[#ffffff] from"></div>
                    {
                        item.isDiscounted &&
                        <div className="flex gap-1 items-center absolute top-0 right-5 bg-[#f00] p-2 py-1 text-center text-xs font-bold rounded-b-lg text-white">
                            SALE <MdDiscount />
                        </div>
                    }

                    {/* <IconButton edge="end" aria-label="fav"
                        className="absolute top-2 left-2 text-white text-lg bg-[#ff8c006f] hover:bg-[#ff8c00d6] transition-all duration-300 z-50">
                        <MdFavoriteBorder />
                    </IconButton> */}
                </Box>


                <div className="flex flex-col gap-1 p-4 pt-2 ">
                    <p className="text-xs font-bold text-orange-600 truncate">{name}</p>
                    <div className="flex justify-between items-center">
                        <div className="flex gap-2 items-end">
                            <div className="flex  gap-1 items-end  font-mono">
                                <div className="text-[10px] pb-1.5">PKR</div>
                                <div className="p-0 font-extrabold text-[19px] ">{item.isDiscounted ? item.discountedPrice : item.price}</div>
                            </div>
                            {item.isDiscounted && <div className="text-[10px] pb-1.5 text-gray-500 line-through" >
                                PKR {item.price}
                            </div>}
                        </div>



                    </div>
                    {/* <Button className="bg-orange-500 hover:bg-orange-600 text-sm text-white rounded-full flex gap-3 mt-4">
                        Add to Cart <FaCartPlus />
                    </Button> */}
                </div>
            </Card>
        </div>
    );
}
