import CreateProjectForm from "@/components/CreateProjectForm";
import prisma from "@/lib/prisma";

export default async function CreateProjectPage() {
  const users = await prisma.user.findMany();
  const tasks = await prisma.task.findMany({ where: { projectId: undefined } });
  return <CreateProjectForm users={users} tasks={tasks} />;
}
