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
      return res.status(405).end(`Method ${method} Not Allowed`);
  }
}

const handleGet = async (req, res, sellerId) => {
  const id = parseInt(sellerId, 10);
  try {
    const items = await prisma.item.findMany({
      select: {
        id: true,
        name: true,
        availability: true,
      },
      where: { sellerId: id },
      orderBy: { name: "asc" },
    });

    return res.status(200).json({ items });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
