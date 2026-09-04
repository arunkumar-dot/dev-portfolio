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

/* TODO: Replace with your actual production domain once Vercel custom domain is confirmed */
const SITE_URL = "https://arunkumarkulkarni.dev";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
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
      "4 years · 4,061 requests, zero failures at 600 RPM · 11 locales shipped. See the work.",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Arun Kumar Kulkarni — Senior Software Engineer Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Arun Kumar Kulkarni — Senior Software Engineer",
    description:
      "4 years · 4,061 requests, zero failures at 600 RPM · 11 locales shipped. See the work.",
    images: ["/og-image.png"],
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

// JSON-LD Person structured data
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Arun Kumar Kulkarni",
  jobTitle: "Senior Software Engineer",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Bengaluru",
    addressCountry: "IN",
  },
  sameAs: [
    "https://github.com/arunkumar-dot",
    "https://linkedin.com/in/arun-kulkarni226",
    "https://tryhabitflow.com",
  ],
  alumniOf: {
    "@type": "CollegeOrUniversity",
    name: "PES University",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col relative">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
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
