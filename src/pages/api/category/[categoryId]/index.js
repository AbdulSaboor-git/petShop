import prisma from "@/lib/prisma";

export default async function handler(req, res) {
  const { method } = req;
  const categoryId = parseInt(req.query.categoryId, 10);

  if (isNaN(categoryId) || categoryId <= 0) {
    return res.status(400).json({ message: "Invalid Category ID" });
  }
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
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
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
    const { name } = req.body;
    if (!name?.trim()) {
      return res.status(400).json({ message: "Category name is required" });
    }

    const trimmedName = name.trim();

    // Check if category exists
    const existingCategory = await prisma.category.findUnique({
      where: { id },
    });
    if (!existingCategory) {
      return res.status(404).json({ message: "Category not found" });
    }

    if (existingCategory.name.toLowerCase() === trimmedName.toLowerCase()) {
      return res.status(404).json({
        message: "No changes made",
        data: existingCategory,
      });
    }

    // Check if the new name already exists (case insensitive)
    const duplicateCategory = await prisma.category.findFirst({
      where: { name: { equals: trimmedName, mode: "insensitive" } },
    });

    if (duplicateCategory && duplicateCategory.id !== id) {
      return res.status(409).json({
        message: `Category '${trimmedName}' already exists.`,
        category: duplicateCategory,
      });
    }

    // Update the category
    const updatedCategory = await prisma.category.update({
      where: { id },
      data: { name: trimmedName },
    });

    return res.status(200).json(updatedCategory);
  } catch (error) {
    console.error("Error updating category:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

async function handleDelete(req, res, categoryId) {
  try {
    // Check if category exists and has items
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
      include: { items: { select: { id: true } } },
    });

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Prevent deletion if category has items.
    if (category.items.length > 0) {
      return res
        .status(400)
        .json({ message: "Cannot delete category with items" });
    }

    await prisma.category.delete({ where: { id: categoryId } });

    return res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error("Error deleting category:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
