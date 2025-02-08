import prisma from "@/lib/prisma";

export default async function handler(req, res) {
  const { method } = req;
  const { categoryId } = req.query;

  switch (method) {
    case "GET":
      return handleGet(req, res, categoryId);
    case "PATCH":
      return handlePatch(req, res, categoryId);
    case "DELETE":
      return handleDelete(req, res, categoryId);
    default:
      res.setHeader("Allow", ["GET", "PATCH", "DELETE"]);
      return res.status(405).end(`Method ${method} Not Allowed`);
  }
}

async function handleGet(req, res, categoryId) {
  try {
    const id = parseInt(categoryId, 10);
    if (isNaN(id) || id <= 0) {
      return res.status(400).json({ message: "Invalid Category ID" });
    }

    const category = await prisma.category.findUnique({
      where: { id },
      include: { items: true },
    });

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    return res.status(200).json(category);
  } catch (error) {
    console.error("Error fetching category:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

async function handlePatch(req, res, categoryId) {
  try {
    const id = parseInt(categoryId, 10);
    if (isNaN(id) || id <= 0) {
      return res.status(400).json({ message: "Invalid Category ID" });
    }

    const existingCategory = await prisma.category.findUnique({
      where: { id },
    });
    if (!existingCategory) {
      return res.status(404).json({ message: "Category not found" });
    }

    const { name } = req.body;

    const updatedCategory = await prisma.category.update({
      where: { id },
      data: {
        ...(name && { name: name.trim() }),
      },
    });

    return res.status(200).json(updatedCategory);
  } catch (error) {
    console.error("Error updating category:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

async function handleDelete(req, res, categoryId) {
  try {
    const id = parseInt(categoryId, 10);
    if (isNaN(id) || id <= 0) {
      return res.status(400).json({ message: "Invalid Category ID" });
    }

    // Fetch the category along with its associated items.
    const existingCategory = await prisma.category.findUnique({
      where: { id },
      include: { items: true },
    });
    if (!existingCategory) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Prevent deletion if category has items.
    if (existingCategory.items && existingCategory.items.length > 0) {
      return res
        .status(400)
        .json({ message: "Cannot delete category that has items." });
    }

    await prisma.category.delete({ where: { id } });

    return res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error("Error deleting category:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
