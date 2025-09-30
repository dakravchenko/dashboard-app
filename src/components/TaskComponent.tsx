'use client'

import { ReducedUser } from "@/types/user";
import { Task } from "@prisma/client";
import TaskDialog from "./TasksDialog";
import { useRouter } from "next/navigation";

type Props = {
  users: ReducedUser[];
  projectId: string;
  fetchedValues?: Task;
};
export default function TaskComponent({
  users,
  projectId,
  fetchedValues,
}: Props) {
  const router = useRouter();
  return (
    <TaskDialog
      fetchedValues={fetchedValues}
      open={true}
      onClose={router.back}
      users={users}
      projectId={projectId}
      setTasks={() => {}}
    />
  );
}
