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
    const items = await prisma.item.findMany({
      where: { availability: "AVAILABLE" },
      include: { seller: true, category: true, breed: true },
    });

    if (items.length === 0) {
      return res.status(404).json({ message: "No available items found" });
    }

    return res.status(200).json({ items });
  } catch (error) {
    console.error("Error fetching available items:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
