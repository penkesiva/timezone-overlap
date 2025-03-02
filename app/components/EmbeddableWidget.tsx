'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { DateTime } from 'luxon';
import { findTimezoneOption } from '@/app/utils/timezones';
import { motion } from 'framer-motion';

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
  const [hoveredHour, setHoveredHour] = useState<number | null>(null);
  
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
  
  const timeFormat = 'h:mm a';
  const dateFormat = 'EEE, MMM d';
  
  // Calculate hour difference between timezones
  const time1Hour = time1.hour + time1.minute / 60;
  const time2Hour = time2.hour + time2.minute / 60;
  const hourDiff = time2Hour - time1Hour;
  
  // Default working hours (9 AM to 5 PM for both locations)
  const [workingHours1, setWorkingHours1] = useState(() => {
    // Try to load from localStorage
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('workingHours1');
        if (saved) {
          return JSON.parse(saved);
        }
      } catch (e) {
        console.error('Error reading from localStorage:', e);
      }
    }
    return { start: 9, end: 17 };
  });
  
  const [workingHours2, setWorkingHours2] = useState(() => {
    // Try to load from localStorage
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('workingHours2');
        if (saved) {
          return JSON.parse(saved);
        }
      } catch (e) {
        console.error('Error reading from localStorage:', e);
      }
    }
    return { start: 9, end: 17 };
  });
  
  // Generate time slots for the grid (hour increments)
  const timeSlots = Array.from({ length: 24 }, (_, i) => i);
  
  // Get current time decimal for time indicator
  const getCurrentTimeDecimal = useCallback(() => {
    const now = time1;
    return now.hour + now.minute / 60;
  }, [time1]);
  
  const currentTimeDecimal = getCurrentTimeDecimal();
  
  const getBgClass = () => {
    return theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-900';
  };
  
  const getBorderClass = () => {
    return theme === 'dark' ? 'border-gray-700' : 'border-gray-200';
  };
  
  return (
    <div 
      className={`timezone-widget font-sans ${getBgClass()} border ${getBorderClass()} rounded-lg shadow overflow-hidden`}
      style={{ maxWidth: compact ? '320px' : '400px' }}
    >
      <div className="p-3">
        <div className="flex justify-between items-center">
          <h3 className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-500'}`}>
            Timezone Comparison
          </h3>
          <a 
            href="https://timezoneoverlap.net" 
            target="_blank" 
            rel="noopener noreferrer"
            className={`text-xs ${theme === 'dark' ? 'text-blue-300 hover:text-blue-200' : 'text-blue-600 hover:text-blue-700'} hover:underline`}
          >
            timezoneoverlap.net
          </a>
        </div>
        
        <div className={`mt-3 grid ${compact ? 'grid-cols-1 gap-2' : 'grid-cols-2 gap-4'}`}>
          {/* First Timezone */}
          <div className={`p-2 rounded ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'}`}>
            <div className="flex flex-col">
              <span className={`text-xs font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                {tz1Label}
              </span>
              <span className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {time1.toFormat(timeFormat)}
              </span>
              {showDate && (
                <span className={`text-xs mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                  {time1.toFormat(dateFormat)}
                </span>
              )}
            </div>
          </div>
          
          {/* Second Timezone */}
          <div className={`p-2 rounded ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'}`}>
            <div className="flex flex-col">
              <span className={`text-xs font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                {tz2Label}
              </span>
              <span className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {time2.toFormat(timeFormat)}
              </span>
              {showDate && (
                <span className={`text-xs mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                  {time2.toFormat(dateFormat)}
                </span>
              )}
            </div>
          </div>
        </div>
        
        {/* Time Grid Visualization (Modern UX) */}
        <div className={`mt-4 relative ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'} p-3 rounded`}>
          <div className="min-h-[70px]">
            {/* Time indicator line */}
            <div 
              className="absolute top-0 bottom-0 w-[2px] bg-red-500 z-20"
              style={{ 
                left: `${(currentTimeDecimal / 24) * 100}%`,
                height: '100%'
              }}
            />
            
            {/* Time grid */}
            <div className="relative h-[70px]">
              {/* Timezone labels */}
              <div className="absolute left-0 h-full grid grid-rows-2 text-xs z-10">
                <div className={`flex items-center ${theme === 'dark' ? 'text-blue-300' : 'text-blue-600'}`}>
                  <div className="w-2 h-2 rounded-full bg-blue-500 mr-1"></div>
                  <span>{tz1Label.substring(0, compact ? 10 : 15)}</span>
                </div>
                <div className={`flex items-center ${theme === 'dark' ? 'text-purple-300' : 'text-purple-600'}`}>
                  <div className="w-2 h-2 rounded-full bg-purple-500 mr-1"></div>
                  <span>{tz2Label.substring(0, compact ? 10 : 15)}</span>
                </div>
              </div>
              
              <div className="ml-[70px]">
                {/* First location row */}
                <div className="grid grid-cols-[repeat(24,minmax(0,1fr))] gap-0 border-b border-gray-700 h-[35px]">
                  {timeSlots.map((timeSlot) => {
                    const time1HourDecimal = timeSlot;
                    
                    // Convert to hours for working hours check
                    const time1TotalMinutes = time1HourDecimal * 60;
                    
                    // Convert working hours to total minutes for comparison
                    const workingStart1 = workingHours1.start * 60;
                    const workingEnd1 = workingHours1.end * 60;
                    
                    // Check if working hour
                    const isWorkingHour1 = (
                      workingHours1.start <= workingHours1.end
                        ? time1TotalMinutes >= workingStart1 && time1TotalMinutes < workingEnd1
                        : time1TotalMinutes >= workingStart1 || time1TotalMinutes < workingEnd1
                    );

                    return (
                      <div
                        key={`loc1-${timeSlot}`}
                        className={`relative h-full ${timeSlot % 1 === 0 ? 'border-r border-gray-700/30' : ''}`}
                        onMouseEnter={() => setHoveredHour(timeSlot)}
                        onMouseLeave={() => setHoveredHour(null)}
                      >
                        <div
                          className={`h-full ${
                            isWorkingHour1 ? 'bg-blue-500/50' : 'bg-opacity-0'
                          }`}
                        />
                        {hoveredHour === timeSlot && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="absolute top-0 left-0 right-0 h-full bg-white bg-opacity-20 z-10"
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
                
                {/* Second location row */}
                <div className="grid grid-cols-[repeat(24,minmax(0,1fr))] gap-0 h-[35px]">
                  {timeSlots.map((timeSlot) => {
                    const time2HourDecimal = (timeSlot + hourDiff + 24) % 24;
                    
                    // Convert to hours for working hours check
                    const time2TotalMinutes = time2HourDecimal * 60;
                    
                    // For overlap calculation, we also need time1 info for this slot
                    const time1HourDecimal = timeSlot;
                    const time1TotalMinutes = time1HourDecimal * 60;
                    
                    // Convert working hours to total minutes for comparison
                    const workingStart2 = workingHours2.start * 60;
                    const workingEnd2 = workingHours2.end * 60;
                    const workingStart1 = workingHours1.start * 60;
                    const workingEnd1 = workingHours1.end * 60;
                    
                    // Check if working hour
                    const isWorkingHour2 = (
                      workingHours2.start <= workingHours2.end
                        ? time2TotalMinutes >= workingStart2 && time2TotalMinutes < workingEnd2
                        : time2TotalMinutes >= workingStart2 || time2TotalMinutes < workingEnd2
                    );
                    
                    // Check if there's overlap
                    const isWorkingHour1 = (
                      workingHours1.start <= workingHours1.end
                        ? time1TotalMinutes >= workingStart1 && time1TotalMinutes < workingEnd1
                        : time1TotalMinutes >= workingStart1 || time1TotalMinutes < workingEnd1
                    );
                    const isOverlap = isWorkingHour1 && isWorkingHour2;

                    return (
                      <div
                        key={`loc2-${timeSlot}`}
                        className={`relative h-full ${timeSlot % 1 === 0 ? 'border-r border-gray-700/30' : ''}`}
                        onMouseEnter={() => setHoveredHour(timeSlot)}
                        onMouseLeave={() => setHoveredHour(null)}
                      >
                        <div
                          className={`h-full ${
                            isWorkingHour2 ? 'bg-purple-500/50' : 'bg-opacity-0'
                          }`}
                        />
                        {isOverlap && (
                          <div className="absolute inset-0 bg-white bg-opacity-20" />
                        )}
                        {hoveredHour === timeSlot && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="absolute top-0 left-0 right-0 h-full bg-white bg-opacity-20 z-10"
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            
            {/* Hover tooltip */}
            {hoveredHour !== null && (
              <div 
                className={`absolute -top-8 transform bg-gray-800 px-2 py-1 rounded text-xs whitespace-nowrap shadow-lg z-20 ${theme === 'dark' ? 'text-white' : 'text-white'}`}
                style={{ left: `${(hoveredHour / 24) * 100 + 70}px` }}
              >
                <span className="font-mono tabular-nums text-blue-300">
                  {time1.set({ hour: Math.floor(hoveredHour), minute: 0, second: 0 }).toFormat('h:mm a')}
                </span>
                {' / '}
                <span className="font-mono tabular-nums text-purple-300">
                  {time2.set({ 
                    hour: Math.floor((hoveredHour + hourDiff + 24) % 24), 
                    minute: 0, 
                    second: 0 
                  }).toFormat('h:mm a')}
                </span>
              </div>
            )}
            
            {/* Time markers */}
            <div className={`absolute bottom-0 left-[70px] right-0 flex justify-between text-[10px] ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
              <span>12am</span>
              <span>6am</span>
              <span>12pm</span>
              <span>6pm</span>
              <span>12am</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}