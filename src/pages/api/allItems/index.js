import prisma from "@/lib/prisma";

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
  try {
    if (sellerId) {
      const id = parseInt(sellerId, 10);
      if (isNaN(id) || id <= 0) {
        return res
          .status(400)
          .json({
            message: "Invalid Seller ID. Please provide a valid numeric ID.",
          });
      }

      const items = await prisma.item.findMany({
        where: { sellerId: id, availability: "AVAILABLE" },
        include: { seller: true, category: true, breed: true },
      });

      if (!items.length) {
        return res
          .status(404)
          .json({ message: "No available items found for this seller." });
      }

      return res.status(200).json({ items });
    }

    const items = await prisma.item.findMany({
      include: { seller: true, category: true, breed: true },
    });

    if (!items.length) {
      return res.status(404).json({ message: "No items found." });
    }

    return res.status(200).json({ items });
  } catch (error) {
    console.error("Error fetching items:", error);
    return res
      .status(500)
      .json({ message: "Internal Server Error. Please try again later." });
  }
};
