import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/hooks/AuthProvider";
import { Toaster } from "sonner";
import ThemeInit from "@/components/reusable/ThemeInit";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "StarSeed",
  description: "StarSeed School Management Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthProvider>
      <html lang="en" className={inter.variable} suppressHydrationWarning>
        <body className="font-sans antialiased">
          <ThemeInit />
          {children}
          <Toaster />
        </body>
      </html>
    </AuthProvider>
  );
}
