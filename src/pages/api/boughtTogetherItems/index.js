import prisma from "@/lib/prisma";

export default async function handler(req, res) {
  const { method } = req;
  const { categ, breed, sex } = req.query;

  switch (method) {
    case "GET":
      return handleGet(req, res, categ, breed, sex);
    default:
      res.setHeader("Allow", ["GET"]);
      return res.status(405).end(`Method ${method} Not Allowed`);
  }
}

const handleGet = async (req, res, categ, breed, sex) => {
  const categId = parseInt(categ, 10);
  const BreedId = parseInt(breed, 10);
  try {
    const items = await prisma.item.findMany({
      where: {
        categoryId: categId,
        breedId: BreedId,
        sex: sex,
        availability: "AVAILABLE",
      },
      orderBy: { name: "asc" },
      take: 2,
    });

    return res.status(200).json({ items });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
