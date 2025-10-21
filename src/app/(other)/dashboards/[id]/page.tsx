import { Suspense } from "react";
import Skeleton from "@mui/material/Skeleton";
import ProjectDetails from "@/components/ProjectDetails";
import ProjectTasks from "@/components/ProjectTasks";

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <>
      <Suspense
        fallback={
          <Skeleton variant="rectangular" height={200} sx={{ mb: 4 }} />
        }
      >
        <ProjectDetails projectId={id} />
      </Suspense>

      <Suspense
        fallback={
          <Skeleton variant="rectangular" height={400} sx={{ mb: 4 }} />
        }
      >
        <ProjectTasks projectId={id} />
      </Suspense>
    </>
  );
}
