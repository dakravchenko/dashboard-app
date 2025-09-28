"use client";

import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import { Card, CardContent, Button, Typography, Box } from "@mui/material";
import { Task } from "@prisma/client";
import { useState } from "react";
import TaskDialog from "./TasksDialog";

const columns: { id: Task["status"]; label: string }[] = [
  { id: "TODO", label: "To Do" },
  { id: "IN_PROGRESS", label: "In Progress" },
  { id: "DONE", label: "Done" },
];

export default function TaskBoard({ initialTasks }: { initialTasks: Task[] }) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [dialogOpen, setDialogOpen] = useState(false)

  const onDragEnd = async (result: DropResult) => {
    const { destination, source } = result;
    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;

    const updated = Array.from(tasks);
    const [moved] = updated.splice(source.index, 1);
    moved.status = destination.droppableId as Task["status"];
    moved.level = destination.index;

    updated.splice(destination.index, 0, moved);

    // renumber levels in target column
    const reordered = updated.map((t, i) =>
      t.status === moved.status ? { ...t, level: i } : t
    );

    setTasks(reordered);

    // persist to backend
    await fetch(`/api/tasks/${moved.id}`, {
      method: "PATCH",
      body: JSON.stringify({ status: moved.status, level: moved.level }),
      headers: { "Content-Type": "application/json" },
    });
  };

  const handleCreateTask = async (status: Task["status"]) => {
    const newTask = {
      id: Math.random().toString(36).substring(2), // temp id for UI
      title: "New Task",
      status,
      level: tasks.filter((t) => t.status === status).length,
    };

    setTasks((prev) => [...prev, newTask]);

    // Persist to backend
    await fetch(`/api/tasks`, {
      method: "POST",
      body: JSON.stringify(newTask),
      headers: { "Content-Type": "application/json" },
    });
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Box display="flex" gap={2}>
        {columns.map((col) => (
          <Droppable droppableId={col.id} key={col.id}>
            {(provided) => (
              <Box
                ref={provided.innerRef}
                {...provided.droppableProps}
                sx={{
                  flex: 1,
                  borderRadius: 2,
                  p: 2,
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Typography variant="h6" mb={2}>
                  {col.label}
                </Typography>

                {/* Task cards */}
                <Box flex={1}>
                  {tasks
                    .filter((t) => t.status === col.id)
                    .sort((a, b) => a.level - b.level)
                    .map((task, index) => (
                      <Draggable
                        key={task.id}
                        draggableId={task.id}
                        index={index}
                      >
                        {(provided) => (
                          <Card
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            sx={{ mb: 1 }}
                          >
                            <CardContent>{task.title}</CardContent>
                          </Card>
                        )}
                      </Draggable>
                    ))}
                  {provided.placeholder}
                </Box>

                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => setDialogOpen(true)}
                  sx={{ mt: 1 }}
                >
                  + Create Task
                </Button>
              </Box>
            )}
          </Droppable>
        ))}
      </Box>
      <TaskDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSave={(newTask) => {
          // handle creating task here
          console.log("Task to save:", newTask);
        }}
      />
    </DragDropContext>
  );
}
