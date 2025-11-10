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
  Autocomplete,
  Grid,
  Box,
  Typography,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { TaskPriority, TaskStatus } from "@prisma/client";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { ReducedUser } from "@/types/user";
import { archiveTask, createTask, updateTask } from "@/lib/actions/taskActions";

type Props = {
  open: boolean;
  onClose: () => void;
  fetchedValues: OptionalTask | null;
  users: ReducedUser[];
  projectId: string;
  setTasks: React.Dispatch<React.SetStateAction<OptionalTask[]>>;
};

const defaultTask = {
  title: "",
  description: "",
  status: "TODO" as TaskStatus,
  priority: "MEDIUM" as TaskPriority,
  level: 0,
  dueDate: null,
  projectId: "",
  assignedToId: "",
  archived: false,
};

export default function TaskDialog({
  open,
  onClose,
  fetchedValues,
  users,
  projectId,
  setTasks,
}: Props) {
  const [values, setValues] = useState<OptionalTask>(defaultTask);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (fetchedValues) {
      setValues(fetchedValues);
    } else {
      setValues(defaultTask);
    }
  }, [fetchedValues]);

  const handleChange = <K extends keyof OptionalTask>(
    field: K,
    value: OptionalTask[K]
  ) => {
    setValues((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
        <DialogTitle>{fetchedValues ? "Edit Task" : "Create Task"}</DialogTitle>
        <DialogContent>
          {values.archived && <Typography color="info">Archived</Typography>}
          <TextField
            fullWidth
            margin="normal"
            label="Title"
            value={values.title}
            error={!!errors.title}
            helperText={errors.title}
            onChange={(e) => handleChange("title", e.target.value)}
            disabled={values.archived}
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
            disabled={values.archived}
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
                  disabled={values.archived}
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
                  disabled={values.archived}
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
                onChange={(value) =>
                  handleChange("dueDate", value as Date | null)
                }
                disabled={values.archived}
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
                disabled={values.archived}
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
          {values.id && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-start",
                flexGrow: 1,
              }}
            >
              <Button
                onClick={() => {
                  archiveTask(values.id!, values.projectId, values.archived);
                  onClose();
                  setTasks((prev) =>
                    prev.filter((task) => task.id !== values.id)
                  );
                  setValues(defaultTask);
                }}
              >
                {values.archived ? "Unarchive" : "Archive"}
              </Button>
            </Box>
          )}
          <Button
            onClick={() => {
              onClose();
              setValues(defaultTask);
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={async () => {
              const body = {
                ...values,
                projectId,
                dueDate: values.dueDate ? new Date(values.dueDate) : null,
                id: fetchedValues?.id || "",
              };

              const result = fetchedValues
                ? await updateTask(body)
                : await createTask(body);

              if (!result.success) {
                setErrors(result.errors ?? {});
                return;
              }

              if (!result.task) return;

              setTasks((prev) => {
                if (fetchedValues) {
                  return prev.map((task) =>
                    task.id === result.task.id ? result.task : task
                  );
                }
                return [result.task, ...prev];
              });

              onClose();
              setValues(defaultTask);
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
