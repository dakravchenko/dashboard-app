"use client";

import { useState } from "react";
import {
  TextField,
  Button,
  Autocomplete,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { Role, User } from "@prisma/client";
import { useRouter } from "next/navigation";
import { updateUser } from "@/app/(other)/users/actions";

type Props = {
  user: User;
};

const roles = ["ADMIN", "MEMBER", "MANAGER"];

export default function UserUpdateForm({ user }: Props) {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [role, setRole] = useState(user.role);
  const router = useRouter();

  return (
    <Dialog open={true} onClose={router.back} fullWidth maxWidth="sm">
      <DialogTitle>Update User</DialogTitle>
      <DialogContent>
        <TextField
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
          margin="normal"
        />
        <Autocomplete
          sx={{ marginTop: 2 }}
          options={roles}
          value={role}
          onChange={(e, newValue) => setRole(newValue as Role)}
          renderInput={(params) => <TextField {...params} label="Role" />}
          fullWidth
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={router.back} variant="outlined" color="primary">
          Cancel
        </Button>
        <Button
          onClick={() =>
            updateUser(user.id, name, email, role).then(() => router.back())
          }
          type="submit"
          form="user-update-form"
          variant="contained"
          color="primary"
        >
          Update User
        </Button>
      </DialogActions>
    </Dialog>
  );
}
