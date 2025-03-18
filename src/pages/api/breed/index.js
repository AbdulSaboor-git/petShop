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
    const existingBreed = await prisma.breed.findUnique({
      where: { name: trimmedName },
    });

    if (existingBreed) {
      return res.status(409).json({
        message: `Breed ${trimmedName} already exists`,
        breed: existingBreed,
      });
    }

    // If not, create the new breed.
    const newBreed = await prisma.breed.create({
      data: {
        name: trimmedName,
      },
    });
    return res.status(201).json(newBreed);
  } catch (error) {
    console.error("Error adding breed:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
