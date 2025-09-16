import UserUpdateForm from "@/components/UserUpdateForm";
import prisma from "@/lib/prisma";
import { Box } from "@mui/material";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function UserUpdatePage({ params }: Props) {
  const { id } = await params;
  const user = await prisma.user.findUnique({ where: { id } });

  if (!user) {
    return <Box>User not found</Box>;
  }

  return <UserUpdateForm user={user} />;
}
