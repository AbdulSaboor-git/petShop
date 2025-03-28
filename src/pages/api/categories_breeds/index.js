import prisma from "@/lib/prisma";

export default async function handler(req, res) {
  const { method } = req;

  switch (method) {
    case "GET":
      return handleGet(req, res);
    default:
      res.setHeader("Allow", ["GET"]);
      return res.status(405).end(`Method ${method} Not Allowed`);
  }
}

const handleGet = async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      select: {
        id: true,
        name: true,
        _count: {
          select: { items: true },
        },
      },
      orderBy: { name: "asc" },
    });
    const breeds = await prisma.breed.findMany({
      select: {
        id: true,
        name: true,
        _count: {
          select: { items: true },
        },
      },
      orderBy: { name: "asc" },
    });

    return res.status(200).json({ categories, breeds });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
