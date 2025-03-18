import prisma from "@/lib/prisma";

export default async function handler(req, res) {
  const { method } = req;

  switch (method) {
    case "GET":
      return handleGet(req, res);
    default:
      res.setHeader("Allow", ["GET"]);
      return res.status(405).json({ message: `Method ${method} Not Allowed` });
  }
}

const handleGet = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      orderBy: { firstName: "asc" },
    });

    if (!users || users.length === 0) {
      return res.status(404).json({ message: "No users found." });
    }

    return res.status(200).json({ users });
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
