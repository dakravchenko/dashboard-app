import { getUsersByProjectId } from "@/lib/getUsers";
import { NextResponse } from "next/server";

export async function GET(
  _: Request,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const { projectId } = await params;

  const users = await getUsersByProjectId(projectId);

  if (!users) {
    return NextResponse.json({ error: "Users not found" }, { status: 404 });
  }

  return NextResponse.json(users);
}
