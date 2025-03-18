import prisma from "@/lib/prisma";

export default async function handler(req, res) {
  const { method } = req;
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
      return res.status(405).json({ message: `Method ${method} Not Allowed` });
  }
}

// GET: Fetch single user or all users
async function handleGet(req, res, userId) {
  try {
    if (userId) {
      const id = parseInt(userId, 10);
      if (!id || id <= 0)
        return res.status(400).json({ message: "Invalid User ID" });

      const user = await prisma.user.findUnique({
        where: { id },
        include: { items: true },
      });
      return user
        ? res.status(200).json(user)
        : res.status(404).json({ message: "User not found" });
    } else {
      const users = await prisma.user.findMany();
      return res.status(200).json({ users });
    }
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

// POST: Create a new user
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

    if (!firstName || !email || !phoneNo || !password) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    const newUser = await prisma.user.create({
      data: {
        firstName,
        lastName: lastName || null,
        email,
        phoneNo,
        password, // Storing raw password as requested
        role: role || null,
        profilePicture,
        isActive,
      },
    });

    return res
      .status(201)
      .json({ message: "User created successfully", userId: newUser.id });
  } catch (error) {
    console.error("Error creating user:", error);

    if (error.code === "P2002" && error.meta?.target.includes("email")) {
      return res
        .status(400)
        .json({
          message: "Email already registered. Please use a different email.",
        });
    }

    return res.status(500).json({ message: "Internal Server Error" });
  }
}

// PATCH: Update an existing user
async function handlePatch(req, res, userId) {
  try {
    const id = parseInt(userId, 10);
    if (!id || id <= 0)
      return res.status(400).json({ message: "Invalid User ID" });

    const existingUser = await prisma.user.findUnique({ where: { id } });
    if (!existingUser)
      return res.status(404).json({ message: "User not found" });

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

    const updatedData = {
      firstName,
      lastName: lastName ?? null,
      email,
      phoneNo,
      password, // No hashing, updating raw password
      role: role ?? null,
      isActive,
      profilePicture: profilePicture ?? null,
    };

    const updatedUser = await prisma.user.update({
      where: { id },
      data: updatedData,
    });

    return res
      .status(200)
      .json({ message: "User updated successfully", updatedUser });
  } catch (error) {
    console.error("Error updating user:", error);

    if (error.code === "P2002" && error.meta?.target.includes("email")) {
      return res
        .status(400)
        .json({ message: "Email already in use by another user." });
    }

    return res.status(500).json({ message: "Internal Server Error" });
  }
}

// DELETE: Remove a user
async function handleDelete(req, res, userId) {
  try {
    const id = parseInt(userId, 10);
    if (!id || id <= 0)
      return res.status(400).json({ message: "Invalid User ID" });

    const existingUser = await prisma.user.findUnique({ where: { id } });
    if (!existingUser)
      return res.status(404).json({ message: "User not found" });

    await prisma.user.delete({ where: { id } });

    return res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
