import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AMAN STYLE — Video Editor",
  description: "Transform your videos into Aman-inspired Instagram content",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-[#0a0a0a]">{children}</body>
    </html>
  );
}
