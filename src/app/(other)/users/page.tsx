import UsersTable from "@/components/UsersTable";
import prisma from "@/lib/prisma";

export default async function UsersPage() {
  const users = await prisma.user.findMany();

  return <UsersTable users={users} />;
}
