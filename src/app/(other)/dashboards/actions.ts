"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { ProjectStatus, ResourceType } from "@prisma/client";
import { z } from "zod";
import { ReducedUser } from "@/types/user";

const createProjectSchema = z
  .object({
    title: z.string().min(1, { message: "Title is required" }),
    description: z.string().max(500, { message: "Description is too long" }),
    startDate: z.date({ message: "Start date must be a valid date" }),
    endDate: z.date({ message: "End date must be a valid date" }),
    status: z.enum(ProjectStatus),
    locationName: z.string(),
    //  mapData: z.any().optional(),
    members: z.array(
      z.object({
        id: z.string(),
      })
    ),
    tasks: z.array(
      z.object({
        id: z.string(),
      })
    ),
    resources: z.array(
      z.object({
        type: z.string(),
        amount: z.number(),
      })
    ),
  })
  .refine((data) => data.endDate >= data.startDate, {
    message: "End date must be greater than or equal to start date",
    path: ["endDate"],
  });

export async function createProject(data: {
  title: string;
  description?: string;
  startDate: Date | null;
  endDate: Date | null;
  status: ProjectStatus;
  locationName?: string;
  mapData?: string;
  members?: ReducedUser[];
  tasks?: { id: string }[];
  resources?: { type: string; amount: number }[];
}) {
  const validation = createProjectSchema.safeParse(data);

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
        {} as Record<string, string>
      ),
    };
  }

  // Proceed with creating the project in the database
  await prisma.project.create({
    data: {
      title: data.title,
      description: data.description,
      startDate: data.startDate!,
      endDate: data.endDate!,
      status: data.status,
      locationName: data.locationName,
      mapData: data.mapData,
      members: data.members
        ? {
            connect: data.members.map((member) => ({ id: member.id })),
          }
        : undefined,
      tasks: data.tasks
        ? {
            connect: data.tasks.map((task) => ({ id: task.id })),
          }
        : undefined,
      resources: data.resources
        ? {
            create: data.resources.map((resource) => ({
              type: resource.type as ResourceType,
              amount: resource.amount,
            })),
          }
        : undefined,
    },
  });
  revalidatePath("/dashboards");

  return { success: true };
}

export async function updateProject(
  projectId: string,
  data: {
    title: string;
    description?: string;
    startDate: Date | null;
    endDate: Date | null;
    status: ProjectStatus;
    locationName?: string;
    mapData?: string;
    members?: ReducedUser[];
    tasks?: { id: string }[];
    resources?: { type: string; amount: number }[];
  }
) {
  const validation = createProjectSchema.safeParse(data);

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
        {} as Record<string, string>
      ),
    };
  }

  await prisma.project.update({
    where: { id: projectId },
    data: {
      title: data.title,
      description: data.description,
      startDate: data.startDate!,
      endDate: data.endDate!,
      status: data.status,
      locationName: data.locationName,
      mapData: data.mapData,
      members: data.members
        ? {
            set: data.members.map((member) => ({ id: member.id })),
          }
        : undefined,
      tasks: data.tasks
        ? {
            set: data.tasks.map((task) => ({ id: task.id })),
          }
        : undefined,
      resources: data.resources
        ? {
            deleteMany: {},
            create: data.resources.map((resource) => ({
              type: resource.type as ResourceType,
              amount: resource.amount,
            })),
          }
        : undefined,
    },
  });
  revalidatePath("/dashboards");
  revalidatePath(`/dashboards/${projectId}`);

  return { success: true };
}
