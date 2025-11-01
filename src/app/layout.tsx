import type { Metadata } from "next";
import { Inter, Lora } from "next/font/google";
import "./globals.css";
import { LayoutWrapper } from "@/components/layout-wrapper";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Stackboxd",
  description: "Log, rate, and reflect on your developer stack.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="min-h-full h-full">
      <body className={`${inter.variable} ${lora.variable} antialiased bg-[var(--bg)] text-[var(--text)] min-h-screen flex flex-col h-full`}>
        <LayoutWrapper>{children}</LayoutWrapper>
      </body>
    </html>
  );
}
