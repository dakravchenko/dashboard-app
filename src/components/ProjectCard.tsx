import { Box, IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { Project } from "@prisma/client";
import Link from "next/link";
import { EditProjectButton } from "./EditProjectButton";

type Props = {
  project: Project;
};

export function ProjectCard({ project }: Props) {
  return (
    <Box
      style={{
        position: "relative",
        border: "1px solid #ccc",
        padding: "16px",
        borderRadius: "8px",
        cursor: "pointer",
        textDecoration: "none",
      }}
    >
      <EditProjectButton projectId={project.id} />
      <Link href={`/dashboards/${project.id}`} passHref>
        <Box>
          <h2>{project.title}</h2>
        </Box>
      </Link>
    </Box>
  );
}
