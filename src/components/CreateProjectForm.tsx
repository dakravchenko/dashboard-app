"use client";
import { Dayjs } from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import { useEffect, useState } from "react";
import { ProjectStatus, ResourceType, Task } from "@prisma/client";
import { dateFormats } from "@/app/localization";
import { Button } from "@mui/material";
import { useRouter } from "next/navigation";
import { createProject } from "@/app/(other)/dashboards/actions";
import { FullProject, ReducedUser } from "@/types/user";

import dynamic from "next/dynamic";

const DatePicker = dynamic(
  () =>
    import("@mui/x-date-pickers/DatePicker").then((mod) => ({
      default: mod.DatePicker,
    })),
  { ssr: false }
);
type Props = {
  users: ReducedUser[];
  tasks: Task[];
  project?: FullProject;
};

export default function CreateProjectForm({ users, tasks, project }: Props) {
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
    if (project) {
      setFormData({
        title: project.title || "",
        description: project.description || "",
        startDate: project.startDate?.format("DD-MM-YYYY"),
        endDate: project.endDate?.format("DD-MM-YYYY"),
        members: project.members || [],
        tasks: project.tasks || [],
        status: project.status || "NOT_STARTED",
        locationName: project.locationName || "",
        resourcesType: project.resources?.[0]?.type || null,
        amount: project.resources?.[0]?.amount || 0,
      });
    }
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

  const handleTaskChange = (event: React.SyntheticEvent, value: Task[]) => {
    setFormData((prev) => ({ ...prev, tasks: value }));
  };

  const submitData = async (data: typeof formData) => {
    const formattedData = {
      ...data,
      startDate: data.startDate?.format("DD-MM-YYYY"),
      endDate: data.endDate?.format("DD-MM-YYYY"),
    };

    const response = await createProject({
      title: formattedData.title,
      description: formattedData.description,
      startDate: formattedData.startDate!,
      endDate: formattedData.endDate!,
      status: formattedData.status,
      locationName: formattedData.locationName,
      members: formattedData.members,
      tasks: formattedData.tasks.map((task) => ({ id: task.id })),
      resources: formattedData.resourcesType
        ? [{ type: formattedData.resourcesType, amount: formattedData.amount }]
        : [],
    });

    if (!response.success) {
      setErrors(response.errors || {});
    } else {
      router.push("/dashboards");
    }
  };

  return (
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
        <Grid size={{ xs: 12 }}>
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
        <Grid size={{ xs: 12 }}>
          <Autocomplete
            multiple
            options={tasks}
            getOptionLabel={(option) => option.title}
            value={formData.tasks}
            onChange={handleTaskChange}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Select Tasks"
                placeholder="Select Tasks"
                fullWidth
                error={!!errors.tasks}
                helperText={errors.tasks}
              />
            )}
          />
        </Grid>
        <Grid size={{ xs: 4 }}>
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
        <Grid size={{ xs: 4 }}>
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
        <Grid size={{ xs: 4 }}>
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
              Create
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </LocalizationProvider>
  );
}
