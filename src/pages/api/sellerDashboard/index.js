import prisma from "@/lib/prisma";

export default async function handler(req, res) {
  const { method } = req;
  const { sellerId } = req.query; // Extract sellerId from query params

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
    const totalItems = await prisma.item.count({ where: { sellerId: id } });
    const availableItems = await prisma.item.count({
      where: { sellerId: id, availability: "AVAILABLE" },
    });
    const categories = await prisma.category.findMany();
    const breeds = await prisma.breed.findMany();

    return res.status(200).json({
      success: true,
      data: { totalItems, availableItems, categories, breeds },
    });
  } catch (error) {
    console.error("Error fetching seller metrics:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
