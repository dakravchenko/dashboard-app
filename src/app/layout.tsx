import type { Metadata } from "next";
import "./globals.css";

import { Inter } from "next/font/google";
import ClientLayout from "./ClientLayout";
import ThemeWrapper from "@/components/ThemeWrapper";

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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable}`}>
        <ThemeWrapper>
          <ClientLayout>
            <div className="app-root">{children}</div>
          </ClientLayout>
        </ThemeWrapper>
      </body>
    </html>
  );
}
