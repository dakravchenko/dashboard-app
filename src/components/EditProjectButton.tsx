"use client";

import { Box, IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import Link from "next/link";

type EditProjectButtonProps = {
  projectId: string;
};

export function EditProjectButton({ projectId }: EditProjectButtonProps) {
  return (
    <Box
      style={{ position: "absolute", top: "8px", right: "8px" }}
      onClick={(event) => event.stopPropagation()}
    >
      <Link href={`/dashboards/update/${projectId}`} passHref>
        <IconButton size="small" aria-label="Edit project">
          <EditIcon fontSize="small" />
        </IconButton>
      </Link>
    </Box>
  );
}
