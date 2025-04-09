import prisma from "@/lib/prisma";
import { availability } from "@prisma/client";

export default async function handler(req, res) {
  const { method } = req;
  const { sellerId } = req.query;

  switch (method) {
    case "GET":
      return handleGet(req, res, sellerId);
    default:
      res.setHeader("Allow", ["GET"]);
      return res.status(405).json({ message: `Method ${method} Not Allowed` });
  }
}

const handleGet = async (req, res, sellerId) => {
  if (!sellerId) {
    return res.status(400).json({ message: "sellerId is required" });
  }

  const id = parseInt(sellerId, 10);
  if (isNaN(id)) {
    return res.status(400).json({ message: "Invalid sellerId" });
  }
  try {
    const items = await prisma.item.findMany({
      select: {
        id: true,
        name: true,
        breed: { select: { id: true, name: true } },
        category: { select: { id: true, name: true } },
        sellerId: true,
        availability: true,
        images: true,
        createdAt: true,
        updatedAt: true,
      },
      where: { sellerId: id },
    });

    return res.status(200).json({ items });
  } catch (error) {
    console.error("Error fetching data:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
