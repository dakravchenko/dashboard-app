import prisma from "./prisma";

export const getProjectById = async (id: string) => {
  const project = await prisma.project.findUnique({
    where: { id },
    include: {
      members: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      tasks: true,
      resources: true,
    },
  });

  return project;
};