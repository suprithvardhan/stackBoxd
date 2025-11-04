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

const baseUrl = process.env.NEXTAUTH_URL || "https://stackboxd.vercel.app"

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "StackBoxd - Log, Rate, and Reflect on Your Developer Stack",
    template: "%s | StackBoxd",
  },
  description: "Log, rate, and reflect on your developer stack. Discover tools, share projects, and build your developer portfolio. Think Letterboxd, but for your tech stack.",
  keywords: [
    "developer tools",
    "tech stack",
    "software development",
    "developer portfolio",
    "programming tools",
    "framework reviews",
    "developer community",
    "tech reviews",
    "software reviews",
    "developer stack",
  ],
  authors: [{ name: "StackBoxd Team" }],
  creator: "StackBoxd",
  publisher: "StackBoxd",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: baseUrl,
    siteName: "StackBoxd",
    title: "StackBoxd - Log, Rate, and Reflect on Your Developer Stack",
    description: "Discover and share developer tools. Log your tech stack, rate tools, and build your developer portfolio.",
    images: [
      {
        url: `${baseUrl}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: "StackBoxd - Developer Stack Platform",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "StackBoxd - Log, Rate, and Reflect on Your Developer Stack",
    description: "Discover and share developer tools. Log your tech stack, rate tools, and build your developer portfolio.",
    images: [
      {
        url: `${baseUrl}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: "StackBoxd - Developer Stack Platform",
      },
    ],
    creator: "@stackboxd",
    site: "@stackboxd",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    // Add these when you have them
    // google: "your-google-verification-code",
    // yandex: "your-yandex-verification-code",
    // bing: "your-bing-verification-code",
  },
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml", sizes: "any" },
      { url: "/favicon-optimized.svg", type: "image/svg+xml" },
    ],
    apple: [
      { url: "/app-icon-square.svg", sizes: "180x180", type: "image/svg+xml" },
      { url: "/icon.svg", sizes: "180x180", type: "image/svg+xml" },
    ],
    shortcut: [
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
  },
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
