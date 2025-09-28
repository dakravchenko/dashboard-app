import UsersTable from "@/components/UsersTable";
import { authOptions } from "@/lib/authOptions";
import { getUsersForTable } from "@/lib/getUsers";
import { getServerSession } from "next-auth";

export default async function UsersPage() {
  const [users, session] = await Promise.all([
    getUsersForTable(),
    getServerSession(authOptions),
  ]);

  return (
    <UsersTable users={users} canUpdateUsers={session?.user.role === "ADMIN"} />
  );
}
