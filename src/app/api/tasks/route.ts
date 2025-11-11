import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = Number(searchParams.get("page") || 0);
  const pageSize = Number(searchParams.get("pageSize") || 10);
  const sortField = searchParams.get("sortField") || "createdAt";
  const sortOrder = searchParams.get("sortOrder") === "asc" ? "asc" : "desc";
  const filterField = searchParams.get("filterField");
  const filterValue = searchParams.get("filterValue");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: Record<string, any> = {};

  if (filterField && filterValue) {
    if (filterField === "title") {
      where[filterField] = { contains: filterValue, mode: "insensitive" };
    } else if (filterField === "archived") {
      where[filterField] = filterValue === "true";
    } else {
      where[filterField] = filterValue;
    }
  }

  const skip = page * pageSize;
  const take = pageSize;
  try {
    const [tasks, total] = await Promise.all([
      prisma.task.findMany({
        skip,
        take,
        where,
        orderBy: { [sortField]: sortOrder },
        select: {
          id: true,
          number: true,
          title: true,
          status: true,
          priority: true,
          dueDate: true,
          projectId: true,
          assignedToId: true,
          createdAt: true,
          updatedAt: true,
          archived: true,
          project: {
            select: { title: true },
          },
          assignedTo: {
            select: { email: true },
          },
        },
      }),
      prisma.task.count({ where }),
    ]);
    return NextResponse.json({ tasks, total });
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
