import prisma from "@/lib/prisma";

export default async function handler(req, res) {
  const { method } = req;
  const { category, breed, sex, itemId } = req.query;

  if (method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ message: `Method ${method} Not Allowed` });
  }

  return handleGet(req, res, category, breed, sex, itemId);
}

const shuffleArray = (array) => {
  return array
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
};

const handleGet = async (req, res, category, breed, sex, itemId) => {
  const categoryId = parseInt(category, 10);
  const breedId = breed ? parseInt(breed, 10) : null;
  const currentItemId = parseInt(itemId, 10);
  const oppositeSex =
    sex && (sex === "Male" ? "Female" : sex === "Female" ? "Male" : null);

  if (
    isNaN(categoryId) ||
    categoryId <= 0 ||
    isNaN(currentItemId) ||
    currentItemId <= 0
  ) {
    return res.status(400).json({ message: "Invalid category ID or item ID" });
  }

  try {
    const relatedRaw = await prisma.item.findMany({
      where: {
        categoryId,
        breedId: breedId ? breedId : undefined,
        id: { not: currentItemId },
        availability: "AVAILABLE",
        sex,
      },
      select: {
        id: true,
        name: true,
        price: true,
        images: true,
        availability: true,
        sex: true,
      },
    });

    const relatedItems = shuffleArray(relatedRaw).slice(0, 4); // Shuffle and pick 4

    const boughtTogetherRaw =
      sex && oppositeSex
        ? await prisma.item.findMany({
            where: {
              categoryId,
              breedId: breedId ? breedId : undefined,
              sex: oppositeSex,
              id: { not: currentItemId },
              availability: "AVAILABLE",
              NOT: { sex: null },
            },
            select: {
              id: true,
              name: true,
              price: true,
              images: true,
              availability: true,
              sex: true,
            },
          })
        : [];

    const boughtTogetherItems = shuffleArray(boughtTogetherRaw).slice(0, 2);

    return res.status(200).json({ relatedItems, boughtTogetherItems });
  } catch (error) {
    console.error("Error fetching related items:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
