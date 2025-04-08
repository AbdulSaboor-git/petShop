import prisma from "@/lib/prisma";

export default async function handler(req, res) {
  const { method } = req;
  const { productId } = req.query;

  switch (method) {
    case "GET":
      return handleGet(req, res, productId);

    default:
      res.setHeader("Allow", ["GET"]);
      return res.status(405).end(`Method ${method} Not Allowed`);
  }
}

async function handleGet(req, res, productId) {
  try {
    const id = parseInt(productId, 10);
    if (isNaN(id) || id <= 0) {
      return res.status(400).json({ message: "Invalid Product ID" });
    }

    const product = await prisma.item.findUnique({
      where: { id },
      select: {
        name: true,
        images: true,
        sellerId: true,
      },
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.status(200).json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    return res.status(500).json("Internal Server Error");
  }
}
