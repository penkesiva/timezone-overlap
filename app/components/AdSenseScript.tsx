'use client';

import Script from "next/script";

export default function AdSenseScript() {
  const handleAdSenseLoad = () => {
    console.log('AdSense script loaded');
  };

  const handleAdSenseError = () => {
    console.error('AdSense script failed to load');
  };

  return (
    <Script
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID}`}
      crossOrigin="anonymous"
      strategy="afterInteractive"
      onLoad={handleAdSenseLoad}
      onError={handleAdSenseError}
    />
  );
} 