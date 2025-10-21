"use client";
import dayjs, { Dayjs } from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import { useEffect, useState } from "react";
import { ProjectStatus, ResourceType, Task } from "@prisma/client";
import { dateFormats } from "@/app/localization";
import { Button, Typography, Box, Paper, Chip, Avatar } from "@mui/material";
import { useRouter } from "next/navigation";
import { createProject, updateProject } from "@/lib/actions/projectActions";
import { FullProject, ReducedUser } from "@/types/user";

import dynamic from "next/dynamic";
import NavAvatar from "./NavAvatar";

const DatePicker = dynamic(
  () =>
    import("@mui/x-date-pickers/DatePicker").then((mod) => ({
      default: mod.DatePicker,
    })),
  { ssr: false }
);

type Props = {
  users: ReducedUser[];
  project?: FullProject;
  isReadOnly?: boolean;
};

export default function CreateProjectForm({
  users,
  project,
  isReadOnly,
}: Props) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startDate: null as Dayjs | null,
    endDate: null as Dayjs | null,
    members: [] as ReducedUser[],
    tasks: [] as Task[],
    status: "NOT_STARTED" as ProjectStatus,
    locationName: "",
    resourcesType: null as ResourceType | null,
    amount: 0,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const router = useRouter();

  useEffect(() => {
    if (!project) return;

    setFormData({
      title: project.title || "",
      description: project.description || "",
      startDate: project.startDate ? dayjs(project.startDate) : null,
      endDate: project.endDate ? dayjs(project.endDate) : null,
      members: project.members || [],
      tasks: project.tasks || [],
      status: project.status || "NOT_STARTED",
      locationName: project.locationName || "",
      resourcesType: project.resources?.[0]?.type || null,
      amount: project.resources?.[0]?.amount || 0,
    });
  }, [project]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "amount" ? parseFloat(value) || 0 : value,
    }));
  };

  const handleDateChange = (
    name: "startDate" | "endDate",
    value: Dayjs | null
  ) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUserChange = (
    event: React.SyntheticEvent,
    value: ReducedUser[]
  ) => {
    setFormData((prev) => ({ ...prev, members: value }));
  };

  const submitData = async (data: typeof formData) => {
    const projectData = {
      title: data.title,
      description: data.description,
      startDate: data.startDate ? data.startDate.toDate() : null,
      endDate: data.endDate ? data.endDate.toDate() : null,
      status: data.status,
      locationName: data.locationName,
      members: data.members,
      tasks: data.tasks.map((task) => ({ id: task.id })),
      resources: data.resourcesType
        ? [{ type: data.resourcesType, amount: data.amount }]
        : [],
    };

    const response = project
      ? await updateProject(project.id, projectData)
      : await createProject(projectData);

    if (!response.success) {
      setErrors(response.errors || {});
    } else {
      router.push("/dashboards");
    }
  };

  return !isReadOnly ? (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12 }}>
          <TextField
            label="Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            fullWidth
            error={!!errors.title}
            helperText={errors.title}
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <TextField
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            multiline
            rows={4}
            fullWidth
            error={!!errors.description}
            helperText={errors.description}
          />
        </Grid>
        <Grid size={{ xs: 6 }}>
          <DatePicker
            format={dateFormats.keyboardDate}
            label="Start Date"
            value={formData.startDate}
            onChange={(value) => handleDateChange("startDate", value)}
            slotProps={{
              textField: {
                size: "small",
                fullWidth: true,
                variant: "outlined",
                error: !!errors.startDate,
                helperText: errors.startDate,
                InputProps: { style: { backgroundColor: "transparent" } },
              },
            }}
          />
        </Grid>
        <Grid size={{ xs: 6 }}>
          <DatePicker
            format={dateFormats.keyboardDate}
            label="End Date"
            value={formData.endDate}
            onChange={(value) => handleDateChange("endDate", value)}
            slotProps={{
              textField: {
                size: "small",
                fullWidth: true,
                variant: "outlined",
                error: !!errors.endDate,
                helperText: errors.endDate,
                InputProps: { style: { backgroundColor: "transparent" } },
              },
            }}
          />
        </Grid>
        <Grid size={{ xs: 6 }}>
          <Autocomplete
            multiple
            options={users}
            getOptionLabel={(option) => option.name}
            value={formData.members}
            onChange={handleUserChange}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Assign Users"
                placeholder="Select users"
                fullWidth
                error={!!errors.members}
                helperText={errors.members}
              />
            )}
          />
        </Grid>
        <Grid size={{ xs: 6 }}>
          <TextField
            label="Location Name"
            name="locationName"
            value={formData.locationName}
            onChange={handleChange}
            fullWidth
            error={!!errors.locationName}
            helperText={errors.locationName}
          />
        </Grid>
        <Grid size={{ xs: 6 }}>
          <Autocomplete
            options={Object.values(ResourceType)}
            getOptionLabel={(option) => option}
            value={formData.resourcesType}
            onChange={(event, value) =>
              setFormData((prev) => ({ ...prev, resourcesType: value }))
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label="Resources"
                placeholder="Select resources"
                fullWidth
                error={!!errors.resourcesType}
                helperText={errors.resourcesType}
              />
            )}
          />
        </Grid>
        <Grid size={{ xs: 6 }}>
          <TextField
            label="Amount"
            name="amount"
            type="number"
            value={formData.amount}
            onChange={handleChange}
            fullWidth
            error={!!errors.amount}
            helperText={errors.amount}
          />
        </Grid>
        <Grid
          container
          justifyContent="flex-end"
          spacing={2}
          style={{ marginTop: 16 }}
        >
          <Grid>
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
          </Grid>
          <Grid>
            <Button
              variant="contained"
              color="primary"
              onClick={() => submitData(formData)}
            >
              {project ? "Update" : "Create"}
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </LocalizationProvider>
  ) : (
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
