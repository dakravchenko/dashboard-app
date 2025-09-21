import { ProjectCard } from "@/components/ProjectCard";
import prisma from "@/lib/prisma";
import { Grid, Typography, Box, Button } from "@mui/material";
import Link from "next/link";

export default async function ProjectsPage() {
  const projects = await prisma.project.findMany();

  return (
    <>
      <Grid container spacing={2}>
        {projects.length > 0 ? (
          projects.map((project) => (
            <Grid key={project.id} size={{ xs: 12, sm: 6, md: 4 }}>
              <ProjectCard project={project} />
            </Grid>
          ))
        ) : (
          <Grid size={{ xs: 12 }}>
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              height="200px"
              border="1px solid #ccc"
              borderRadius="8px"
              flexDirection="column"
            >
              <Typography variant="h6" color="textSecondary">
                No Projects Available
              </Typography>
            </Box>
          </Grid>
        )}
      </Grid>
      <Box mt={2} display="flex" justifyContent="center">
        <Button component={Link} href="/dashboards/create" variant="contained">
          Create a project
        </Button>
      </Box>
    </>
  );
}
