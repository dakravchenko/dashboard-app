"use client";
import TaskDialog from "./TasksDialog";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Task } from "@prisma/client";
import { ReducedUser } from "@/types/user";
import { useLoading } from "@/app/_hook/useLoading";

type Props = {
  projectId: string;
  taskSlug: string;
  users: ReducedUser[];
};

export default function TaskSlug({ projectId, taskSlug, users }: Props) {
  const router = useRouter();
  const [task, setTask] = useState<Task>();
  const setLoading = useLoading();

  useEffect(() => {
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

  if (!task) return null;

  return (
    <TaskDialog
      fetchedValues={task}
      open={task ? true : false}
      onClose={() => router.push(`/dashboards/${projectId}`)}
      users={users}
      projectId={projectId}
      setTasks={() => {}}
    />
  );
}
