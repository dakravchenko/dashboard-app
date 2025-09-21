import CreateProjectForm from "@/components/CreateProjectForm";
import prisma from "@/lib/prisma";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function UpdateProjectPage({ params }: Props) {
  const { id } = await params;
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
    },
  });
  const tasks = await prisma.task.findMany({ where: { projectId: undefined } });
  const project = await prisma.project.findUnique({
    where: { id },
    include: {
      members: true,
      tasks: true,
      resources: true,
    },
  });

  if (!project) return <div>Project not found</div>;

  console.log("Project to update:", project);
  return <CreateProjectForm users={users} tasks={tasks} project={project} />;
}
