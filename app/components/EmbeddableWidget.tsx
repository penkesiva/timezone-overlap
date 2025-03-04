'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { DateTime } from 'luxon';
import { findTimezoneOption } from '@/app/utils/timezones';
import { motion } from 'framer-motion';

interface EmbeddableWidgetProps {
  timezone1?: string;
  timezone2?: string;
  timezone3?: string;
  label1?: string;
  label2?: string;
  label3?: string;
  theme?: 'light' | 'dark';
  showDate?: boolean;
  compact?: boolean;
  workingHours1Start?: number;
  workingHours1End?: number;
  workingHours2Start?: number;
  workingHours2End?: number;
  workingHours3Start?: number;
  workingHours3End?: number;
  showWorkingHours?: boolean;
  meetingTimeStart?: number;
  meetingTimeEnd?: number;
  showMeetingTime?: boolean;
  showThirdTimezone?: boolean;
}

export default function EmbeddableWidget({
  timezone1 = 'America/New_York',
  timezone2 = 'Asia/Kolkata',
  timezone3 = 'Europe/London',
  label1 = '',
  label2 = '',
  label3 = '',
  theme = 'light',
  showDate = true,
  compact = false,
  workingHours1Start = 9,
  workingHours1End = 17,
  workingHours2Start = 9,
  workingHours2End = 17,
  workingHours3Start = 9,
  workingHours3End = 17,
  showWorkingHours = true,
  meetingTimeStart = 13,
  meetingTimeEnd = 14,
  showMeetingTime = true,
  showThirdTimezone = false
}: EmbeddableWidgetProps) {
  const [currentTime, setCurrentTime] = useState<DateTime>(DateTime.now());
  const [hoveredHour, setHoveredHour] = useState<number | null>(null);
  const [currentTheme, setCurrentTheme] = useState(theme);
  
  // Listen for theme changes in localStorage
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'theme' && e.newValue) {
        setCurrentTheme(e.newValue as 'light' | 'dark');
      }
    };
    
    // Handle theme change custom event
    const handleThemeChange = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail && customEvent.detail.theme) {
        setCurrentTheme(customEvent.detail.theme);
      }
    };
    
    // Also check localStorage on mount in case it's different from the prop
    const savedTheme = typeof window !== 'undefined' ? localStorage.getItem('theme') as 'light' | 'dark' | null : null;
    if (savedTheme && savedTheme !== theme) {
      setCurrentTheme(savedTheme);
    }
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('themeChange', handleThemeChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('themeChange', handleThemeChange);
    };
  }, [theme]);
  
  // Use provided labels or get from timezone data
  const tz1Label = label1 || findTimezoneOption(timezone1).label;
  const tz2Label = label2 || findTimezoneOption(timezone2).label;
  const tz3Label = label3 || findTimezoneOption(timezone3).label;
  
  // Limit location labels to 8 characters
  const shortTz1Label = tz1Label.substring(0, 8);
  const shortTz2Label = tz2Label.substring(0, 8);
  const shortTz3Label = tz3Label.substring(0, 8);
  
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
  const time3 = currentTime.setZone(timezone3);
  
  const timeFormat = 'h:mm a';
  const shortTimeFormat = 'h a'; // Shorter format for meeting times (without minutes)
  const dateFormat = 'EEE, MMM d';
  
  // Calculate hour difference between timezones
  const time1Hour = time1.hour + time1.minute / 60;
  const time2Hour = time2.hour + time2.minute / 60;
  const time3Hour = time3.hour + time3.minute / 60;
  const hourDiff = time2Hour - time1Hour;
  
  // Use provided working hours or load from localStorage
  const [workingHours1, setWorkingHours1] = useState(() => {
    // If props are provided, use them
    if (workingHours1Start !== undefined && workingHours1End !== undefined) {
      return { start: workingHours1Start, end: workingHours1End };
    }
    
    // Otherwise try to load from localStorage
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
    // If props are provided, use them
    if (workingHours2Start !== undefined && workingHours2End !== undefined) {
      return { start: workingHours2Start, end: workingHours2End };
    }
    
    // Otherwise try to load from localStorage
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
  
  const [workingHours3, setWorkingHours3] = useState(() => {
    // If props are provided, use them
    if (workingHours3Start !== undefined && workingHours3End !== undefined) {
      return { start: workingHours3Start, end: workingHours3End };
    }
    
    // Otherwise try to load from localStorage
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('workingHours3');
        if (saved) {
          return JSON.parse(saved);
        }
      } catch (e) {
        console.error('Error reading from localStorage:', e);
      }
    }
    return { start: 9, end: 17 };
  });
  
  // Update working hours when props change
  useEffect(() => {
    if (workingHours1Start !== undefined && workingHours1End !== undefined) {
      setWorkingHours1({ start: workingHours1Start, end: workingHours1End });
    }
    
    if (workingHours2Start !== undefined && workingHours2End !== undefined) {
      setWorkingHours2({ start: workingHours2Start, end: workingHours2End });
    }
    
    if (workingHours3Start !== undefined && workingHours3End !== undefined) {
      setWorkingHours3({ start: workingHours3Start, end: workingHours3End });
    }
  }, [workingHours1Start, workingHours1End, workingHours2Start, workingHours2End, workingHours3Start, workingHours3End]);
  
  // Generate time slots for the grid (hour increments)
  const timeSlots = Array.from({ length: 24 }, (_, i) => i);
  
  // Get current time decimal for time indicator
  const getCurrentTimeDecimal = useCallback(() => {
    const now = time1;
    return now.hour + now.minute / 60;
  }, [time1]);
  
  const currentTimeDecimal = getCurrentTimeDecimal();
  
  const getBgClass = () => {
    return currentTheme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-900';
  };
  
  const getBorderClass = () => {
    return currentTheme === 'dark' ? 'border-gray-700' : 'border-gray-200';
  };
  
  // Calculate if two working hours overlap at a given hour
  const isOverlapping = (hour: number) => {
    if (!showWorkingHours) return false;
    
    // Convert to total minutes for both locations
    const time1TotalMinutes = hour * 60;
    const time2HourDecimal = (hour + hourDiff + 24) % 24;
    const time2TotalMinutes = time2HourDecimal * 60;
    
    // Convert working hours to total minutes
    const workingStart1 = workingHours1.start * 60;
    const workingEnd1 = workingHours1.end * 60;
    const workingStart2 = workingHours2.start * 60;
    const workingEnd2 = workingHours2.end * 60;
    
    // Check if both are working hours
    const isWorkingHour1 = (
      workingHours1.start <= workingHours1.end
        ? time1TotalMinutes >= workingStart1 && time1TotalMinutes < workingEnd1
        : time1TotalMinutes >= workingStart1 || time1TotalMinutes < workingEnd1
    );
    
    const isWorkingHour2 = (
      workingHours2.start <= workingHours2.end
        ? time2TotalMinutes >= workingStart2 && time2TotalMinutes < workingEnd2
        : time2TotalMinutes >= workingStart2 || time2TotalMinutes < workingEnd2
    );
    
    return isWorkingHour1 && isWorkingHour2;
  };
  
  // Determine colors based on theme
  const getLocation1Color = () => {
    return currentTheme === 'dark' ? 'bg-blue-500/50' : 'bg-blue-200';
  };
  
  const getLocation2Color = () => {
    return currentTheme === 'dark' ? 'bg-purple-500/50' : 'bg-purple-200';
  };
  
  const getLocation3Color = () => {
    return currentTheme === 'dark' ? 'bg-green-500/50' : 'bg-green-200';
  };
  
  const getMeetingTimeColor = () => {
    return currentTheme === 'dark' ? 'bg-amber-500/50' : 'bg-amber-200';
  };
  
  // Check if current hour is meeting time
  const isMeetingTime = (hour: number) => {
    if (!showMeetingTime) return false;
    
    return meetingTimeStart <= meetingTimeEnd
      ? hour >= meetingTimeStart && hour < meetingTimeEnd
      : hour >= meetingTimeStart || hour < meetingTimeEnd;
  };
  
  return (
    <div 
      className={`timezone-widget font-sans ${getBgClass()} border ${getBorderClass()} rounded-lg shadow overflow-hidden`}
      style={{ maxWidth: compact ? '320px' : '400px' }}
    >
      <div className="p-3">
        <div className="flex justify-between items-center">
          <h3 className={`text-sm font-medium ${currentTheme === 'dark' ? 'text-gray-200' : 'text-gray-500'}`}>
            Timezone Comparison
          </h3>
          <a 
            href="https://timezoneoverlap.net" 
            target="_blank" 
            rel="noopener noreferrer"
            className={`text-xs ${currentTheme === 'dark' ? 'text-blue-300 hover:text-blue-200' : 'text-blue-600 hover:text-blue-700'} hover:underline`}
          >
            timezoneoverlap.net
          </a>
        </div>
        
        <div className={`mt-3 grid ${compact ? 'grid-cols-1 gap-2' : 'grid-cols-2 gap-4'}`}>
          {/* First Timezone */}
          <div className={`p-2 rounded ${currentTheme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'}`}>
            <div className="flex flex-col">
              <span className={`text-xs font-medium ${currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                {shortTz1Label}
              </span>
              {/* Meeting time takes prominence */}
              {showMeetingTime && (
                <div className="mb-1">
                  <span className={`text-lg font-bold ${currentTheme === 'dark' ? 'text-amber-300' : 'text-amber-600'}`}>
                    {time1.set({ hour: meetingTimeStart, minute: 0 }).toFormat(shortTimeFormat)} - {time1.set({ hour: meetingTimeEnd, minute: 0 }).toFormat(shortTimeFormat)}
                  </span>
                  <span className={`text-xs font-medium block ${currentTheme === 'dark' ? 'text-amber-300/80' : 'text-amber-600/80'}`}>Meeting Time</span>
                </div>
              )}
              {/* Current time is secondary */}
              <span className={`${showMeetingTime ? 'text-sm' : 'text-lg'} ${showMeetingTime ? '' : 'font-bold'} ${currentTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Current: {time1.toFormat(timeFormat)}
              </span>
              {showDate && (
                <span className={`text-xs mt-1 ${currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                  {time1.toFormat(dateFormat)}
                </span>
              )}
            </div>
          </div>
          
          {/* Second Timezone */}
          <div className={`p-2 rounded ${currentTheme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'}`}>
            <div className="flex flex-col">
              <span className={`text-xs font-medium ${currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                {shortTz2Label}
              </span>
              {/* Meeting time takes prominence */}
              {showMeetingTime && (
                <div className="mb-1">
                  <span className={`text-lg font-bold ${currentTheme === 'dark' ? 'text-amber-300' : 'text-amber-600'}`}>
                    {time2.set({ hour: (meetingTimeStart + hourDiff + 24) % 24, minute: 0 }).toFormat(shortTimeFormat)} - {time2.set({ hour: (meetingTimeEnd + hourDiff + 24) % 24, minute: 0 }).toFormat(shortTimeFormat)}
                  </span>
                  <span className={`text-xs font-medium block ${currentTheme === 'dark' ? 'text-amber-300/80' : 'text-amber-600/80'}`}>Meeting Time</span>
                </div>
              )}
              {/* Current time is secondary */}
              <span className={`${showMeetingTime ? 'text-sm' : 'text-lg'} ${showMeetingTime ? '' : 'font-bold'} ${currentTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Current: {time2.toFormat(timeFormat)}
              </span>
              {showDate && (
                <span className={`text-xs mt-1 ${currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                  {time2.toFormat(dateFormat)}
                </span>
              )}
            </div>
          </div>
          
          {/* Third Timezone (Optional) */}
          {showThirdTimezone && (
            <div className={`p-2 rounded ${currentTheme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'} ${compact ? '' : 'col-span-2'}`}>
              <div className="flex flex-col">
                <span className={`text-xs font-medium ${currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                  {shortTz3Label}
                </span>
                {/* Meeting time takes prominence */}
                {showMeetingTime && (
                  <div className="mb-1">
                    <span className={`text-lg font-bold ${currentTheme === 'dark' ? 'text-amber-300' : 'text-amber-600'}`}>
                      {time3.set({ hour: (meetingTimeStart + (time3Hour - time1Hour) + 24) % 24, minute: 0 }).toFormat(shortTimeFormat)} - {time3.set({ hour: (meetingTimeEnd + (time3Hour - time1Hour) + 24) % 24, minute: 0 }).toFormat(shortTimeFormat)}
                    </span>
                    <span className={`text-xs font-medium block ${currentTheme === 'dark' ? 'text-amber-300/80' : 'text-amber-600/80'}`}>Meeting Time</span>
                  </div>
                )}
                {/* Current time is secondary */}
                <span className={`${showMeetingTime ? 'text-sm' : 'text-lg'} ${showMeetingTime ? '' : 'font-bold'} ${currentTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  Current: {time3.toFormat(timeFormat)}
                </span>
                {showDate && (
                  <span className={`text-xs mt-1 ${currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                    {time3.toFormat(dateFormat)}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
        
        {/* Time Grid Visualization (Modern UX) */}
        <div className={`mt-4 relative ${currentTheme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'} p-3 rounded`}>
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
              {/* Timezone labels - removing these as requested */}
              {/* <div className={`absolute left-0 h-full grid grid-rows-2 text-xs z-10 ${compact ? 'hidden' : ''}`}>
                <div className={`flex items-center ${currentTheme === 'dark' ? 'text-blue-300' : 'text-blue-600'}`}>
                  <div className="w-2 h-2 rounded-full bg-blue-500 mr-1"></div>
                  <span>{shortTz1Label}</span>
                </div>
                <div className={`flex items-center ${currentTheme === 'dark' ? 'text-purple-300' : 'text-purple-600'}`}>
                  <div className="w-2 h-2 rounded-full bg-purple-500 mr-1"></div>
                  <span>{shortTz2Label}</span>
                </div>
              </div> */}
              
              {/* Removed ml-[70px] to use full width since location index is gone */}
              <div className="w-full">
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
                    const isWorkingHour1 = showWorkingHours && (
                      workingHours1.start <= workingHours1.end
                        ? time1TotalMinutes >= workingStart1 && time1TotalMinutes < workingEnd1
                        : time1TotalMinutes >= workingStart1 || time1TotalMinutes < workingEnd1
                    );
                    
                    const isOverlap = isOverlapping(timeSlot);
                    const isMeetingHour = isMeetingTime(timeSlot);
                    
                    // Format the time for this slot
                    const slotDateTime = DateTime.fromObject({ hour: Math.floor(timeSlot), minute: (timeSlot % 1) * 60 }).setZone(timezone1);
                    const slotTimeString = slotDateTime.toFormat('h:mm a');

                    return (
                      <div
                        key={`loc1-${timeSlot}`}
                        className={`relative h-full ${timeSlot % 1 === 0 ? 'border-r border-gray-700/30' : ''}`}
                        onMouseEnter={() => setHoveredHour(timeSlot)}
                        onMouseLeave={() => setHoveredHour(null)}
                      >
                        <div
                          className={`h-full ${
                            isMeetingHour ? getMeetingTimeColor() : 
                            isWorkingHour1 ? getLocation1Color() : 'bg-opacity-0'
                          }`}
                        />
                        {hoveredHour === timeSlot && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="absolute top-0 left-0 right-0 h-full bg-white bg-opacity-20 z-10"
                          >
                            <div className="absolute top-[-20px] left-[-10px] bg-gray-800 text-white text-xs p-1 rounded whitespace-nowrap z-20">
                              {slotTimeString}
                            </div>
                          </motion.div>
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
                    const isWorkingHour2 = showWorkingHours && (
                      workingHours2.start <= workingHours2.end
                        ? time2TotalMinutes >= workingStart2 && time2TotalMinutes < workingEnd2
                        : time2TotalMinutes >= workingStart2 || time2TotalMinutes < workingEnd2
                    );
                    
                    const isOverlap = isOverlapping(timeSlot);
                    const isMeetingHour = isMeetingTime(timeSlot);
                    
                    // Format the time for this slot in timezone2
                    const slotDateTime = DateTime.fromObject({ hour: Math.floor(time2HourDecimal), minute: (time2HourDecimal % 1) * 60 }).setZone(timezone2);
                    const slotTimeString = slotDateTime.toFormat('h:mm a');

                    return (
                      <div
                        key={`loc2-${timeSlot}`}
                        className={`relative h-full ${timeSlot % 1 === 0 ? 'border-r border-gray-700/30' : ''}`}
                        onMouseEnter={() => setHoveredHour(timeSlot)}
                        onMouseLeave={() => setHoveredHour(null)}
                      >
                        <div
                          className={`h-full ${
                            isMeetingHour ? getMeetingTimeColor() : 
                            isWorkingHour2 ? getLocation2Color() : 'bg-opacity-0'
                          }`}
                        />
                        {hoveredHour === timeSlot && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="absolute top-0 left-0 right-0 h-full bg-white bg-opacity-20 z-10"
                          >
                            <div className="absolute bottom-[-20px] left-[-10px] bg-gray-800 text-white text-xs p-1 rounded whitespace-nowrap z-20">
                              {slotTimeString}
                            </div>
                          </motion.div>
                        )}
                      </div>
                    );
                  })}
                </div>
                
                {/* Third location row (optional) */}
                {showThirdTimezone && (
                  <div className="grid grid-cols-[repeat(24,minmax(0,1fr))] gap-0 h-[35px] border-t border-gray-700">
                    {timeSlots.map((timeSlot) => {
                      const hourDiff3 = time3Hour - time1Hour;
                      const time3HourDecimal = (timeSlot + hourDiff3 + 24) % 24;
                      
                      // Convert to hours for working hours check
                      const time3TotalMinutes = time3HourDecimal * 60;
                      
                      // Convert working hours to total minutes for comparison
                      const workingStart3 = workingHours3.start * 60;
                      const workingEnd3 = workingHours3.end * 60;
                      
                      // Check if working hour
                      const isWorkingHour3 = showWorkingHours && (
                        workingHours3.start <= workingHours3.end
                          ? time3TotalMinutes >= workingStart3 && time3TotalMinutes < workingEnd3
                          : time3TotalMinutes >= workingStart3 || time3TotalMinutes < workingEnd3
                      );
                      
                      const isMeetingHour = isMeetingTime(timeSlot);
                      
                      // Format the time for this slot in timezone3
                      const slotDateTime = DateTime.fromObject({ hour: Math.floor(time3HourDecimal), minute: (time3HourDecimal % 1) * 60 }).setZone(timezone3);
                      const slotTimeString = slotDateTime.toFormat('h:mm a');

                      return (
                        <div
                          key={`loc3-${timeSlot}`}
                          className={`relative h-full ${timeSlot % 1 === 0 ? 'border-r border-gray-700/30' : ''}`}
                          onMouseEnter={() => setHoveredHour(timeSlot)}
                          onMouseLeave={() => setHoveredHour(null)}
                        >
                          <div
                            className={`h-full ${
                              isMeetingHour ? getMeetingTimeColor() : 
                              isWorkingHour3 ? getLocation3Color() : 'bg-opacity-0'
                            }`}
                          />
                          {hoveredHour === timeSlot && (
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className="absolute top-0 left-0 right-0 h-full bg-white bg-opacity-20 z-10"
                            >
                              <div className="absolute bottom-[-20px] left-[-10px] bg-gray-800 text-white text-xs p-1 rounded whitespace-nowrap z-20">
                                {slotTimeString}
                              </div>
                            </motion.div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
            
            {/* Add legend for the working hours colors if showing working hours */}
            {showWorkingHours && (
              <div className="mt-2 pt-2 border-t border-gray-700 grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center">
                  <div className={`w-3 h-3 mr-1 rounded ${getLocation1Color()}`}></div>
                  <span className={currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
                    {shortTz1Label} hrs
                  </span>
                </div>
                <div className="flex items-center">
                  <div className={`w-3 h-3 mr-1 rounded ${getLocation2Color()}`}></div>
                  <span className={currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
                    {shortTz2Label} hrs
                  </span>
                </div>
                {showThirdTimezone && (
                  <div className="flex items-center">
                    <div className={`w-3 h-3 mr-1 rounded ${getLocation3Color()}`}></div>
                    <span className={currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
                      {shortTz3Label} hrs
                    </span>
                  </div>
                )}
                {showMeetingTime && (
                  <div className={`flex items-center ${showThirdTimezone ? '' : 'col-span-2'}`}>
                    <div className={`w-3 h-3 mr-1 rounded ${getMeetingTimeColor()}`}></div>
                    <span className={`font-medium ${currentTheme === 'dark' ? 'text-amber-300' : 'text-amber-600'}`}>Meeting Time</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}