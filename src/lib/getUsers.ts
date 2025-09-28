import prisma from "./prisma";


export const getUsers = async () => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
    },
  });
  return users;
};