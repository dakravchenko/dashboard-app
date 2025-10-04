import prisma from "./prisma";

export const getUnassignedTasks = async () => {
  const tasks = await prisma.task.findMany({ where: { projectId: undefined } });
  return tasks;
};

export const getTasksByProjectId = async (projectId: string) => {
  const tasks = await prisma.task.findMany({
    where: { projectId },
  });
  return tasks;
};

export const getTaskByProjectIdAndTaskNumber = async (
  projectId: string,
  number: number
) => {
  const task = await prisma.task.findUnique({
    where: { projectId_number: { projectId, number } },
  });
  return task;
};
