"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";

export async function createProject(data: {
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
}) {
  await prisma.project.create({
    data: {
      title: data.title,
      description: data.description,
      startDate: data.startDate,
      endDate: data.endDate,
    },
  });

  revalidatePath("/dashboards");
}