import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Taller Store",
  description: "Browse and search the Taller Store product catalog.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
