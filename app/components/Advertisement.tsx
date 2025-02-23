'use client';

import { useEffect, useRef } from 'react';
import { useInView } from 'react-intersection-observer';

interface AdvertisementProps {
  slot: string;
  format?: 'auto' | 'fluid' | 'rectangle' | 'vertical' | 'horizontal';
  style?: React.CSSProperties;
  className?: string;
}

// Define a more specific type for AdSense
interface AdsenseItem {
  [key: string]: unknown;
}

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

export default function Advertisement({ slot, format = 'auto', style, className }: AdvertisementProps) {
  const { ref, inView } = useInView({
    threshold: 0,
    triggerOnce: true,
  });

  const adRef = useRef<boolean>(false);

  useEffect(() => {
    if (inView && !adRef.current && typeof window !== 'undefined') {
      try {
        // Initialize adsbygoogle if not already initialized
        if (!window.adsbygoogle) {
          window.adsbygoogle = [];
        }
        
        // Push a new ad unit
        window.adsbygoogle.push({});
        adRef.current = true;
        console.log('Ad unit pushed successfully for slot:', slot);
      } catch (err) {
        console.error('Error loading advertisement:', err);
      }
    }
  }, [inView, slot]);

  if (!process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID) {
    return (
      <div className={`flex items-center justify-center ${className || ''} bg-gray-800/50 rounded-lg`}>
        <p className="text-sm text-gray-400">Ad Client ID Not Found</p>
      </div>
    );
  }

  return (
    <div ref={ref} className={`relative ad-container ${className || ''} bg-gray-800/50 rounded-lg flex items-center justify-center`}>
      {!inView ? (
        <div className="text-sm text-gray-400">Loading Ad...</div>
      ) : (
        <ins
          className="adsbygoogle w-full h-full"
          style={{ display: 'block' }}
          data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID}
          data-ad-slot={slot}
          data-ad-format={format}
          data-full-width-responsive="true"
        />
      )}
    </div>
  );
} 