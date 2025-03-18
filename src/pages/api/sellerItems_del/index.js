import prisma from "@/lib/prisma";

export default async function handler(req, res) {
  const { method } = req;
  const { sellerId } = req.query; // Destructure sellerId from query

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
      where: { sellerId: id },
      include: { seller: true, category: true, breed: true },
      orderBy: { name: "asc" },
    });

    return res.status(200).json({ items });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
