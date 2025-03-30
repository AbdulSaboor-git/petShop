import prisma from "@/lib/prisma";

export default async function handler(req, res) {
  const { method } = req;
  const { sellerId } = req.query;

  if (method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ message: `Method ${method} Not Allowed` });
  }

  return handleGet(req, res, sellerId);
}

const handleGet = async (req, res, sellerId) => {
  const id = parseInt(sellerId, 10);
  if (isNaN(id) || id <= 0) {
    return res.status(400).json({ message: "Invalid seller ID" });
  }

  try {
    // Sequential queries instead of Promise.all
    const items = await prisma.item.findMany({
      select: {
        id: true,
        name: true,
        availability: true,
      },
      where: { sellerId: id },
      orderBy: { name: "asc" },
    });

    const categories = await prisma.category.findMany({
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    });

    const breeds = await prisma.breed.findMany({
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    });

    return res.status(200).json({ items, categories, breeds });
  } catch (error) {
    console.error("Error fetching data:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
