import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

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
        <link
          href="https://fonts.googleapis.com/css2?family=Aptos:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
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
      <body className={`font-aptos bg-gradient-to-br from-gray-900 to-gray-800 text-white min-h-screen ${inter.className}`}>
        {children}
      </body>
    </html>
  );
}
