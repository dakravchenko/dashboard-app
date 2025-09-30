"use client";

import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import { Card, CardContent, Button, Typography, Box } from "@mui/material";
import { useState } from "react";
import TaskDialog from "./TasksDialog";
import { OptionalTask } from "@/types/task";
import { ReducedUser } from "@/types/user";
import { createTask, updateLevelAndStatus } from "@/lib/actions/taskActions";
import { TaskStatus } from "@prisma/client";
import NavAvatar from "./NavAvatar";

const columns: { id: TaskStatus; label: string }[] = [
  { id: "TODO", label: "To Do" },
  { id: "IN_PROGRESS", label: "In Progress" },
  { id: "DONE", label: "Done" },
];

type Props = {
  initialTasks: OptionalTask[];
  users: ReducedUser[];
  projectId: string;
};

export default function TaskBoard({ initialTasks, users, projectId }: Props) {
  const [tasks, setTasks] = useState<OptionalTask[]>(initialTasks);
  const [dialogOpen, setDialogOpen] = useState(false);

  const onDragEnd = async (result: DropResult) => {
    const { destination, source } = result;
    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;

    let updatedTasks = [...tasks];

    if (source.droppableId === destination.droppableId) {
      const colTasks = updatedTasks
        .filter((t) => t.status === source.droppableId)
        .sort((a, b) => a.level - b.level);

      const [moved] = colTasks.splice(source.index, 1);
      colTasks.splice(destination.index, 0, moved);

      colTasks.forEach((t, i) => (t.level = i));

      updatedTasks = updatedTasks.map((t) => {
        const updated = colTasks.find((c) => c.id === t.id);
        return updated || t;
      });

      setTasks(updatedTasks);

      await updateLevelAndStatus(
        moved.id!,
        moved.status,
        moved.level,
        projectId
      );
    } else {
      const sourceTasks = updatedTasks
        .filter((t) => t.status === source.droppableId)
        .sort((a, b) => a.level - b.level);

      const destTasks = updatedTasks
        .filter((t) => t.status === destination.droppableId)
        .sort((a, b) => a.level - b.level);

      const [moved] = sourceTasks.splice(source.index, 1);
      moved.status = destination.droppableId as TaskStatus;
      destTasks.splice(destination.index, 0, moved);

      sourceTasks.forEach((t, i) => (t.level = i));
      destTasks.forEach((t, i) => (t.level = i));

      updatedTasks = updatedTasks.map((t) => {
        const updated =
          sourceTasks.find((s) => s.id === t.id) ||
          destTasks.find((d) => d.id === t.id);
        return updated || t;
      });

      setTasks(updatedTasks);

      await updateLevelAndStatus(
        moved.id!,
        moved.status,
        moved.level,
        projectId
      );
    }
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

                <Box flex={1}>
                  {tasks
                    .filter((t) => t.status === col.id)
                    .sort((a, b) => a.level - b.level)
                    .map((task, index) => (
                      <Draggable
                        key={task.id}
                        draggableId={task.id!}
                        index={index}
                      >
                        {(provided) => (
                          <Card
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            sx={{ mb: 1 }}
                          >
                            <CardContent>
                              <Typography variant="h6">{task.title}</Typography>
                              <Typography
                                variant="body2"
                                sx={{
                                  color:
                                    task.priority === "HIGH"
                                      ? "red"
                                      : task.priority === "MEDIUM"
                                        ? "orange"
                                        : "green",
                                }}
                              >
                                priority: {task.priority}
                              </Typography>

                              <Box mt={1} display="flex" alignItems="center">
                                <Box
                                  flex={1}
                                  display="flex"
                                  alignItems="center"
                                  justifyContent="flex-start"
                                >
                                  {task.dueDate && (
                                    <Typography
                                      variant="body2"
                                      sx={{ mr: 2, fontStyle: "italic" }}
                                    >
                                      Due:{" "}
                                      {new Date(
                                        task.dueDate
                                      ).toLocaleDateString()}
                                    </Typography>
                                  )}
                                </Box>

                                <Box
                                  flex={1}
                                  display="flex"
                                  alignItems="center"
                                  justifyContent="flex-end"
                                >
                                  {task.assignedToId && (
                                    <NavAvatar
                                      user={
                                        users.find(
                                          (u) => u.id === task.assignedToId
                                        ) || null
                                      }
                                    />
                                  )}
                                </Box>
                              </Box>
                              {task.dueDate && (
                                <Typography
                                  variant="body2"
                                  sx={{
                                    mt: 1,
                                    fontStyle: "italic",
                                    textAlign: "center",
                                  }}
                                >
                                  {(() => {
                                    const today = new Date();
                                    const dueDate = new Date(task.dueDate);
                                    const diffInTime =
                                      dueDate.getTime() - today.getTime();
                                    const diffInDays = Math.ceil(
                                      diffInTime / (1000 * 60 * 60 * 24)
                                    );

                                    if (diffInDays === 0) {
                                      return "Deadline is today";
                                    } else if (
                                      diffInDays > 0 &&
                                      diffInDays <= 7
                                    ) {
                                      return `${diffInDays} day${diffInDays > 1 ? "s" : ""} before due date`;
                                    } else {
                                      return null;
                                    }
                                  })()}
                                </Typography>
                              )}
                            </CardContent>
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
        onSave={createTask}
        users={users}
        projectId={projectId}
      />
    </DragDropContext>
  );
}
