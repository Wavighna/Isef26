import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Solstice Surface Systems",
  description: "A static Next.js prototype for retrofit solar cleaning overlays."
};

export default function RootLayout({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen max-w-full overflow-x-hidden bg-[#061116] font-sans text-[#e9fbf7] antialiased">
        {children}
      </body>
    </html>
  );
}
