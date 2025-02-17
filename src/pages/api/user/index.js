import prisma from "@/lib/prisma";

export default async function handler(req, res) {
  const { method } = req;
  // Expect userId for GET (single user), PATCH, and DELETE.
  const { userId } = req.query;

  switch (method) {
    case "GET":
      return handleGet(req, res, userId);
    case "POST":
      return handlePost(req, res);
    case "PATCH":
      return handlePatch(req, res, userId);
    case "DELETE":
      return handleDelete(req, res, userId);
    default:
      res.setHeader("Allow", ["GET", "POST", "PATCH", "DELETE"]);
      return res.status(405).end(`Method ${method} Not Allowed`);
  }
}

// GET: If userId is provided, fetch a single user. Otherwise, fetch all.
async function handleGet(req, res, userId) {
  try {
    if (userId) {
      const id = parseInt(userId, 10);
      if (isNaN(id) || id <= 0) {
        return res.status(400).json({ message: "Invalid User ID" });
      }
      const user = await prisma.user.findUnique({
        where: { id },
        include: { items: true },
      });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      return res.status(200).json(user);
    } else {
      const users = await prisma.user.findMany();
      return res.status(200).json({ users });
    }
  } catch (error) {
    console.error("Error fetching product(s):", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

// POST: Create a new user.
async function handlePost(req, res) {
  try {
    const {
      firstName,
      lastName,
      email,
      phoneNo,
      password,
      role,
      isActive,
      profilePicture,
    } = req.body;

    // Basic validation: required fields.
    if (!firstName || !email || !phoneNo || !password) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    const newUser = await prisma.user.create({
      data: {
        firstName: firstName,
        lastName: lastName ? lastName : null,
        email: email,
        phoneNo: phoneNo,
        password: password,
        role: role ? role : null,
        profilePicture: profilePicture,
        isActive: isActive,
      },
    });

    return res.status(201).json(newUser);
  } catch (error) {
    console.error("Error creating product:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

// PATCH: Update an existing user.
async function handlePatch(req, res, userId) {
  try {
    const id = parseInt(userId, 10);
    if (isNaN(id) || id <= 0) {
      return res.status(400).json({ message: "Invalid User ID" });
    }

    const existingUser = await prisma.user.findUnique({
      where: { id },
    });
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const {
      firstName,
      lastName,
      email,
      phoneNo,
      password,
      role,
      isActive,
      profilePicture,
    } = req.body;

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        ...(firstName && { firstName: firstName }),
        ...(lastName ? { lastName: lastName } : { lastName: null }),
        ...(email && { email: email }),
        ...(phoneNo && { phoneNo: phoneNo }),
        ...(password && { password: password }),
        ...(role ? { role: role } : { role: null }),
        isActive: isActive,
        ...(profilePicture
          ? { profilePicture: profilePicture }
          : { profilePicture: null }),
      },
    });

    return res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error updating product:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

// DELETE: Delete a user
async function handleDelete(req, res, userId) {
  try {
    const id = parseInt(userId, 10);
    if (isNaN(id) || id <= 0) {
      return res.status(400).json({ message: "Invalid User ID" });
    }

    const existingUser = await prisma.user.findUnique({
      where: { id },
    });
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    await prisma.user.delete({ where: { id } });
    return res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
