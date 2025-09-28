"use client";

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
} from "@mui/material";
import { Task, TaskPriority, TaskStatus } from "@prisma/client";
import { useState } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  onSave: (task: Task) => void; //Partial<Task>?
  initialValues?: Task;
};

const defaultTask = {
  number: 0, // or a default value
  id: "", // or a default value
  title: "",
  description: null,
  status: "TODO" as TaskStatus,
  priority: "MEDIUM" as TaskPriority,
  level: 0, // or a default value
  dueDate: null,
  projectId: "", // or a default value
  assignedToId: "",
  createdAt: new Date(),
  updatedAt: new Date(),
};

export default function TaskDialog({
  open,
  onClose,
  onSave,
  initialValues,
}: Props) {
  const [values, setValues] = useState<Task>(initialValues || defaultTask);

  const handleChange = (field: keyof Task, value: any) => {
    setValues((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    onSave(values);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{initialValues ? "Edit Task" : "Create Task"}</DialogTitle>
      <DialogContent>
        {/* Title */}
        <TextField
          fullWidth
          margin="normal"
          label="Title"
          value={values.title}
          onChange={(e) => handleChange("title", e.target.value)}
        />

        {/* Description */}
        <TextField
          fullWidth
          margin="normal"
          label="Description"
          value={values.description}
          multiline
          minRows={3}
          onChange={(e) => handleChange("description", e.target.value)}
        />

        <Box display="flex" gap={2} mt={2}>
          {/* Status */}
          <FormControl fullWidth>
            <InputLabel>Status</InputLabel>
            <Select
              value={values.status}
              label="Status"
              onChange={(e) =>
                handleChange("status", e.target.value as Task["status"])
              }
            >
              <MenuItem value="TODO">To Do</MenuItem>
              <MenuItem value="IN_PROGRESS">In Progress</MenuItem>
              <MenuItem value="DONE">Done</MenuItem>
            </Select>
          </FormControl>

          {/* Priority */}
          <FormControl fullWidth>
            <InputLabel>Priority</InputLabel>
            <Select
              value={values.priority}
              label="Priority"
              onChange={(e) =>
                handleChange("priority", e.target.value as Task["priority"])
              }
            >
              <MenuItem value="LOW">Low</MenuItem>
              <MenuItem value="MEDIUM">Medium</MenuItem>
              <MenuItem value="HIGH">High</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <Box display="flex" gap={2} mt={2}>
          {/* Due date */}
          <TextField
            type="date"
            fullWidth
            label="Due Date"
            InputLabelProps={{ shrink: true }}
            value={values.dueDate || ""}
            onChange={(e) => handleChange("dueDate", e.target.value)}
          />

          {/* Assigned To (simple text for now, could be Select with users) */}
          <TextField
            fullWidth
            label="Assigned To"
            value={values.assignedToId || ""}
            onChange={(e) => handleChange("assignedToId", e.target.value)}
          />
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} variant="contained">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
