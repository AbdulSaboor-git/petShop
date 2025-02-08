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
      return res.status(405).end(`Method ${method} Not Allowed`);
  }
}

// Handle GET request
async function handleGet(req, res, breedId) {
  try {
    const id = parseInt(breedId, 10);
    if (isNaN(id) || id <= 0) {
      return res.status(400).json({ message: "Invalid Breed ID" });
    }

    const breed = await prisma.breed.findUnique({
      where: { id },
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

// Handle PATCH request
async function handlePatch(req, res, breedId) {
  try {
    const id = parseInt(breedId, 10);
    if (isNaN(id) || id <= 0) {
      return res.status(400).json({ message: "Invalid breed ID" });
    }

    const existingbreed = await prisma.breed.findUnique({
      where: { id },
    });
    if (!existingbreed) {
      return res.status(404).json({ message: "Breed not found" });
    }

    const { name } = req.body;
    const existingBreedName = await prisma.breed.findUnique({
      where: { name: name.trim() },
    });

    if (existingBreedName) {
      return res.status(409).json({
        message: `Breed ${name.trim()} already exists`,
        breed: existingBreedName,
      });
    }
    if (!name) {
      return res.status(400).json({ message: "No update data provided." });
    }

    const updatedbreed = await prisma.breed.update({
      where: { id },
      data: {
        ...(name && { name: name.trim() }),
      },
    });

    return res.status(200).json(updatedbreed);
  } catch (error) {
    console.error("Error updating breed:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

// Handle DELETE request
async function handleDelete(req, res, breedId) {
  try {
    const id = parseInt(breedId, 10);
    if (isNaN(id) || id <= 0) {
      return res.status(400).json({ message: "Invalid breed ID" });
    }

    const existingbreed = await prisma.breed.findUnique({
      where: { id },
    });
    if (!existingbreed) {
      return res.status(404).json({ message: "Breed not found" });
    }

    await prisma.breed.delete({ where: { id } });

    return res.status(200).json({ message: "Breed deleted successfully" });
  } catch (error) {
    console.error("Error deleting breed:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
