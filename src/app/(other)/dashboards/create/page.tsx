import CreateProjectForm from "@/components/CreateProjectForm";
import { getUsers } from "@/lib/getUsers";

export default async function CreateProjectPage() {
  const users = await getUsers();
  return <CreateProjectForm users={users} />;
}
