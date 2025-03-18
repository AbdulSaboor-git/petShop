import prisma from "@/lib/prisma";

export default async function handler(req, res) {
  const { method } = req;

  switch (method) {
    case "POST":
      return handlePost(req, res);
    default:
      res.setHeader("Allow", ["POST"]);
      return res.status(405).end(`Method ${method} Not Allowed`);
  }
}

async function handlePost(req, res) {
  const { name } = req.body;
  const trimmedName = name.trim();

  try {
    // Check if a breed with the given name already exists.
    const existingCategory = await prisma.category.findUnique({
      where: { name: trimmedName },
    });

    if (existingCategory) {
      return res.status(409).json({
        message: `Category ${trimmedName} already exists`,
        category: existingCategory,
      });
    }

    // If not, create the new breed.
    const newCategory = await prisma.category.create({
      data: {
        name: trimmedName,
      },
    });
    return res.status(201).json(newCategory);
  } catch (error) {
    console.error("Error adding category:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
