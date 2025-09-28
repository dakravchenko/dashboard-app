import prisma from "./prisma";

const getUnassignedTasks = async () => {
    const tasks = await prisma.task.findMany({ where: { projectId: undefined } });
    return tasks;
}