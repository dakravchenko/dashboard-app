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

export const getUsersByProjectId = async (projectId: string) => {
  const users = await prisma.user.findMany({
    where: {
      projects: {
        some: {
          id: projectId,
        },
      },
    },
    select: {
      id: true,
      name: true,
      email: true,
    },
  });
  return users;
};

export const getUsersForTable = async () => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  return users;
}
