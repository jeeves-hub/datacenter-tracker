import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "US Data Center Project Tracker",
  description:
    "Dashboard tracking US data center projects under development — stages, capacity in GW, developer, offtaker, and key parties. Updated daily.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}