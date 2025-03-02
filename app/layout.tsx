import type { Metadata } from "next";
import { JetBrains_Mono, Outfit } from "next/font/google";
import "./globals.css";
import ThemeToggle from "./components/ThemeToggle";
import AdSenseScript from "./components/AdSenseScript";
import Navbar from "./components/Navbar";

const outfit = Outfit({ 
  subsets: ["latin"],
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({ 
  subsets: ["latin"],
  variable: '--font-jetbrains-mono'
});

export const metadata: Metadata = {
  title: "timezoneoverlap.net - Find Common Working Hours",
  description: "Easily visualize and compare time zones across different countries. Find overlapping working hours for international teams and meetings. Free time zone converter and meeting planner.",
  keywords: "timezone overlap, time zone converter, meeting planner, international meetings, working hours calculator, global team coordination",
  authors: [{ name: "timezoneoverlap.net" }],
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    apple: [
      { url: '/apple-touch-icon.png' },
    ],
    other: [
      {
        rel: 'mask-icon',
        url: '/safari-pinned-tab.svg',
        color: '#4A90E2'
      }
    ]
  },
  manifest: '/site.webmanifest',
  openGraph: {
    title: "timezoneoverlap.net - Find Common Working Hours",
    description: "Easily visualize and compare time zones across different countries. Perfect for planning international meetings and coordinating global teams.",
    type: "website",
    url: "https://timezoneoverlap.net",
    siteName: "timezoneoverlap.net",
    images: [{
      url: "/og-image.jpg",
      width: 1200,
      height: 630,
      alt: "timezoneoverlap.net - Visual Time Zone Converter"
    }],
  },
  twitter: {
    card: "summary_large_image",
    title: "timezoneoverlap.net - Find Common Working Hours",
    description: "Easily visualize and compare time zones across different countries. Perfect for planning international meetings.",
    images: ["/twitter-image.jpg"],
  },
  verification: {
    google: process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID?.replace('ca-pub-', ''),
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
        <meta name="theme-color" content="#1a1a1a" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#4A90E2" />
        <AdSenseScript />
      </head>
      <body className={`${outfit.className} ${jetbrainsMono.variable} bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-white min-h-screen transition-colors duration-200`}>
        <ThemeToggle />
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          {children}
        </div>
      </body>
    </html>
  );
}
