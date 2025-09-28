import prisma from "./prisma";

export const getUnassignedTasks = async () => {
    const tasks = await prisma.task.findMany({ where: { projectId: undefined } });
    return tasks;
}