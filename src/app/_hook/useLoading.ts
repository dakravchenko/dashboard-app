"use client";
import { useContext } from "react";
import { LoadingContext } from "../_providers/LoadingProvider";

export function useLoading() {
  const ctx = useContext(LoadingContext);
  if (!ctx) throw new Error("useLoading must be used within LoadingProvider");
  return ctx.setLoading;
}