import TaskBoard from "@/components/TasksBoard";
import { getUnarchivedTasksByProjectId } from "@/lib/getTasks";
import { getUsersByProjectId } from "@/lib/getUsers";
import TaskSlug from "./TaskSlug";

type Props = { projectId: string; taskSlug?: string };

export default async function ProjectTasks({ projectId, taskSlug }: Props) {
  const [tasks, users] = await Promise.all([
    getUnarchivedTasksByProjectId(projectId),
    getUsersByProjectId(projectId),
  ]);

  return (
    <>
      {taskSlug && (
        <TaskSlug projectId={projectId} taskSlug={taskSlug} users={users} />
      )}
      <TaskBoard initialTasks={tasks} users={users} projectId={projectId} />
    </>
  );
}
