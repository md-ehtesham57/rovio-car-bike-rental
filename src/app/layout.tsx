import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Rovio — Car & Bike Rentals",
  description:
    "Rent top-notch cars & bikes near you. Fast, affordable & hassle-free.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}