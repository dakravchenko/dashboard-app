"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { Task, User, ProjectStatus, ResourceType } from "@prisma/client";

export async function createProject(data: {
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  members: User[];
  tasks: Task[];
  status: ProjectStatus;
  locationName: string;
  resourcesType: ResourceType;
  amount: number;
}) {
  await prisma.project.create({
    data: {
      title: data.title,
      description: data.description,
      startDate: data.startDate,
      endDate: data.endDate,
      status: data.status,
      locationName: data.locationName,
      members: {
        connect: data.members.map((member) => ({ id: member.id })),
      },
      tasks: {
        connect: data.tasks.map((task) => ({ id: task.id })),
      },
      resources: {
        create: {
          type: data.resourcesType,
          amount: data.amount,
        },
      },
    },
  });

  revalidatePath("/dashboards");
}