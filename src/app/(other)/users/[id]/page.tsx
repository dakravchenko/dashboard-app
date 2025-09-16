import UserUpdateForm from "@/components/UserUpdateForm";
import prisma from "@/lib/prisma";

export default async function UserUpdatePage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;
  const user = await prisma.user.findUnique({ where: { id } });

  if (!user) {
    return <div>User not found</div>;
  }

  return <UserUpdateForm user={user} />;
}
