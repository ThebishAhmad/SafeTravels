import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "SafeTravels - NIT Jalandhar Smart Mobility System",
  description:
    "Track campus buses in real-time, share auto rides, and travel smarter. Built for NIT Jalandhar students.",
  keywords: ["NIT Jalandhar", "bus tracking", "ride sharing", "campus transport", "SafeTravels"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Navbar />
        {children}
      </body>
    </html>
  );
}
