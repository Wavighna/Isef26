import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Solstice Surface Systems",
  description: "A static Next.js prototype for retrofit solar cleaning overlays."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#f4f7f3] font-sans text-[#132326] antialiased">
        {children}
      </body>
    </html>
  );
}
