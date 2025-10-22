import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  _: Request,
  { params }: { params: Promise<{ projectId: string; taskNumber: string }> }
) {
  const { projectId, taskNumber } = await params;

  const number = Number(taskNumber);
  if (isNaN(number)) {
    return NextResponse.json({ error: "Invalid task number" }, { status: 400 });
  }

  const task = await prisma.task.findUnique({
    where: { projectId_number: { projectId, number } },
  });

  if (!task) {
    return NextResponse.json({ error: "Task not found" }, { status: 404 });
  }

  return NextResponse.json(task);
}
