import { Suspense } from "react";
import Skeleton from "@mui/material/Skeleton";
import ProjectDetails from "@/components/ProjectDetails";
import ProjectTasks from "@/components/ProjectTasks";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | undefined }>;
};

export default async function ProjectPage({ params, searchParams }: Props) {
  const { id } = await params;
  const searchParamsResolved = await searchParams;
  const taskSlug = searchParamsResolved.task;

  return (
    <>
      {/*apperently suspense works only for server components */}
      <Suspense
        fallback={
          <Skeleton variant="rectangular" height={200} sx={{ mb: 4 }} />
        }
      >
        <ProjectDetails projectId={id} />
      </Suspense>
      {/*
      <Suspense
        fallback={
          <Skeleton variant="rectangular" height={400} sx={{ mb: 4 }} />
        }
      >
        <ProjectTasks projectId={id} />
      </Suspense> */}

      <ProjectTasks projectId={id} taskSlug={taskSlug} />
    </>
  );
}
