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
    const [totalItems, availableItems, categCount, breedCount] =
      await Promise.all([
        prisma.item.count({ where: { sellerId: id } }),
        prisma.item.count({
          where: { sellerId: id, availability: "AVAILABLE" },
        }),
        prisma.category.count(),
        prisma.breed.count(),
      ]);

    return res.status(200).json({
      success: true,
      data: { totalItems, availableItems, categCount, breedCount },
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
