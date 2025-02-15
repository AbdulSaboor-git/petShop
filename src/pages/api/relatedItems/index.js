import prisma from "@/lib/prisma";

export default async function handler(req, res) {
  const { method } = req;
  const { categ, breed } = req.id;

  switch (method) {
    case "GET":
      if (breed == null) return handleGet2(req, res, categ);
      else return handleGet(req, res, categ, breed);
    default:
      res.setHeader("Allow", ["GET"]);
      return res.status(405).end(`Method ${method} Not Allowed`);
  }
}

const handleGet = async (req, res, categ, breed) => {
  res.setHeader("Cache-Control", "no-store");
  try {
    const items = await prisma.item.findMany({
      where: { categoryId: categ, breedId: breed },
      include: { seller: true, category: true, breed: true },
      orderBy: { name: "asc" },
    });

    return res.status(200).json({ items });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const handleGet2 = async (req, res, categ) => {
  res.setHeader("Cache-Control", "no-store");
  try {
    const items = await prisma.item.findMany({
      where: { categoryId: categ, breedId: breed },
      include: { seller: true, category: true, breed: true },
      orderBy: { name: "asc" },
    });

    return res.status(200).json({ items });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
