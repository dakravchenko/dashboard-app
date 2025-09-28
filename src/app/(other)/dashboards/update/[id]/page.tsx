import CreateProjectForm from "@/components/CreateProjectForm";
import { getProjectById } from "@/lib/getProjects";
import { getUnassignedTasks } from "@/lib/getTasks";
import { getUsers } from "@/lib/getUsers";
type Props = {
  params: Promise<{ id: string }>;
};

export default async function UpdateProjectPage({ params }: Props) {
  const { id } = await params;
  const [users, tasks, project] = await Promise.all([
    getUsers(),
    getUnassignedTasks(),
    getProjectById(id),
  ]);

  if (!project) return <div>Project not found</div>;

  return <CreateProjectForm users={users} tasks={tasks} project={project} />;
}
