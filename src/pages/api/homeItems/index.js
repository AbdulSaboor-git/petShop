import prisma from "@/lib/prisma";
import { Select } from "@mui/material";

export default async function handler(req, res) {
  const { method } = req;

  switch (method) {
    case "GET":
      return handleGet(req, res);
    default:
      res.setHeader("Allow", ["GET"]);
      return res.status(405).json({ message: `Method ${method} Not Allowed` });
  }
}

const handleGet = async (req, res) => {
  try {
    // Sequential database queries instead of Promise.all
    const fetchedItems = await prisma.item.findMany({
      select: {
        id: true,
        name: true,
        breedId: true,
        breed: { select: { id: true, name: true } },
        categoryId: true,
        category: { select: { id: true, name: true } },
        sellerId: true,
        seller: { select: { id: true, firstName: true, lastName: true } },
        price: true,
        discountedPrice: true,
        isDiscounted: true,
        images: true,
        specifications: true,
        createdAt: true,
        updatedAt: true,
      },
      where: { availability: "AVAILABLE" },
    });

    const categories = await prisma.category.findMany({
      select: {
        id: true,
        name: true,
        _count: {
          select: {
            items: {
              where: { availability: "AVAILABLE" },
            },
          },
        },
      },
      orderBy: { name: "asc" },
    });

    const breeds = await prisma.breed.findMany({
      select: {
        id: true,
        name: true,
        _count: {
          select: {
            items: {
              where: { availability: "AVAILABLE" },
            },
          },
        },
      },
      orderBy: { name: "asc" },
    });

    const items = fetchedItems.sort(() => Math.random() - 0.5);
    return res.status(200).json({ items, categories, breeds });
  } catch (error) {
    console.error("Error fetching data:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
