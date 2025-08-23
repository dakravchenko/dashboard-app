"use client";
import { SessionProvider } from "next-auth/react";
import ThemeWrapper from "@/components/ThemeWrapper";
import Navbar from "@/components/NavBar";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeWrapper>
        <Navbar />
        {children}
      </ThemeWrapper>
    </SessionProvider>
  );
}