import prisma from "@/lib/prisma";

export default async function handler(req, res) {
  const { method } = req;
  const { itemId, categ, sex } = req.query;

  switch (method) {
    case "GET":
      return handleGet(req, res, itemId, categ, sex);
    default:
      res.setHeader("Allow", ["GET"]);
      return res.status(405).end(`Method ${method} Not Allowed`);
  }
}

const handleGet = async (req, res, itemId, categ, sex) => {
  const ItemId = parseInt(itemId, 10);
  const categId = parseInt(categ, 10);

  try {
    const items = await prisma.item.findMany({
      where: {
        categoryId: categId,
        id: { not: ItemId },
        sex: sex,
        availability: "AVAILABLE",
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
