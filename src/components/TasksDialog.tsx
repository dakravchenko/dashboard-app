"use client";

import { dateFormats } from "@/app/localization";
import { OptionalTask } from "@/types/task";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Box,
  Autocomplete,
  Grid,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { TaskPriority, TaskStatus } from "@prisma/client";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { ReducedUser } from "@/types/user";
import { createTask } from "@/lib/actions/taskActions";

type Props = {
  open: boolean;
  onClose: () => void;
  onSave: (task: OptionalTask) => void; //Partial<Task>?
  fetchedValues?: OptionalTask;
  users: ReducedUser[];
  projectId: string;
};

const defaultTask = {
  number: 0, // or a default value
  title: "",
  description: "",
  status: "TODO" as TaskStatus,
  priority: "MEDIUM" as TaskPriority,
  level: 0, // or a default value
  dueDate: null,
  projectId: "", // or a default value
  assignedToId: "",
};

export default function TaskDialog({
  open,
  onClose,
  onSave,
  fetchedValues,
  users,
  projectId,
}: Props) {
  const [values, setValues] = useState<OptionalTask>(
    fetchedValues || defaultTask
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {}, [fetchedValues, open, projectId]);

  const handleChange = (field: keyof OptionalTask, value: any) => {
    setValues((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
        <DialogTitle>{fetchedValues ? "Edit Task" : "Create Task"}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            margin="normal"
            label="Title"
            value={values.title}
            error={!!errors.title}
            helperText={errors.title}
            onChange={(e) => handleChange("title", e.target.value)}
          />

          <TextField
            fullWidth
            margin="normal"
            label="Description"
            value={values.description}
            multiline
            minRows={3}
            error={!!errors.description}
            helperText={errors.description}
            onChange={(e) => handleChange("description", e.target.value)}
          />

          <Grid container spacing={2} mt={2}>
            <Grid size={{ xs: 6 }}>
              <FormControl fullWidth error={!!errors.status}>
                <InputLabel>Status</InputLabel>
                <Select
                  value={values.status}
                  label="Status"
                  onChange={(e) =>
                    handleChange("status", e.target.value as TaskStatus)
                  }
                >
                  <MenuItem value="TODO">To Do</MenuItem>
                  <MenuItem value="IN_PROGRESS">In Progress</MenuItem>
                  <MenuItem value="DONE">Done</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid size={{ xs: 6 }}>
              <FormControl fullWidth error={!!errors.priority}>
                <InputLabel>Priority</InputLabel>
                <Select
                  value={values.priority}
                  label="Priority"
                  onChange={(e) =>
                    handleChange("priority", e.target.value as TaskPriority)
                  }
                >
                  <MenuItem value="LOW">Low</MenuItem>
                  <MenuItem value="MEDIUM">Medium</MenuItem>
                  <MenuItem value="HIGH">High</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          <Grid container spacing={2} mt={2}>
            <Grid size={{ xs: 6 }}>
              <DatePicker
                format={dateFormats.keyboardDate}
                value={values.dueDate ? dayjs(values.dueDate) : null}
                onChange={(value) => handleChange("dueDate", value)}
                slotProps={{
                  textField: {
                    variant: "outlined",
                    label: "Due Date",
                    error: !!errors.dueDate,
                    helperText: errors.dueDate,
                    InputProps: { style: { backgroundColor: "transparent" } },
                  },
                }}
              />
            </Grid>

            <Grid size={{ xs: 6 }}>
              <Autocomplete
                options={users}
                getOptionLabel={(option) => option.name}
                value={
                  values.assignedToId
                    ? users.find((u) => u.id === values.assignedToId)
                    : null
                }
                onChange={(_, newValue) => {
                  handleChange("assignedToId", newValue ? newValue.id : "");
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Assign Users"
                    placeholder="Select users"
                    fullWidth
                    error={!!errors.assignedToId}
                    helperText={errors.assignedToId}
                  />
                )}
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button
            onClick={async () => {
              const result = await createTask({
                ...values,
                dueDate: values.dueDate ? new Date(values.dueDate) : null,
                projectId: projectId,
              });

              if (!result.success) {
                setErrors(result.errors ?? {});
              } else {
                onClose();
              }
            }}
            variant="contained"
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  );
}
