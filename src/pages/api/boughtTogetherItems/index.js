import prisma from "@/lib/prisma";

export default async function handler(req, res) {
  const { method } = req;
  const { categ, breed, gender } = req.query;

  switch (method) {
    case "GET":
      return handleGet(req, res, categ, breed, gender);
    default:
      res.setHeader("Allow", ["GET"]);
      return res.status(405).json({ message: `Method ${method} Not Allowed` });
  }
}

const handleGet = async (req, res, categ, breed, gender) => {
  try {
    // Parse category and breed IDs
    const categoryId = categ ? parseInt(categ, 10) : undefined;
    const breedId = breed ? parseInt(breed, 10) : undefined;

    if ((categ && isNaN(categoryId)) || (breed && isNaN(breedId))) {
      return res.status(400).json({ message: "Invalid category or breed ID" });
    }

    // Build dynamic filter object
    let filters = { availability: "AVAILABLE" };
    if (categoryId) filters.categoryId = categoryId;
    if (breedId) filters.breedId = breedId;
    if (gender) filters.sex = { not: gender };

    const items = await prisma.item.findMany({
      where: filters,
      orderBy: { name: "asc" },
      take: 2,
    });

    if (items.length === 0) {
      return res.status(404).json({ message: "No matching items found" });
    }

    return res.status(200).json({ items });
  } catch (error) {
    console.error("Error fetching items:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
