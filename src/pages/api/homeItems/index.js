import prisma from "@/lib/prisma";
import { availability } from "@prisma/client";

export default async function handler(req, res) {
  const { method } = req;

  switch (method) {
    case "GET":
      return handleGet(req, res);
    default:
      res.setHeader("Allow", ["GET"]);
      return res.status(405).end(`Method ${method} Not Allowed`);
  }
}

const handleGet = async (req, res) => {
  res.setHeader("Cache-Control", "no-store");
  try {
    const items = await prisma.item.findMany({
      where: { availability: "AVAILABLE" },
      include: { seller: true, category: true, breed: true },
    });

    return res.status(200).json({ items });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
