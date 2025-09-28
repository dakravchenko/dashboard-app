import TaskBoard from "@/components/TasksBoard";
import { getTasksByProjectId } from "@/lib/getTasks";
import { getUsersByProjectId } from "@/lib/getUsers";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function ProjectPage({ params }: Props) {
  const { id } = await params;
  const [users, tasks] = await Promise.all([
    getUsersByProjectId(id),
    getTasksByProjectId(id),
  ]);

  return (
    <>
      <TaskBoard initialTasks={tasks} users={users} projectId={id} />
    </>
  );
}
