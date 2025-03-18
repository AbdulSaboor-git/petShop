import prisma from "@/lib/prisma";

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
    // Expecting a query parameter: /api/favItems?ids=1,2,3
    const { ids } = req.query;
    if (!ids) {
      return res.status(400).json({ message: "Missing ids query parameter" });
    }

    // Convert the comma-separated string into an array of numbers
    const favIds = ids
      .split(",")
      .map((id) => parseInt(id, 10))
      .filter((id) => !isNaN(id) && id > 0); // Ensure valid positive integers

    if (favIds.length === 0) {
      return res
        .status(400)
        .json({ message: "Invalid or empty ID list provided" });
    }

    // Fetch items whose IDs are in the favIds array
    const items = await prisma.item.findMany({
      where: {
        id: { in: favIds },
      },
      include: { seller: true, category: true, breed: true },
    });

    if (items.length === 0) {
      return res
        .status(404)
        .json({ message: "No items found for the given IDs" });
    }

    // Group items by seller
    const groupedBySeller = items.reduce((acc, item) => {
      const sellerId = item.seller.id;
      if (!acc[sellerId]) {
        acc[sellerId] = { seller: item.seller, items: [] };
      }
      acc[sellerId].items.push(item);
      return acc;
    }, {});
    const groupedItemsArray = Object.values(groupedBySeller);
    return res.status(200).json({ groupedItemsArray });
  } catch (error) {
    console.error("Error fetching favorite items:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
