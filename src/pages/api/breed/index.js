import prisma from "@/lib/prisma";

export default async function handler(req, res) {
  const { method } = req;

  switch (method) {
    case "POST":
      return handlePost(req, res);
    case "GET":
      return handleGet(req, res);
    default:
      res.setHeader("Allow", ["POST", "GET"]);
      return res.status(405).json({ message: `Method ${method} Not Allowed` });
  }
}

async function handleGet(req, res) {
  try {
    const breeds = await prisma.breed.findMany();
    return res.status(200).json({ breeds });
  } catch (error) {
    console.error("Error fetching breeds:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

async function handlePost(req, res) {
  try {
    // Check if a breed with the given name already exists.
    const { name } = req.body;

    // Validate input
    if (!name?.trim()) {
      return res.status(400).json({ message: "Breed name is required" });
    }

    const trimmedName = name.trim();

    // Check for duplicate name (case-insensitive)
    const existingBreed = await prisma.breed.findFirst({
      where: { name: { equals: trimmedName, mode: "insensitive" } },
    });

    if (existingBreed) {
      return res.status(409).json({
        message: `Breed '${trimmedName}' already exists`,
        data: existingBreed,
      });
    }

    // If not, create the new breed.
    const newBreed = await prisma.breed.create({
      data: { name: trimmedName },
    });

    return res.status(201).json({
      message: "Breed created successfully",
      data: newBreed,
    });
  } catch (error) {
    console.error("Error adding breed:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
