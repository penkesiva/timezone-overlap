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
  description: "Easily visualize and compare time zones across different countries",
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
