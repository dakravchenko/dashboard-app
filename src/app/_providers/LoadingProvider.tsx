"use client";
import { createContext, useState, useEffect, ReactNode } from "react";
import { CircularProgress, Box } from "@mui/material";

type LoadingContextType = {
  setLoading: (value: boolean) => void;
};

export const LoadingContext = createContext<LoadingContextType | null>(null);

export function LoadingProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.body.style.cursor = loading ? "wait" : "default";
  }, [loading]);

  return (
    <LoadingContext.Provider value={{ setLoading }}>
      {children}
      {loading && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            bgcolor: "rgba(0,0,0,0.3)",
            zIndex: 9999,
          }}
        >
          <CircularProgress size={60} />
        </Box>
      )}
    </LoadingContext.Provider>
  );
}
