import UsersTable from "@/components/UsersTable";
import { authOptions } from "@/lib/authOptions";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";

export default async function UsersPage() {
  const session = await getServerSession(authOptions);

  const users = await prisma.user.findMany();

  return (
    <UsersTable users={users} canUpdateUsers={session?.user.role === "ADMIN"} />
  );
}
