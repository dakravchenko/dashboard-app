"use client";
import TaskDialog from "./TasksDialog";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Task } from "@prisma/client";
import { ReducedUser } from "@/types/user";
import { useLoading } from "@/app/_hook/useLoading";
import { OptionalTask } from "@/types/task";

type Props = {
  projectId: string;
  taskSlug?: string;
  users: ReducedUser[];
  setTasks: React.Dispatch<React.SetStateAction<OptionalTask[]>>;
};

export default function TaskSlug({
  projectId,
  taskSlug,
  users,
  setTasks,
}: Props) {
  const router = useRouter();
  const [task, setTask] = useState<Task | null>(null);
  const setLoading = useLoading();

  const onClose = () => {
    setTask(null);
    router.push(`/dashboards/${projectId}`);
  };

  useEffect(() => {
    if (!taskSlug) return;
    const load = async () => {
      const number = Number(taskSlug.split("-")[0]);
      try {
        const res = await fetch(`/api/tasks/${projectId}/${number}`);
        if (!res.ok) throw new Error("Failed to fetch task");
        const data = await res.json();
        setTask(data);
      } catch (error) {
        console.error(error);
        router.push(`/dashboards/${projectId}`);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [taskSlug, projectId, router]);

  if (!task) {
    return;
  }

  return (
    <TaskDialog
      fetchedValues={task}
      open={task !== null}
      onClose={onClose}
      users={users}
      projectId={projectId}
      setTasks={setTasks}
    />
  );
}
