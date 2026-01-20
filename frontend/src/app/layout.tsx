import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "The Meeting Archaeologist",
  description: "Convert chaotic communication into execution-ready data",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}

