"use client";

import React, { ReactNode, useState } from "react";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { getTheme } from "@/app/theme";
import { FormControlLabel, Switch } from "@mui/material";
import { Mode } from "@/app/theme";

export default function ThemeWrapper({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<Mode>("light");

  const toggleTheme = () => {
    setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
  };

  const theme = getTheme(mode);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <FormControlLabel
        control={
          <Switch
            checked={mode === "dark"}
            onChange={toggleTheme}
            color="primary"
          />
        }
        label={mode === "dark" ? "Dark Mode" : "Light Mode"}
        style={{ position: "absolute", top: 10, right: 10 }}
      />
      {children}
    </ThemeProvider>
  );
}
