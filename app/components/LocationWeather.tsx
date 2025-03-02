'use client';

import { useState, useEffect } from 'react';
import { SunIcon, CloudIcon, CloudIcon as RainIcon, SunIcon as SnowIcon, BoltIcon } from '@heroicons/react/24/outline';
import useSWR from 'swr';

interface WeatherInfo {
  temp: number;
  condition: string;
  icon: string;
}

interface LocationWeatherProps {
  locationName: string;
  timezone: string;
  className?: string;
}

// Helper function to extract city name from location label
const extractCityFromLabel = (label: string): string | null => {
  if (!label) return null;
  
  // Extract the first city mentioned in the label
  // Example: "USA - New York, Miami (ET)" -> "New York"
  const match = label.match(/[^-]+ - ([^,]+)/);
  if (match && match[1]) {
    return match[1].trim();
  }
  
  // If no match using the pattern above, try to get the first part before any comma or parenthesis
  const fallbackMatch = label.split(/[,(]/)[0].trim();
  return fallbackMatch || null;
};

// Fetcher function for SWR
const fetcher = async (url: string) => {
  try {
    // Create a timeout promise
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Weather request timeout')), 3000);
    });
    
    // Create the fetch promise
    const fetchPromise = fetch(url);
    
    // Race the promises
    const res = await Promise.race([fetchPromise, timeoutPromise]) as Response;
    
    if (!res.ok) {
      throw new Error('Weather data fetch failed');
    }
    return res.json();
  } catch (error) {
    console.error('Weather fetch error:', error);
    return null;
  }
};

export default function LocationWeather({ locationName, timezone, className = '' }: LocationWeatherProps) {
  const city = extractCityFromLabel(locationName);
  const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
  const isApiKeyValid = apiKey && apiKey !== 'YOUR_API_KEY_HERE';
  
  const { data, error, isLoading } = useSWR(
    city && isApiKeyValid
      ? `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
      : null,
    fetcher,
    { 
      revalidateOnFocus: false,
      refreshInterval: 30 * 60 * 1000, // Refresh every 30 minutes
      dedupingInterval: 5 * 60 * 1000, // Dedupe requests within 5 minutes
      errorRetryCount: 2, // Only retry twice
      errorRetryInterval: 5000, // Wait 5 seconds between retries
      suspense: false, // Don't use Suspense to prevent blocking
      fallbackData: null, // Use null as fallback data
    }
  );
  
  const getWeatherIcon = () => {
    if (!data || error) {
      return <CloudIcon className="h-5 w-5 text-gray-400" />;
    }
    
    const condition = data.weather[0].main.toLowerCase();
    
    if (condition.includes('clear')) {
      return <SunIcon className="h-5 w-5 text-yellow-400" />;
    } else if (condition.includes('cloud')) {
      return <CloudIcon className="h-5 w-5 text-gray-400" />;
    } else if (condition.includes('rain') || condition.includes('drizzle')) {
      return <RainIcon className="h-5 w-5 text-blue-400" />;
    } else if (condition.includes('snow')) {
      return <SnowIcon className="h-5 w-5 text-white" />;
    } else if (condition.includes('thunderstorm')) {
      return <BoltIcon className="h-5 w-5 text-yellow-500" />;
    }
    
    return <CloudIcon className="h-5 w-5 text-gray-400" />;
  };

  // If API key is not set or invalid, show a minimal component
  if (!isApiKeyValid || !city) {
    return (
      <div className={`flex items-center space-x-1 ${className}`}>
        <CloudIcon className="h-5 w-5 text-gray-400" />
        <span className="text-xs text-gray-400">Weather unavailable</span>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className={`flex items-center space-x-1 ${className}`}>
        <CloudIcon className="h-5 w-5 text-gray-400 animate-pulse" />
        <span className="text-xs text-gray-400">Loading weather...</span>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className={`flex items-center space-x-1 ${className}`}>
        <CloudIcon className="h-5 w-5 text-gray-400" />
        <span className="text-xs text-gray-400">Weather unavailable</span>
      </div>
    );
  }

  return (
    <div className={`flex items-center space-x-1 ${className}`}>
      {getWeatherIcon()}
      <span className="text-xs font-medium">{Math.round(data.main.temp)}°C</span>
      <span className="text-xs text-gray-400">{data.weather[0].main}</span>
    </div>
  );
} 