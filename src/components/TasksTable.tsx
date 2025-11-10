"use client";

import { ReducedUser } from "@/types/user";
import { GridFilterModel } from "@mui/x-data-grid";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Task } from "@prisma/client";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import TaskDialog from "./TasksDialog";
import { OptionalTask } from "@/types/task";

export function TasksTable() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [rows, setRows] = useState<OptionalTask[]>([]);
  const [loading, setLoading] = useState(false);
  const [rowCount, setRowCount] = useState(0);
  const [usersByProject, setUsersByProject] = useState<
    Record<string, ReducedUser[]>
  >({});
  const [dialogTask, setDialogTask] = useState<Task | null>(null);

  async function ensureUsersLoaded(projectId: string) {
    if (usersByProject[projectId]) return;

    const res = await fetch(`/api/users/${projectId}`, { cache: "no-store" });
    const data = await res.json();

    setUsersByProject((prev) => ({
      ...prev,
      [projectId]: data,
    }));
  }

  const page = Number(searchParams.get("page") || 0);
  const pageSize = Number(searchParams.get("pageSize") || 10);
  const sortField = searchParams.get("sortField") || "createdAt";
  const sortOrder = searchParams.get("sortOrder") || "desc";

  const [filterField, setFilterField] = useState(
    searchParams.get("filterField") || ""
  );
  const [filterValue, setFilterValue] = useState(
    searchParams.get("filterValue") || ""
  );

  const [filterModel, setFilterModel] = useState<GridFilterModel>(() => {
    if (!filterField || !filterValue) return { items: [] };
    return {
      items: [{ field: filterField, operator: "contains", value: filterValue }],
    };
  });

  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      const params = new URLSearchParams({
        page: String(page),
        pageSize: String(pageSize),
        sortField,
        sortOrder,
      });

      if (filterField && filterValue) {
        params.set("filterField", filterField);
        params.set("filterValue", filterValue);
      }

      const res = await fetch(`/api/tasks?${params.toString()}`, {
        cache: "no-store",
      });
      const data = await res.json();
      setRows(data.tasks);
      setRowCount(data.total);
      setLoading(false);
    };
    fetchTasks();
  }, [page, pageSize, sortField, sortOrder, filterField, filterValue]);

  const columns: GridColDef[] = [
    { field: "number", headerName: "Number", width: 100 },
    { field: "title", headerName: "Title", flex: 1 },
    { field: "status", headerName: "Status", width: 120 },
    { field: "priority", headerName: "Priority", width: 120 },
    { field: "dueDate", headerName: "Due Date", width: 150 },
    { field: "projectId", headerName: "Project", width: 180 },
    { field: "assignedToId", headerName: "Assigned To", width: 180 },
    { field: "createdAt", headerName: "Created", width: 180 },
    { field: "updatedAt", headerName: "Updated", width: 180 },
    { field: "archived", headerName: "Archived", width: 100, type: "boolean" },
  ];

  const updateQuery = (updates: Record<string, string | undefined>) => {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(updates)) {
      if (!value) params.delete(key);
      else params.set(key, value);
    }
    router.push(`?${params.toString()}`);
  };

  return (
    <div style={{ height: 700, width: "100%" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        loading={loading}
        paginationMode="server"
        sortingMode="server"
        filterMode="server"
        rowCount={rowCount}
        pageSizeOptions={[5, 10, 25, 50]}
        paginationModel={{ page, pageSize }}
        onPaginationModelChange={(model) =>
          updateQuery({
            page: String(model.page),
            pageSize: String(model.pageSize),
          })
        }
        onSortModelChange={(model) => {
          const sort = model[0];
          updateQuery({
            sortField: sort?.field,
            sortOrder: sort?.sort || "",
          });
        }}
        filterModel={filterModel}
        onFilterModelChange={(model) => {
          setFilterModel(model);
          const firstFilter = model.items[0];
          if (firstFilter?.field && firstFilter?.value) {
            updateQuery({
              filterField: firstFilter.field,
              filterValue: firstFilter.value,
            });
          } else {
            updateQuery({ filterField: undefined, filterValue: undefined });
          }

          setFilterField(firstFilter?.field || "");
          setFilterValue(firstFilter?.value || "");
        }}
        onRowClick={async (params) => {
          const projectId = params.row.projectId;

          setDialogTask(params.row);
          await ensureUsersLoaded(projectId);
        }}
      />
      <TaskDialog
        open={!!dialogTask}
        onClose={() => setDialogTask(null)}
        fetchedValues={dialogTask}
        users={
          dialogTask?.projectId ? usersByProject[dialogTask?.projectId] : []
        }
        projectId={dialogTask?.projectId || ""}
        setTasks={(updatedTasks) => setRows(updatedTasks)}
      />
    </div>
  );
}
