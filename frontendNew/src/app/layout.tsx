import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Email Analysis System",
  description: "Analyze email receiving chains and ESP types",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-gray-50 text-gray-900">
        {children}
      </body>
    </html>
  );
}
