import CreateProjectForm from "@/components/CreateProjectForm";
import { getProjectById } from "@/lib/getProjects";
import { getUsers } from "@/lib/getUsers";
type Props = {
  params: Promise<{ id: string }>;
};

export default async function UpdateProjectPage({ params }: Props) {
  const { id } = await params;
  const [users, project] = await Promise.all([getUsers(), getProjectById(id)]);

  if (!project) return <div>Project not found</div>;

  return <CreateProjectForm users={users} project={project} />;
}
