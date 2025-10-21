import CreateProjectForm from "@/components/CreateProjectForm";
import { getProjectById } from "@/lib/getProjects";
import { getUsersByProjectId } from "@/lib/getUsers";

type Props = { projectId: string };

export default async function ProjectDetails({ projectId }: Props) {
  const [project, users] = await Promise.all([
    getProjectById(projectId),
    getUsersByProjectId(projectId),
  ]);

  return <CreateProjectForm users={users} project={project!} isReadOnly />;
}
