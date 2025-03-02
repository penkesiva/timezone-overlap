'use client';

import React, { useState, useEffect } from 'react';
import { DateTime } from 'luxon';
import { findTimezoneOption } from '@/app/utils/timezones';

interface EmbeddableWidgetProps {
  timezone1?: string;
  timezone2?: string;
  label1?: string;
  label2?: string;
  theme?: 'light' | 'dark';
  showDate?: boolean;
  compact?: boolean;
}

export default function EmbeddableWidget({
  timezone1 = 'America/New_York',
  timezone2 = 'Asia/Kolkata',
  label1 = '',
  label2 = '',
  theme = 'light',
  showDate = true,
  compact = false
}: EmbeddableWidgetProps) {
  const [currentTime, setCurrentTime] = useState<DateTime>(DateTime.now());
  
  // Use provided labels or get from timezone data
  const tz1Label = label1 || findTimezoneOption(timezone1).label;
  const tz2Label = label2 || findTimezoneOption(timezone2).label;
  
  // Update time every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(DateTime.now());
    }, 60000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Format the times
  const time1 = currentTime.setZone(timezone1);
  const time2 = currentTime.setZone(timezone2);
  
  const timeFormat = compact ? 'h:mm a' : 'h:mm:ss a';
  const dateFormat = 'EEE, MMM d';
  
  const getBgClass = () => {
    return theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-900';
  };
  
  const getBorderClass = () => {
    return theme === 'dark' ? 'border-gray-700' : 'border-gray-200';
  };
  
  return (
    <div 
      className={`timezone-widget font-sans ${getBgClass()} border ${getBorderClass()} rounded-lg shadow overflow-hidden`}
      style={{ maxWidth: compact ? '300px' : '400px' }}
    >
      <div className="p-3">
        <div className="flex justify-between items-center">
          <h3 className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>
            Timezone Comparison
          </h3>
          <a 
            href="https://timezoneoverlap.net" 
            target="_blank" 
            rel="noopener noreferrer"
            className={`text-xs ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'} hover:underline`}
          >
            timezoneoverlap.net
          </a>
        </div>
        
        <div className={`mt-3 grid ${compact ? 'grid-cols-1 gap-2' : 'grid-cols-2 gap-4'}`}>
          {/* First Timezone */}
          <div className={`p-2 rounded ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'}`}>
            <div className="flex flex-col">
              <span className={`text-xs font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                {tz1Label}
              </span>
              <span className="text-lg font-bold">
                {time1.toFormat(timeFormat)}
              </span>
              {showDate && (
                <span className={`text-xs mt-1 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                  {time1.toFormat(dateFormat)}
                </span>
              )}
            </div>
          </div>
          
          {/* Second Timezone */}
          <div className={`p-2 rounded ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'}`}>
            <div className="flex flex-col">
              <span className={`text-xs font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                {tz2Label}
              </span>
              <span className="text-lg font-bold">
                {time2.toFormat(timeFormat)}
              </span>
              {showDate && (
                <span className={`text-xs mt-1 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                  {time2.toFormat(dateFormat)}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 