"use server";
import { TaskPriority, TaskStatus } from "@prisma/client";
import z from "zod";
import prisma from "../prisma";
import { revalidatePath } from "next/cache";

const createTaskSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().max(1000),
  status: z.enum(TaskStatus),
  priority: z.enum(TaskPriority),
  dueDate: z.date().nullable().optional(),
  projectId: z.string().min(1, { message: "Project ID is required" }),
  // assignedToId: z.string().optional(),
  level: z.number().min(0).optional(),
  // archived: z.boolean().optional(),
});

export async function createTask(data: {
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: Date | null;
  projectId: string;
  assignedToId: string | null;
  level?: number;
}) {
  const validation = createTaskSchema.safeParse(data);

  if (!validation.success) {
    return {
      success: false,
      errors: validation.error.issues.reduce(
        (acc, curr) => {
          if (curr.path.length > 0) {
            acc[curr.path[0] as string] = curr.message;
          }
          return acc;
        },
        {} as { [key: string]: string }
      ),
    };
  }

  const task = await prisma.task.create({
    data: {
      title: data.title,
      description: data.description || "",
      status: data.status,
      priority: data.priority,
      dueDate: data.dueDate || null,
      projectId: data.projectId,
      assignedToId: data.assignedToId || null,
      level: data.level || 0,
      archived: false,
    },
  });

  revalidatePath(`/dashboards/${data.projectId}`);

  return { success: true, task };
}

export async function deleteTask(taskId: string, projectId: string) {
  await prisma.task.delete({ where: { id: taskId } });

  revalidatePath(`/dashboards/${projectId}`);
}

export async function updateTask(data: {
  id: string;
  title?: string;
  description?: string | null;
  status?: TaskStatus;
  priority?: TaskPriority;
  dueDate?: Date | null;
  assignedToId?: string | null;
  level?: number;
  projectId: string;
  archived: boolean;
}) {
  const validation = createTaskSchema.partial().safeParse(data);

  if (!validation.success) {
    return {
      success: false,
      errors: validation.error.issues.reduce(
        (acc, curr) => {
          if (curr.path.length > 0) {
            acc[curr.path[0] as string] = curr.message;
          }
          return acc;
        },
        {} as { [key: string]: string }
      ),
    };
  }

  const task = await prisma.task.update({
    where: { id: data.id },
    data: {
      ...data,
      description: data.description || undefined,
      assignedToId: data.assignedToId || undefined,
      dueDate: data.dueDate === undefined ? undefined : data.dueDate || null,
    },
  });

  revalidatePath(`/dashboards/${data.projectId}`);

  return { success: true, task };
}

export async function updateLevelAndStatus(
  taskId: string,
  status: TaskStatus,
  level: number,
  projectId: string
) {
  await prisma.task.update({
    where: { id: taskId },
    data: { status, level },
  });

  revalidatePath(`/dashboards/${projectId}`);
}

export async function archiveTask(
  taskId: string,
  projectId: string,
  archived: boolean
) {
  await prisma.task.update({
    where: { id: taskId },
    data: { archived: !archived },
  });

  revalidatePath(`/dashboards/${projectId}`);
}
