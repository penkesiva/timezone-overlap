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
    adsbygoogle: Array<AdsenseItem>;
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
      } catch (err) {
        console.error('Error loading advertisement:', err);
      }
    }
  }, [inView]);

  if (!process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID) {
    console.warn('AdSense client ID not found');
    return null;
  }

  return (
    <div ref={ref} className={`ad-container ${className || ''}`}>
      {inView && (
        <ins
          className="adsbygoogle"
          style={style || { display: 'block', textAlign: 'center' }}
          data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID}
          data-ad-slot={slot}
          data-ad-format={format}
          data-full-width-responsive="true"
        />
      )}
    </div>
  );
} 