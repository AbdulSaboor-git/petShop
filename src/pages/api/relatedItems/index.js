import prisma from "@/lib/prisma";

export default async function handler(req, res) {
  const { method } = req;
  const { itemId, categ, sex } = req.query;

  switch (method) {
    case "GET":
      return handleGet(req, res, itemId, categ, sex);
    default:
      res.setHeader("Allow", ["GET"]);
      return res.status(405).json({ message: `Method ${method} Not Allowed` });
  }
}

const handleGet = async (req, res, itemId, categ, sex) => {
  try {
    // Validate input parameters
    const ItemId = parseInt(itemId, 10);
    const categId = parseInt(categ, 10);

    if (isNaN(ItemId) || ItemId <= 0) {
      return res.status(400).json({ message: "Invalid itemId parameter" });
    }
    if (isNaN(categId) || categId <= 0) {
      return res.status(400).json({ message: "Invalid category ID" });
    }
    if (sex && typeof sex !== "string") {
      return res.status(400).json({ message: "Invalid sex parameter" });
    }

    // Fetch related items
    const items = await prisma.item.findMany({
      where: {
        categoryId: categId,
        id: { not: ItemId },
        sex: sex || undefined,
        availability: "AVAILABLE",
      },
      orderBy: { name: "asc" },
      take: 4,
    });

    return res
      .status(200)
      .json({ items, message: "Related items fetched successfully" });
  } catch (error) {
    console.error("Error fetching related items:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
