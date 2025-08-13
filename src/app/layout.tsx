import type { Metadata } from "next";
import "./globals.css";
import ThemeWrapper from "@/components/ThemeWrapper";

import { Inter } from "next/font/google";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});
export const metadata: Metadata = {
  title: {
    default: "Dashboard App",
    template: "%s | Dashboard App",
  },
  description: "Next project with MUI and TypeScript",
  keywords: ["Dashboard"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable}`}>
        <ThemeWrapper>{children}</ThemeWrapper>
      </body>
    </html>
  );
}
