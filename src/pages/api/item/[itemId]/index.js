import prisma from "@/lib/prisma";

export default async function handler(req, res) {
  const { method } = req;
  const { itemId } = req.query; // Extract itemId from query parameters

  switch (method) {
    case "GET":
      return handleGet(req, res, itemId);
    case "POST":
      return handlePost(req, res);
    case "PATCH":
      return handlePatch(req, res, itemId);
    case "DELETE":
      return handleDelete(req, res, itemId);
    default:
      res.setHeader("Allow", ["GET", "POST", "PATCH", "DELETE"]);
      return res.status(405).end(`Method ${method} Not Allowed`);
  }
}

// Handle GET request
async function handleGet(req, res, itemId) {
  try {
    const id = parseInt(itemId, 10);
    if (isNaN(id) || id <= 0) {
      return res.status(400).json({ message: "Invalid Item ID" });
    }

    const item = await prisma.item.findUnique({
      where: { id },
      include: { seller: true }, // Include related seller data
    });

    if (!item) {
      return res.status(404).json({ message: "Itejm not found" });
    }
    res.setHeader("Cache-Control", "no-store, max-age=0");
    return res.status(200).json(item);
  } catch (error) {
    console.error("Error fetching item:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

// Handle POST request
async function handlePost(req, res) {
  const {
    name,
    breed,
    category,
    images,
    pricedescription,
    discountedPrice,
    isDiscounted,
    weight,
    height,
    age,
    sex,
    nature,
    specifications,
    availability,
    sellerId,
  } = req.body;

  try {
    const newItem = await prisma.item.create({
      data: {
        name,
        breed,
        category,
        images,
        pricedescription,
        discountedPrice,
        isDiscounted,
        weight,
        height,
        age,
        sex,
        nature,
        specifications,
        availability,
        sellerId,
      },
    });
    res.status(201).json(newItem);
  } catch (error) {
    console.error("Error creating item:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// Handle PATCH request
async function handlePatch(req, res, itemId) {
  try {
    const id = parseInt(itemId, 10);
    if (isNaN(id) || id <= 0) {
      return res.status(400).json({ message: "Invalid Item ID" });
    }

    const existingItem = await prisma.item.findUnique({ where: { id } });
    if (!existingItem) {
      return res.status(404).json({ message: "Item not found" });
    }

    const {
      name,
      breed,
      category,
      images,
      pricedescription,
      discountedPrice,
      isDiscounted,
      weight,
      height,
      age,
      sex,
      nature,
      specifications,
      availability,
      sellerId,
    } = req.body;

    const updatedItem = await prisma.item.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(breed && { breed }),
        ...(category && { category }),
        ...(images && { images }),
        ...(pricedescription && { pricedescription }),
        ...(discountedPrice && { discountedPrice }),
        ...(isDiscounted !== undefined && { isDiscounted }),
        ...(weight && { weight }),
        ...(height && { height }),
        ...(age && { age }),
        ...(sex && { sex }),
        ...(nature && { nature }),
        ...(specifications && { specifications }),
        ...(availability !== undefined && { availability }),
        ...(sellerId && { sellerId }),
      },
    });

    return res.status(200).json(updatedItem);
  } catch (error) {
    console.error("Error updating item:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

// Handle DELETE request
async function handleDelete(req, res, itemId) {
  try {
    const id = parseInt(itemId, 10);
    if (isNaN(id) || id <= 0) {
      return res.status(400).json({ message: "Invalid Item ID" });
    }

    const existingItem = await prisma.item.findUnique({ where: { id } });
    if (!existingItem) {
      return res.status(404).json({ message: "Item not found" });
    }

    await prisma.item.delete({ where: { id } });

    return res.status(200).json({ message: "Item deleted successfully" });
  } catch (error) {
    console.error("Error deleting item:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
