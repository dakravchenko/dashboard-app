import { getServerSession } from "next-auth";
import { authOptions } from "../app/api/auth/[...nextauth]/route";

export async function requireRole(role: "ADMIN" | "MANAGER" | "MEMBER") {
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.role !== role) {
    throw new Error("Unauthorized");
  }

  return session.user;
}