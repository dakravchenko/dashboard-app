import TaskComponent from "@/components/TaskComponent";
import TaskDialog from "@/components/TasksDialog";
import { getTaskByNumber, getTasksByProjectId } from "@/lib/getTasks";
import { getUsersByProjectId } from "@/lib/getUsers";

type Props = {
  params: Promise<{ projectId: string; taskNumber: number }>;
};
export default async function TaskPage({ params }: Props) {
  const { projectId, taskNumber } = await params;
  const [users, fetchedTask] = await Promise.all([
    getUsersByProjectId(projectId),
    getTaskByNumber(projectId, taskNumber),
  ]);

  return (
    <TaskComponent
      users={users}
      projectId={projectId}
      fetchedValues={fetchedTask || undefined}
    />
  );
}
