import type { Metadata } from "next";
import { JetBrains_Mono, Outfit } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import ThemeToggle from "./components/ThemeToggle";

const outfit = Outfit({ 
  subsets: ["latin"],
  variable: '--font-aptos',
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
  const handleAdSenseLoad = () => {
    console.log('AdSense script loaded');
  };

  const handleAdSenseError = () => {
    console.error('AdSense script failed to load');
  };

  return (
    <html lang="en">
      <head>
        {/* Google AdSense Script */}
        <Script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID}`}
          crossOrigin="anonymous"
          strategy="afterInteractive"
          onLoad={handleAdSenseLoad}
          onError={handleAdSenseError}
        />
      </head>
      <body className={`${outfit.variable} ${jetbrainsMono.variable} font-aptos bg-gradient-to-br from-gray-900 to-gray-800 text-white min-h-screen transition-colors duration-200`}>
        <ThemeToggle />
        {children}
      </body>
    </html>
  );
}
