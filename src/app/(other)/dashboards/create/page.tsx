import CreateProjectForm from "@/components/CreateProjectForm";
import { getUnassignedTasks } from "@/lib/getTasks";
import { getUsers } from "@/lib/getUsers";

export default async function CreateProjectPage() {
  const [tasks, users] = await Promise.all([getUnassignedTasks(), getUsers()]);
  return <CreateProjectForm users={users} tasks={tasks} />;
}
