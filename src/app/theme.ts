import { createTheme, PaletteOptions } from "@mui/material/styles";

export type Mode = "light" | "dark";

interface CustomPalette extends PaletteOptions {
  mode: Mode;
  primary: {
    main: string;
  };
  secondary: {
    main: string;
  };
  background: {
    default: string;
    paper: string;
  };
  text: {
    primary: string;
    secondary: string;
  };
}

const lightPalette: CustomPalette = {
  mode: "light",
  primary: {
    main: "#1976d2",
  },
  secondary: {
    main: "#9c27b0",
  },
  background: {
    default: "#f5f5f5",
    paper: "#ffffff",
  },
  text: {
    primary: "#000000",
    secondary: "#555555",
  },
};

const darkPalette: CustomPalette = {
  mode: "dark",
  primary: {
    main: "#90caf9",
  },
  secondary: {
    main: "#ce93d8",
  },
  background: {
    default: "#121212",
    paper: "#1e1e1e",
  },
  text: {
    primary: "#ffffff",
    secondary: "#bbbbbb",
  },
};

export const getTheme = (mode: Mode) => {
  return createTheme({
    palette: {
      mode,
    },
    typography: {
      fontFamily: "Inter, sans-serif",
    },
  });
};
