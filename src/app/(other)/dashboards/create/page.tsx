import CreateProjectForm from "@/components/CreateProjectForm";
import prisma from "@/lib/prisma";

export default async function CreateProjectPage() {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
    },
  });
  const tasks = await prisma.task.findMany({ where: { projectId: undefined } });
  return <CreateProjectForm users={users} tasks={tasks} />;
}
