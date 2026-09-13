import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Alton Kesselly — AI Researcher & Full-Stack Developer",
    template: "%s | Alton Kesselly",
  },
  description:
    "AI researcher, data analyst, and full-stack developer. I build AI systems, interactive dashboards, and digital tools for education and development.",
  keywords: [
    "Alton Kesselly",
    "AI Researcher",
    "Machine Learning",
    "Data Analyst",
    "Full-Stack Developer",
    "Wagtail",
    "Next.js",
    "Education Policy",
    "Liberia",
  ],
  authors: [{ name: "Alton Kesselly" }],
  creator: "Alton Kesselly",
  openGraph: {
    type: "website",
    locale: "en_US",
    title: "Alton Kesselly — AI Researcher & Full-Stack Developer",
    description:
      "I build AI systems, interactive dashboards, and digital tools for education and development.",
    siteName: "Alton Kesselly",
  },
  twitter: {
    card: "summary_large_image",
    title: "Alton Kesselly — AI Researcher & Full-Stack Developer",
    description:
      "I build AI systems, interactive dashboards, and digital tools for education and development.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body
        className="min-h-full flex flex-col bg-navy-950 text-ink-100"
        suppressHydrationWarning
      >
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}