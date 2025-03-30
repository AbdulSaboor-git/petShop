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
    const [items, categories, breeds] = await Promise.all([
      prisma.item.findMany({
        select: {
          id: true,
          name: true,
          breedId: true,
          categoryId: true,
          category: { select: { id: true, name: true } },
          breed: { select: { id: true, name: true } },
          price: true,
          discountedPrice: true,
          isDiscounted: true,
          images: true,
        },
        where: { availability: "AVAILABLE" },
      }),
      prisma.category.findMany({
        select: {
          id: true,
          name: true,
          _count: { select: { items: true } },
        },
        orderBy: { name: "asc" },
      }),
      prisma.breed.findMany({
        select: {
          id: true,
          name: true,
          _count: { select: { items: true } },
        },
        orderBy: { name: "asc" },
      }),
    ]);

    return res.status(200).json({ items, categories, breeds });
  } catch (error) {
    console.error("Error fetching data:", error);

    if (error instanceof prisma.PrismaClientKnownRequestError) {
      return res
        .status(400)
        .json({ message: "Database error", code: error.code });
    } else if (error instanceof Prisma.PrismaClientInitializationError) {
      return res.status(500).json({ message: "Database connection error" });
    } else if (error instanceof Prisma.PrismaClientRustPanicError) {
      return res.status(500).json({ message: "Unexpected database crash" });
    }

    return res.status(500).json({ message: "Internal Server Error" });
  }
};
