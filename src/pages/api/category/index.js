import prisma from "@/lib/prisma";

export default async function handler(req, res) {
  const { method } = req;

  switch (method) {
    case "POST":
      return handlePost(req, res);
    case "GET":
      return handleGet(req, res);
    default:
      res.setHeader("Allow", ["GET", "POST"]);
      return res.status(405).end(`Method ${method} Not Allowed`);
  }
}

async function handleGet(req, res) {
  try {
    const categories = await prisma.category.findMany();
    return res.status(200).json({ categories });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

async function handlePost(req, res) {
  try {
    // Check if a breed with the given name already exists.
    let { name } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ message: "Category name is required" });
    }

    const trimmedName = name.trim();

    // Check if a category with the same name already exists (case insensitive)
    const existingCategory = await prisma.category.findFirst({
      where: { name: { equals: trimmedName, mode: "insensitive" } },
    });

    if (existingCategory) {
      return res.status(409).json({
        message: `Category '${trimmedName}' already exists.`,
        category: existingCategory,
      });
    }

    // If not, create the new category.
    const newCategory = await prisma.category.create({
      data: { name: trimmedName },
    });
    return res.status(201).json(newCategory);
  } catch (error) {
    console.error("Error adding category:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
