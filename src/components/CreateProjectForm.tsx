"use client";

import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import { useState } from "react";
import { Task, User } from "@prisma/client";
import { dateFormats } from "@/app/localization";

type Props = {
  users: User[];
  tasks: Task[];
};

export default function CreateProjectForm({ users, tasks }: Props) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startDate: null,
    endDate: null,
    assignedUsers: [] as User[],
    tasks: [] as Task[],
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (
    name: "startDate" | "endDate",
    value: Date | null
  ) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUserChange = (event: any, value: User[]) => {
    setFormData((prev) => ({ ...prev, assignedUsers: value }));
  };

  const handleTaskChange = (event: any, value: Task[]) => {
    setFormData((prev) => ({ ...prev, tasks: value }));
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
                // error: !!errors.startDate,
                // helperText: errors.startDate,
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
                // error: !!errors.endDate,
                // helperText: errors.endDate,
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
            value={formData.assignedUsers}
            onChange={handleUserChange}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Assign Users"
                placeholder="Select users"
                fullWidth
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
              />
            )}
          />
        </Grid>
      </Grid>
    </LocalizationProvider>
  );
}
