import UserUpdateForm from "@/components/UserUpdateForm";
import prisma from "@/lib/prisma";
import { Box } from "@mui/material";

type Props = {
  params: { id: string };
};

export default async function UserUpdatePage({ params }: Props) {
  const user = await prisma.user.findUnique({ where: { id: params.id } });

  if (!user) {
    return <Box>User not found</Box>;
  }

  return <UserUpdateForm user={user} />;
}
