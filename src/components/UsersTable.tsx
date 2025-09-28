"use client";

import { User } from "@prisma/client";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { IconButton, Typography } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { deleteUser } from "@/lib/actions/userActions";
import { useRouter } from "next/navigation";

type Props = {
  users: Omit<User, "password">[];
  canUpdateUsers: boolean;
};

export default function UsersTable({ users, canUpdateUsers }: Props) {
  const router = useRouter();

  const columns: GridColDef[] = [
    { field: "name", headerName: "Name", flex: 1 },
    { field: "email", headerName: "Email", flex: 1 },
    {
      field: "createdAt",
      headerName: "Created At",
      flex: 1,
    },
    {
      field: "updatedAt",
      headerName: "Updated At",
      flex: 1,
    },
    {
      field: "role",
      headerName: "Role",
      flex: 1,
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      sortable: false,
      renderCell: (params) =>
        canUpdateUsers && (
          <>
            <IconButton
              aria-label="edit"
              onClick={() => router.push(`/users/${params.row.id}`)}
            >
              <EditIcon />
            </IconButton>
            <IconButton
              aria-label="delete"
              onClick={async () => await deleteUser(params.row.id)}
            >
              <DeleteIcon />
            </IconButton>
          </>
        ),
    },
  ];

  return (
    <>
      <Typography variant="h4" gutterBottom>
        User Management
      </Typography>
      <DataGrid rows={users} columns={columns} />
    </>
  );
}
