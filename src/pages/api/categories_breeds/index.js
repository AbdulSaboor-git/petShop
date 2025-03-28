import prisma from "@/lib/prisma";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res
      .status(405)
      .json({ message: `Method ${req.method} Not Allowed` });
  }

  try {
    res.setHeader(
      "Cache-Control",
      "no-store, no-cache, must-revalidate, proxy-revalidate"
    );

    const categories = await prisma.category.findMany({
      select: {
        id: true,
        name: true,
        _count: { select: { items: true } }, // ✅ Get item count instead of full items
      },
      orderBy: { name: "asc" },
    });

    const breeds = await prisma.breed.findMany({
      select: {
        id: true,
        name: true,
        _count: { select: { items: true } }, // ✅ Get item count instead of full items
      },
      orderBy: { name: "asc" },
    });

    return res.status(200).json({ categories, breeds });
  } catch (error) {
    console.error("Error fetching categories and breeds:", error);
    return res
      .status(500)
      .json({ message: "Failed to fetch data. Please try again later." });
  }
}
