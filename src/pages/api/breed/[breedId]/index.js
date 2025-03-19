import prisma from "@/lib/prisma";

export default async function handler(req, res) {
  const { method } = req;
  const { breedId } = req.query;
  switch (method) {
    case "GET":
      return handleGet(req, res, breedId);
    case "PATCH":
      return handlePatch(req, res, breedId);
    case "DELETE":
      return handleDelete(req, res, breedId);
    default:
      res.setHeader("Allow", ["GET", "PATCH", "DELETE"]);
      return res.status(405).json({ message: `Method ${method} Not Allowed` });
  }
}

async function handleGet(req, res, breedId) {
  try {
    const id = parseInt(breedId, 10);
    if (isNaN(id) || id <= 0) {
      return res.status(400).json({ message: "Invalid Breed ID" });
    }

    const breed = await prisma.breed.findUnique({
      where: { id },
      include: { items: true },
    });

    if (!breed) {
      return res.status(404).json({ message: "Breed not found" });
    }
    return res.status(200).json(breed);
  } catch (error) {
    console.error("Error fetching breed:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

async function handlePatch(req, res, breedId) {
  try {
    const id = parseInt(breedId, 10);
    if (isNaN(id) || id <= 0) {
      return res.status(400).json({ message: "Invalid Breed ID" });
    }

    const existingBreed = await prisma.breed.findUnique({ where: { id } });
    if (!existingBreed) {
      return res.status(404).json({ message: "Breed not found" });
    }

    const { name } = req.body;
    if (!name?.trim()) {
      return res.status(400).json({ message: "Breed name cannot be empty" });
    }

    const trimmedName = name.trim();

    // Check if the name already exists (case-insensitive)
    const duplicateBreed = await prisma.breed.findFirst({
      where: { name: { equals: trimmedName, mode: "insensitive" } },
    });

    if (duplicateBreed && duplicateBreed.id !== id) {
      return res.status(409).json({
        message: `Breed '${trimmedName}' already exists`,
        data: duplicateBreed,
      });
    }

    // Prevent unnecessary update if name is unchanged
    if (trimmedName === existingBreed.name) {
      return res.status(404).json({
        message: "No changes made",
        data: existingBreed,
      });
    }
    const updatedBreed = await prisma.breed.update({
      where: { id },
      data: { name: trimmedName },
    });

    return res.status(200).json(updatedBreed);
  } catch (error) {
    console.error("Error updating breed:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

async function handleDelete(req, res, breedId) {
  try {
    const id = parseInt(breedId, 10);
    if (isNaN(id) || id <= 0) {
      return res.status(400).json({ message: "Invalid Breed ID" });
    }

    // Fetch the breed along with its associated items.
    const existingBreed = await prisma.breed.findUnique({
      where: { id },
      include: { items: true },
    });
    if (!existingBreed) {
      return res.status(404).json({ message: "Breed not found" });
    }

    // Prevent deletion if breed has items.
    if (existingBreed.items.length > 0) {
      return res
        .status(400)
        .json({ message: "Cannot delete breed  with associated items" });
    }

    await prisma.breed.delete({ where: { id } });

    return res.status(200).json({ message: "Breed deleted successfully" });
  } catch (error) {
    console.error("Error deleting breed:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
