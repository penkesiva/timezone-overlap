import type { Metadata } from "next";
import { JetBrains_Mono, Outfit } from "next/font/google";
import "./globals.css";
import ThemeToggle from "./components/ThemeToggle";
import AdSenseScript from "./components/AdSenseScript";

const outfit = Outfit({ 
  subsets: ["latin"],
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({ 
  subsets: ["latin"],
  variable: '--font-jetbrains-mono'
});

export const metadata: Metadata = {
  title: "TimeZone Overlap - Find Common Working Hours",
  description: "Easily visualize and compare time zones across different countries. Find overlapping working hours for international teams and meetings. Free time zone converter and meeting planner.",
  keywords: "timezone overlap, time zone converter, meeting planner, international meetings, working hours calculator, global team coordination",
  authors: [{ name: "TimeZone Overlap" }],
  openGraph: {
    title: "TimeZone Overlap - Find Common Working Hours",
    description: "Easily visualize and compare time zones across different countries. Perfect for planning international meetings and coordinating global teams.",
    type: "website",
    url: "https://timezoneoverlap.net",
    siteName: "TimeZone Overlap",
    images: [{
      url: "/og-image.jpg",
      width: 1200,
      height: 630,
      alt: "TimeZone Overlap - Visual Time Zone Converter"
    }],
  },
  twitter: {
    card: "summary_large_image",
    title: "TimeZone Overlap - Find Common Working Hours",
    description: "Easily visualize and compare time zones across different countries. Perfect for planning international meetings.",
    images: ["/twitter-image.jpg"],
  },
  verification: {
    google: "your-google-verification-code",
  },
  alternates: {
    canonical: "https://timezoneoverlap.net",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <AdSenseScript />
      </head>
      <body className={`${outfit.className} ${jetbrainsMono.variable} bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-white min-h-screen transition-colors duration-200`}>
        <ThemeToggle />
        {children}
      </body>
    </html>
  );
}
