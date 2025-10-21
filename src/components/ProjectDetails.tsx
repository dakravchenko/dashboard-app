import CreateProjectForm from "@/components/CreateProjectForm";
import { getProjectById } from "@/lib/getProjects";
import { getUsersByProjectId } from "@/lib/getUsers";
import { ProjectDetailsInfo } from "./ProjectDetailsInfo";

type Props = { projectId: string };

export default async function ProjectDetails({ projectId }: Props) {
  const [project, users] = await Promise.all([
    getProjectById(projectId),
    getUsersByProjectId(projectId),
  ]);

  return <ProjectDetailsInfo project={project!} members={users} />;
}
