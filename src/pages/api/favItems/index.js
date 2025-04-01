import prisma from "@/lib/prisma";
import { availability } from "@prisma/client";

export default async function handler(req, res) {
  const { method } = req;

  switch (method) {
    case "GET":
      return handleGet(req, res);
    default:
      res.setHeader("Allow", ["GET"]);
      return res.status(405).end(`Method ${method} Not Allowed`);
  }
}

const handleGet = async (req, res) => {
  try {
    // Expecting a query parameter: /api/favItems?ids=1,2,3
    const { ids } = req.query;
    if (!ids) {
      return res.status(400).json({ message: "Missing ids query parameter" });
    }

    // Parse the comma-separated ids into an array.
    // Adjust parseInt as needed (or use Number) depending on your ID type.
    const favIds = ids.split(",").map((id) => parseInt(id, 10));

    // Fetch items whose IDs are in the favIds array
    const items = await prisma.item.findMany({
      select: {
        id: true,
        name: true,
        breedId: true,
        breed: { select: { id: true, name: true } },
        seller: { select: { id: true, firstName: true, lastName: true } },
        price: true,
        discountedPrice: true,
        isDiscounted: true,
        images: true,
        availability: true,
      },
      where: {
        id: { in: favIds },
      },
    });

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
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
