import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/context/ThemeContext";
import { SimulationModeProvider } from "@/components/SimulationModeProvider";
import ClientBackground from "@/components/ClientBackground";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Arun Kumar Kulkarni — Senior Software Engineer",
  description:
    "Portfolio of Arun Kumar Kulkarni — senior software engineer with 4 years building production-grade .NET backends, React micro-frontends, and multi-tenant cloud systems.",
  keywords: [
    "Arun Kumar Kulkarni",
    "Senior Software Engineer",
    ".NET",
    "React",
    "TypeScript",
    "Portfolio",
  ],
  authors: [{ name: "Arun Kumar Kulkarni" }],
  openGraph: {
    title: "Arun Kumar Kulkarni — Senior Software Engineer",
    description:
      "4 years · 0% load-test error rate @ 600 RPM · 11 locales shipped. See the work.",
    type: "website",
  },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: [
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col relative">
        <ThemeProvider>
          <SimulationModeProvider>
            <ClientBackground />
            {children}
          </SimulationModeProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
