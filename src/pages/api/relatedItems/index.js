import prisma from "@/lib/prisma";
import { availability } from "@prisma/client";

export default async function handler(req, res) {
  const { method } = req;
  const { category, breed, sex, itemId } = req.query;

  if (method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ message: `Method ${method} Not Allowed` });
  }

  return handleGet(req, res, category, breed, sex, itemId);
}

const handleGet = async (req, res, category, breed, sex, itemId) => {
  const categoryId = parseInt(category, 10);
  const breedId = breed ? parseInt(breed, 10) : null;
  const currentItemId = parseInt(itemId, 10);
  const oppositeSex =
    sex && (sex === "Male" ? "Female" : sex === "Female" ? "Male" : null);

  if (
    isNaN(categoryId) ||
    categoryId <= 0 ||
    isNaN(currentItemId) ||
    currentItemId <= 0
  ) {
    return res.status(400).json({ message: "Invalid category ID or item ID" });
  }

  try {
    // Sequential queries instead of Promise.all
    const relatedItems = await prisma.item.findMany({
      where: {
        categoryId,
        breedId: breedId ? breedId : undefined,
        id: { not: currentItemId }, // Exclude current item
        availability: "AVAILABLE",
        sex,
      },
      select: {
        id: true,
        name: true,
        price: true,
        images: true,
        availability: true,
        sex: true,
      },
      orderBy: { createdAt: "desc" },
      take: 4,
    });

    // Fetch bought together items ONLY if the current item has a sex
    const boughtTogetherItems = sex
      ? await prisma.item.findMany({
          where: {
            categoryId,
            breedId: breedId ? breedId : undefined,
            sex: oppositeSex, // Opposite sex only
            id: { not: currentItemId }, // Exclude current item
            availability: "AVAILABLE",
            NOT: { sex: null }, // Ensure sex is not null
          },
          select: {
            id: true,
            name: true,
            price: true,
            images: true,
            availability: true,
            sex: true,
          },
          orderBy: { createdAt: "desc" },
          take: 2,
        })
      : []; // If sex is null, return empty array

    return res.status(200).json({ relatedItems, boughtTogetherItems });
  } catch (error) {
    console.error("Error fetching related items:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
