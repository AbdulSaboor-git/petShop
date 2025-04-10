import prisma from "@/lib/prisma";

export default async function handler(req, res) {
  const { method } = req;
  const { productId } = req.query;

  switch (method) {
    case "GET":
      return handleGet(req, res, productId);
    case "POST":
      return handlePost(req, res);
    case "PATCH":
      return handlePatch(req, res, productId);
    case "DELETE":
      return handleDelete(req, res, productId);
    default:
      res.setHeader("Allow", ["GET", "POST", "PATCH", "DELETE"]);
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
      include: { seller: true, category: true, breed: true },
    });

    if (!product) {
      return res.status(404).json("Product not found");
    }

    return res.status(200).json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    return res.status(500).json("Internal Server Error");
  }
}

// POST: Create a new product.
async function handlePost(req, res) {
  try {
    const {
      name,
      price,
      // discountedPrice,
      description,
      categoryId,
      breedId,
      sex,
      isfeatured,
      nature,
      specifications,
      weight,
      height,
      age,
      availability,
      images,
      sellerId,
    } = req.body;

    // Basic validation: required fields.
    if (!name || !price || !categoryId || !sellerId) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    const newProduct = await prisma.item.create({
      data: {
        name: name.trim(),
        price: Number(price),
        discountedPrice: null,
        description: description ? description.trim() : null,
        category: { connect: { id: Number(categoryId) } },
        breed: breedId ? { connect: { id: Number(breedId) } } : undefined,
        sex: sex ? sex.trim() : null,
        isfeatured: isfeatured,
        nature: nature ? nature.trim() : null,
        specifications: specifications ? specifications.trim() : null,
        weight: weight ? Number(weight) : null,
        height: height ? Number(height) : null,
        age: age ? Number(age) : null,
        availability: availability || "AVAILABLE",
        images: images, // Expect images as an array of strings (URLs)
        seller: { connect: { id: Number(sellerId) } }, // ✅ Fix
        isDiscounted: false,
      },
    });

    return res.status(201).json(newProduct);
  } catch (error) {
    console.error("Error creating product:", error);
    return res.status(500).json({
      error: `Internal Server Error + ${error.message}`,
      message: error.message,
    });
  }
}

// PATCH: Update an existing product.
async function handlePatch(req, res, productId) {
  try {
    const id = parseInt(productId, 10);
    if (isNaN(id) || id <= 0) {
      return res.status(400).json({ message: "Invalid Product ID" });
    }

    const existingProduct = await prisma.item.findUnique({
      where: { id },
    });
    if (!existingProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    const {
      name,
      price,
      // discountedPrice,
      description,
      categoryId,
      breedId,
      sex,
      isfeatured,
      nature,
      specifications,
      weight,
      height,
      age,
      availability,
      images,
    } = req.body;

    const updatedProduct = await prisma.item.update({
      where: { id },
      data: {
        ...(name && { name: name.trim() }),
        ...(price && { price: Number(price) }),
        // ...(discountedPrice !== ""
        //   ? {
        //       discountedPrice: Number(discountedPrice),
        //     }
        //   : { discountedPrice: null }),
        ...(description
          ? { description: description.trim() }
          : { description: null }),
        ...(categoryId && { categoryId: Number(categoryId) }),
        ...(breedId !== undefined && {
          breedId: breedId ? Number(breedId) : null,
        }),
        ...(sex ? { sex: sex.trim() } : { sex: null }),
        isfeatured: isfeatured,
        ...(nature ? { nature: nature.trim() } : { nature: null }),
        ...(specifications
          ? { specifications: specifications.trim() }
          : { specifications: null }),
        ...(weight ? { weight: Number(weight) } : { weight: null }),
        ...(height ? { height: Number(height) } : { height: null }),
        ...(age ? { age: Number(age) } : { age: null }),
        ...(availability && { availability }),
        ...(images && { images }),
        // isDiscounted:
        //   discountedPrice != "" && Number(discountedPrice) < Number(price),
      },
    });

    return res.status(200).json(updatedProduct);
  } catch (error) {
    console.error("Error updating product:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

// DELETE: Delete a product.
async function handleDelete(req, res, productId) {
  try {
    const id = parseInt(productId, 10);
    if (isNaN(id) || id <= 0) {
      return res.status(400).json({ message: "Invalid Product ID" });
    }

    const existingProduct = await prisma.item.findUnique({
      where: { id },
    });
    if (!existingProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    await prisma.item.delete({ where: { id } });
    return res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
