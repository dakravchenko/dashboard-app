import { Box, Grid, Paper, Typography } from "@mui/material";
import dayjs from "dayjs";
import NavAvatar from "./NavAvatar";
import { FullProject, ReducedUser } from "@/types/user";

type Props = {
  project: FullProject;
  members: ReducedUser[];
};

export async function ProjectDetailsInfo({ project }: Props) {
  return (
    <Paper elevation={2} sx={{ p: 2, borderRadius: 2, mb: 4 }}>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography variant="caption" color="text.secondary">
            Title
          </Typography>
          <Typography variant="body1" fontWeight={600} noWrap>
            {project?.title || "N/A"}
          </Typography>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Typography variant="caption" color="text.secondary">
            Description
          </Typography>
          <Typography
            variant="body1"
            fontWeight={600}
            sx={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {project?.description || "N/A"}
          </Typography>
        </Grid>

        <Grid size={{ xs: 6, md: 3 }}>
          <Typography variant="caption" color="text.secondary">
            Start Date
          </Typography>
          <Typography variant="body1" fontWeight={600}>
            {project?.startDate
              ? dayjs(project.startDate).format("DD/MM/YYYY")
              : "N/A"}
          </Typography>
        </Grid>

        <Grid size={{ xs: 6, md: 3 }}>
          <Typography variant="caption" color="text.secondary">
            End Date
          </Typography>
          <Typography variant="body1" fontWeight={600}>
            {project?.endDate
              ? dayjs(project.endDate).format("DD/MM/YYYY")
              : "N/A"}
          </Typography>
        </Grid>

        <Grid size={{ xs: 6, md: 3 }}>
          <Typography variant="caption" color="text.secondary">
            Location
          </Typography>
          <Typography variant="body1" fontWeight={600} noWrap>
            {project?.locationName || "N/A"}
          </Typography>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Typography variant="caption" color="text.secondary">
            Members
          </Typography>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              flexWrap: "wrap",
              overflow: "hidden",
            }}
          >
            {project?.members && project.members.length > 0 ? (
              project.members.map((member) => (
                <NavAvatar key={member.id} user={member} />
              ))
            ) : (
              <Typography variant="body1" fontWeight={600}>
                N/A
              </Typography>
            )}
          </Box>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Typography variant="caption" color="text.secondary">
            Resources
          </Typography>
          <Typography variant="body1" fontWeight={600}>
            {project?.resources && project.resources.length > 0
              ? `${project.resources[0].type} - ${project.resources[0].amount}`
              : "N/A"}
          </Typography>
        </Grid>
      </Grid>
    </Paper>
  );
}
