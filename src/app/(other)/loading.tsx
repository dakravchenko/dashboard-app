import React from "react";
import { Box, Skeleton } from "@mui/material";

function loading() {
  return (
    <Box sx={{ padding: 2 }}>
      <Skeleton variant="text" width="60%" height={40} />

      <Skeleton
        variant="rectangular"
        width="100%"
        height={200}
        sx={{ marginTop: 2 }}
      />
      <Skeleton variant="text" width="40%" height={30} sx={{ marginTop: 2 }} />
      <Skeleton variant="text" width="50%" height={30} />
    </Box>
  );
}

export default loading;
