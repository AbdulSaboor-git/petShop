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
    const items = await prisma.item.findMany({
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
    });

    return res.status(200).json({ items });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
