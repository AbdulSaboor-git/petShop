import prisma from "@/lib/prisma";

export default async function handler(req, res) {
  // ✅ Set CORS headers to allow cross-origin requests
  res.setHeader("Access-Control-Allow-Origin", "*"); // Change '*' to specific domain if needed
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // ✅ Handle OPTIONS preflight request
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res
      .status(405)
      .json({ message: `Method ${req.method} Not Allowed` });
  }

  try {
    // ✅ Prevent caching to always fetch fresh data
    res.setHeader(
      "Cache-Control",
      "no-store, no-cache, must-revalidate, proxy-revalidate"
    );

    const categories = await prisma.category.findMany({
      include: { items: true },
      orderBy: { name: "asc" },
    });

    const breeds = await prisma.breed.findMany({
      include: { items: true },
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
