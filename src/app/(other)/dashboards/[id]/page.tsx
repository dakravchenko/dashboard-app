import CreateProjectForm from "@/components/CreateProjectForm";
import TaskBoard from "@/components/TasksBoard";
import { getProjectById } from "@/lib/getProjects";
import { getUnarchivedTasksByProjectId } from "@/lib/getTasks";
import { getUsersByProjectId } from "@/lib/getUsers";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function ProjectPage({ params }: Props) {
  const { id } = await params;
  const [users, tasks, project] = await Promise.all([
    getUsersByProjectId(id),
    getUnarchivedTasksByProjectId(id),
    getProjectById(id),
  ]);

  return (
    <>
      <CreateProjectForm users={users} project={project!} isReadOnly={true} />
      <TaskBoard initialTasks={tasks} users={users} projectId={id} />
    </>
  );
}
