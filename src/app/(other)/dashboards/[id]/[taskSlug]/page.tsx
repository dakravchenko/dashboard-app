import TaskComponent from "@/components/TaskComponent";
import { getTaskByProjectIdAndTaskNumber } from "@/lib/getTasks";
import { getUsersByProjectId } from "@/lib/getUsers";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ id: string; taskSlug: string }>;
};
export default async function TaskPage({ params }: Props) {
  const { id, taskSlug } = await params;
  const firstPart = taskSlug.split("-")[0];
  const taskNumber = Number(firstPart);

  if (isNaN(taskNumber) || taskNumber <= 0) {
    notFound();
  }
  const [users, fetchedTask] = await Promise.all([
    getUsersByProjectId(id),
    getTaskByProjectIdAndTaskNumber(id, Number(taskNumber)),
  ]);

  if (!fetchedTask) notFound();

  return (
    <TaskComponent
      users={users}
      projectId={id}
      fetchedValues={fetchedTask || undefined}
    />
  );
}
