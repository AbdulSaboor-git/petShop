import prisma from "@/lib/prisma";

export default async function handler(req, res) {
  const { method } = req;
  const { itemId, categ } = req.query;

  switch (method) {
    case "GET":
      return handleGet(req, res, itemId, categ);
    default:
      res.setHeader("Allow", ["GET"]);
      return res.status(405).end(`Method ${method} Not Allowed`);
  }
}

const handleGet = async (req, res, itemId, categ) => {
  const ItemId = parseInt(itemId, 10);
  const categId = parseInt(categ, 10);

  try {
    const items = await prisma.item.findMany({
      where: {
        categoryId: categId,
        availability: "AVAILABLE",
        id: { not: ItemId },
      },
      orderBy: { name: "asc" },
      take: 4,
    });

    return res.status(200).json({ items });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
