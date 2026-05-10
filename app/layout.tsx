import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Isef26",
  description: "A basic Next.js website starter."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
