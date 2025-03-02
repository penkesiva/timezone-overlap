'use client';

import { useState, useEffect, useCallback } from 'react';
import { DateTime } from 'luxon';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { ClockIcon, ClipboardIcon, CheckIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { Suspense } from 'react';
import type { GroupBase } from 'react-select';
import type { ActionMeta } from 'react-select';
import { useSwipeable } from 'react-swipeable';

interface TimezoneOption {
  readonly value: string;
  readonly label: string;
  readonly group: string;
}

// All major timezones with their proper names
const allTimezones: TimezoneOption[] = [
  // Asia
  { value: 'Asia/Kolkata', label: 'India - New Delhi, Mumbai', group: 'Asia' },
  { value: 'Asia/Dubai', label: 'UAE - Dubai, Abu Dhabi', group: 'Asia' },
  { value: 'Asia/Tokyo', label: 'Japan - Tokyo, Osaka', group: 'Asia' },
  { value: 'Asia/Shanghai', label: 'China - Shanghai, Beijing', group: 'Asia' },
  { value: 'Asia/Singapore', label: 'Singapore', group: 'Asia' },
  { value: 'Asia/Seoul', label: 'South Korea - Seoul', group: 'Asia' },
  { value: 'Asia/Hong_Kong', label: 'Hong Kong', group: 'Asia' },
  { value: 'Asia/Jakarta', label: 'Indonesia - Jakarta', group: 'Asia' },
  { value: 'Asia/Manila', label: 'Philippines - Manila', group: 'Asia' },
  { value: 'Asia/Bangkok', label: 'Thailand - Bangkok', group: 'Asia' },
  { value: 'Asia/Karachi', label: 'Pakistan - Karachi, Islamabad', group: 'Asia' },
  { value: 'Asia/Dhaka', label: 'Bangladesh - Dhaka', group: 'Asia' },
  { value: 'Asia/Riyadh', label: 'Saudi Arabia - Riyadh', group: 'Asia' },
  { value: 'Asia/Tel_Aviv', label: 'Israel - Tel Aviv', group: 'Asia' },
  { value: 'Asia/Tehran', label: 'Iran - Tehran', group: 'Asia' },
  { value: 'Asia/Baghdad', label: 'Iraq - Baghdad', group: 'Asia' },
  { value: 'Asia/Kuala_Lumpur', label: 'Malaysia - Kuala Lumpur', group: 'Asia' },
  { value: 'Asia/Ho_Chi_Minh', label: 'Vietnam - Ho Chi Minh City', group: 'Asia' },

  // Americas - North
  { value: 'America/New_York', label: 'USA - New York, Miami (ET)', group: 'Americas - North' },
  { value: 'America/Los_Angeles', label: 'USA - Los Angeles, San Francisco (PT)', group: 'Americas - North' },
  { value: 'America/Chicago', label: 'USA - Chicago, Houston (CT)', group: 'Americas - North' },
  { value: 'America/Denver', label: 'USA - Denver, Phoenix (MT)', group: 'Americas - North' },
  { value: 'America/Toronto', label: 'Canada - Toronto, Ottawa', group: 'Americas - North' },
  { value: 'America/Vancouver', label: 'Canada - Vancouver', group: 'Americas - North' },
  { value: 'America/Montreal', label: 'Canada - Montreal', group: 'Americas - North' },
  { value: 'America/Mexico_City', label: 'Mexico - Mexico City', group: 'Americas - North' },

  // Americas - South & Central
  { value: 'America/Sao_Paulo', label: 'Brazil - São Paulo, Rio de Janeiro', group: 'Americas - South' },
  { value: 'America/Buenos_Aires', label: 'Argentina - Buenos Aires', group: 'Americas - South' },
  { value: 'America/Santiago', label: 'Chile - Santiago', group: 'Americas - South' },
  { value: 'America/Lima', label: 'Peru - Lima', group: 'Americas - South' },
  { value: 'America/Bogota', label: 'Colombia - Bogotá', group: 'Americas - South' },
  { value: 'America/Caracas', label: 'Venezuela - Caracas', group: 'Americas - South' },
  { value: 'America/Panama', label: 'Panama City', group: 'Americas - South' },

  // Europe - Western
  { value: 'Europe/London', label: 'UK - London, Manchester', group: 'Europe - Western' },
  { value: 'Europe/Paris', label: 'France - Paris', group: 'Europe - Western' },
  { value: 'Europe/Berlin', label: 'Germany - Berlin, Munich', group: 'Europe - Western' },
  { value: 'Europe/Rome', label: 'Italy - Rome, Milan', group: 'Europe - Western' },
  { value: 'Europe/Madrid', label: 'Spain - Madrid, Barcelona', group: 'Europe - Western' },
  { value: 'Europe/Amsterdam', label: 'Netherlands - Amsterdam', group: 'Europe - Western' },
  { value: 'Europe/Brussels', label: 'Belgium - Brussels', group: 'Europe - Western' },
  { value: 'Europe/Zurich', label: 'Switzerland - Zurich, Geneva', group: 'Europe - Western' },
  { value: 'Europe/Dublin', label: 'Ireland - Dublin', group: 'Europe - Western' },
  { value: 'Europe/Lisbon', label: 'Portugal - Lisbon', group: 'Europe - Western' },

  // Europe - Eastern & Northern
  { value: 'Europe/Stockholm', label: 'Sweden - Stockholm', group: 'Europe - Eastern' },
  { value: 'Europe/Oslo', label: 'Norway - Oslo', group: 'Europe - Eastern' },
  { value: 'Europe/Copenhagen', label: 'Denmark - Copenhagen', group: 'Europe - Eastern' },
  { value: 'Europe/Warsaw', label: 'Poland - Warsaw', group: 'Europe - Eastern' },
  { value: 'Europe/Budapest', label: 'Hungary - Budapest', group: 'Europe - Eastern' },
  { value: 'Europe/Vienna', label: 'Austria - Vienna', group: 'Europe - Eastern' },
  { value: 'Europe/Prague', label: 'Czech Republic - Prague', group: 'Europe - Eastern' },
  { value: 'Europe/Moscow', label: 'Russia - Moscow', group: 'Europe - Eastern' },
  { value: 'Europe/Athens', label: 'Greece - Athens', group: 'Europe - Eastern' },
  { value: 'Europe/Istanbul', label: 'Turkey - Istanbul', group: 'Europe - Eastern' },

  // Oceania
  { value: 'Australia/Sydney', label: 'Australia - Sydney, Canberra', group: 'Oceania' },
  { value: 'Australia/Melbourne', label: 'Australia - Melbourne', group: 'Oceania' },
  { value: 'Australia/Brisbane', label: 'Australia - Brisbane', group: 'Oceania' },
  { value: 'Australia/Perth', label: 'Australia - Perth', group: 'Oceania' },
  { value: 'Australia/Adelaide', label: 'Australia - Adelaide', group: 'Oceania' },
  { value: 'Pacific/Auckland', label: 'New Zealand - Auckland', group: 'Oceania' },
  { value: 'Pacific/Fiji', label: 'Fiji - Suva', group: 'Oceania' },

  // Africa
  { value: 'Africa/Cairo', label: 'Egypt - Cairo', group: 'Africa' },
  { value: 'Africa/Johannesburg', label: 'South Africa - Johannesburg', group: 'Africa' },
  { value: 'Africa/Lagos', label: 'Nigeria - Lagos', group: 'Africa' },
  { value: 'Africa/Nairobi', label: 'Kenya - Nairobi', group: 'Africa' },
  { value: 'Africa/Casablanca', label: 'Morocco - Casablanca', group: 'Africa' },
  { value: 'Africa/Accra', label: 'Ghana - Accra', group: 'Africa' },
  { value: 'Africa/Addis_Ababa', label: 'Ethiopia - Addis Ababa', group: 'Africa' },
  { value: 'Africa/Dar_es_Salaam', label: 'Tanzania - Dar es Salaam', group: 'Africa' },
  { value: 'Africa/Khartoum', label: 'Sudan - Khartoum', group: 'Africa' },
  { value: 'Africa/Algiers', label: 'Algeria - Algiers', group: 'Africa' }
].sort((a, b) => a.label.localeCompare(b.label));

// Group timezones by continent/region
const groupedTimeZones = allTimezones.reduce<Record<string, TimezoneOption[]>>((acc, zone) => {
  if (!acc[zone.group]) {
    acc[zone.group] = [];
  }
  acc[zone.group].push(zone);
  return acc;
}, {});

// Format for react-select
const groupOptions: GroupBase<TimezoneOption>[] = Object.entries(groupedTimeZones)
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([group, zones]) => ({
    label: group,
    options: zones
  }));

// Add this function before the Home component
const findTimezoneOption = (timezone: string): TimezoneOption => {
  // Try to find exact match first
  let option = allTimezones.find(tz => tz.value === timezone);
  
  // If no exact match, try to find a timezone in the same region
  if (!option) {
    const region = timezone.split('/')[0];
    option = allTimezones.find(tz => tz.value.startsWith(`${region}/`));
  }
  
  // Default to first timezone if no match found
  return option || allTimezones[0];
};

// Dynamically import heavy components
const Select = dynamic(() => import('react-select'), {
  ssr: false,
  loading: () => <div className="h-10 bg-gray-800/50 rounded animate-pulse" />
}) as typeof import('react-select').default;

// Dynamically import Advertisement component
const Advertisement = dynamic(() => import('./components/Advertisement'), {
  ssr: false,
  loading: () => <div className="bg-gray-800/50 rounded-lg flex items-center justify-center">
    <div className="text-sm text-gray-400">Loading Ad...</div>
  </div>
});

// Dynamically import LocationWeather component with NoSSR to prevent blocking
const LocationWeather = dynamic(() => import('./components/LocationWeather'), {
  ssr: false,
  loading: () => null // Don't show a loading state to prevent layout shifts
});

export default function Home() {
  const [timezone1, setTimezone1] = useState<TimezoneOption>(() => {
    // Get user's timezone from browser
    const userTimezone = DateTime.local().zoneName;
    return findTimezoneOption(userTimezone);
  });
  const [timezone2, setTimezone2] = useState<TimezoneOption>({ 
    value: 'America/New_York',
    label: 'USA - New York, Miami (ET)',
    group: 'Americas - North'
  });
  const [hoveredHour, setHoveredHour] = useState<number | null>(null);
  const [selectedHour, setSelectedHour] = useState<number | null>(null);
  const [currentTime, setCurrentTime] = useState<DateTime | null>(null);
  const [mounted, setMounted] = useState(false);
  const [slotCopySuccess, setSlotCopySuccess] = useState(false);
  const [showOverlaps, setShowOverlaps] = useState<boolean>(false);
  
  // Add state for drag selection
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartHour, setDragStartHour] = useState<number | null>(null);
  const [dragEndHour, setDragEndHour] = useState<number | null>(null);
  
  // Add working hours state
  const [workingHours1, setWorkingHours1] = useState({start: 9, end: 17});
  const [workingHours2, setWorkingHours2] = useState({start: 9, end: 17});

  useEffect(() => {
    setMounted(true);
    const updateTime = () => {
      setCurrentTime(DateTime.now());
    };
    
    updateTime();
    const interval = setInterval(updateTime, 1000);
    
    // Load saved timezones from localStorage if available
    try {
      const savedTimezone1 = localStorage.getItem('timezone1');
      const savedTimezone2 = localStorage.getItem('timezone2');
      
      if (savedTimezone1) {
        const option = findTimezoneOption(savedTimezone1);
        if (option) setTimezone1(option);
      }
      
      if (savedTimezone2) {
        const option = findTimezoneOption(savedTimezone2);
        if (option) setTimezone2(option);
      }
    } catch (e) {
      console.error('Error accessing localStorage:', e);
    }
    
    return () => clearInterval(interval);
  }, []);

  // Save timezone selections to localStorage when they change
  useEffect(() => {
    if (mounted) {
      try {
        localStorage.setItem('timezone1', timezone1.value);
      } catch (e) {
        console.error('Error saving to localStorage:', e);
      }
    }
  }, [timezone1, mounted]);
  
  useEffect(() => {
    if (mounted) {
      try {
        localStorage.setItem('timezone2', timezone2.value);
      } catch (e) {
        console.error('Error saving to localStorage:', e);
      }
    }
  }, [timezone2, mounted]);

  // Change workingHours to half-hour intervals (48 slots instead of 24)
  const timeSlots = Array.from({ length: 48 }, (_, i) => i / 2);

  const getTimeInZone = (timezone: string) => {
    if (!currentTime) return DateTime.now().setZone(timezone);
    return currentTime.setZone(timezone);
  };

  const time1 = getTimeInZone(timezone1.value);
  const time2 = getTimeInZone(timezone2.value);

  // Calculate the offset between the two timezones
  const hourDiff = time2.offset / 60 - time1.offset / 60;

  const copyToClipboard = async (text: string): Promise<boolean> => {
    try {
      if (navigator?.clipboard?.writeText && window.isSecureContext) {
        // For modern browsers
        await navigator.clipboard.writeText(text);
        return true;
      } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
          const successful = document.execCommand('copy');
          textArea.remove();
          return successful;
        } catch (err) {
          console.error('Fallback: Oops, unable to copy', err);
          textArea.remove();
          return false;
        }
      }
    } catch (err) {
      console.error('Failed to copy text: ', err);
      return false;
    }
  };

  // Calculate total hours selected
  const getTotalHoursSelected = () => {
    if (dragStartHour === null || dragEndHour === null) return 0;
    
    const start = Math.min(dragStartHour, dragEndHour);
    const end = Math.max(dragStartHour, dragEndHour);
    
    // Calculate the number of half-hour slots in the range
    const slots = Math.round((end - start) / 0.5) + 1;
    
    // Convert slots to hours
    return slots * 0.5;
  };

  const copySelectedSlot = useCallback(async () => {
    if ((dragStartHour === null || dragEndHour === null) && selectedHour === null) return;

    let text = "";
    
    // If we have a dragged range
    if (dragStartHour !== null && dragEndHour !== null) {
      const start = Math.min(dragStartHour, dragEndHour);
      const end = Math.max(dragStartHour, dragEndHour);
      
      // Convert to hours and minutes for start time
      const startHour = Math.floor(start);
      const startMinute = start % 1 === 0 ? 0 : 30;
      
      // Convert to hours and minutes for end time
      const endHour = Math.floor(end);
      const endMinute = end % 1 === 0 ? 0 : 30;
      
      const startTime1 = time1.set({ hour: startHour, minute: startMinute, second: 0 });
      const endTime1 = time1.set({ hour: endHour, minute: endMinute, second: 0 }).plus({ minutes: 30 });
      
      // Calculate corresponding times for second timezone
      const startTime2HourDecimal = (start + hourDiff + 48) % 24;
      const endTime2HourDecimal = (end + hourDiff + 48) % 24;
      
      const startTime2Hour = Math.floor(startTime2HourDecimal);
      const startTime2Minute = Math.round((startTime2HourDecimal % 1) * 60);
      
      const endTime2Hour = Math.floor(endTime2HourDecimal);
      const endTime2Minute = Math.round((endTime2HourDecimal % 1) * 60);
      
      const startTime2 = time2.set({ hour: startTime2Hour, minute: startTime2Minute, second: 0 });
      const endTime2 = time2.set({ hour: endTime2Hour, minute: endTime2Minute, second: 0 }).plus({ minutes: 30 });
      
      text = `Selected Time Range (${getTotalHoursSelected()} hour${getTotalHoursSelected() !== 1 ? 's' : ''}):\n\n`;
      text += `${timezone1.label}:\n`;
      text += `${startTime1.toFormat('h:mm a')} - ${endTime1.toFormat('h:mm a')} (${startTime1.toFormat('EEE, MMM d')})\n\n`;
      text += `${timezone2.label}:\n`;
      text += `${startTime2.toFormat('h:mm a')} - ${endTime2.toFormat('h:mm a')} (${startTime2.toFormat('EEE, MMM d')})`;
    } 
    // Use single selected hour as fallback
    else if (selectedHour !== null) {
      const hour = Math.floor(selectedHour);
      const minute = selectedHour % 1 === 0 ? 0 : 30;
      
      const time1HourDecimal = selectedHour;
      const time2HourDecimal = (selectedHour + hourDiff + 48) % 24;
      
      // Convert decimal hours to hours and minutes
      const time2Hour = Math.floor(time2HourDecimal);
      const time2Minute = Math.round((time2HourDecimal % 1) * 60);
      
      const selectedTime1 = time1.set({ hour, minute, second: 0 });
      const selectedTime2 = time2.set({ hour: time2Hour, minute: time2Minute, second: 0 });
      
      text = `Selected time slot:\n\n`;
      text += `${timezone1.label}:\n`;
      text += `${selectedTime1.toFormat('h:mm a')} (${selectedTime1.toFormat('EEE, MMM d')})\n\n`;
      text += `${timezone2.label}:\n`;
      text += `${selectedTime2.toFormat('h:mm a')} (${selectedTime2.toFormat('EEE, MMM d')})`;
    }

    const success = await copyToClipboard(text);
    if (success) {
      setSlotCopySuccess(true);
      setTimeout(() => setSlotCopySuccess(false), 2000);
    } else {
      alert('Failed to copy to clipboard. Please try selecting and copying manually.');
    }
  }, [selectedHour, dragStartHour, dragEndHour, timezone1.label, timezone2.label, time1, time2, hourDiff, getTotalHoursSelected]);

  const handleSwipe = useCallback((direction: 'LEFT' | 'RIGHT') => {
    if (selectedHour === null) return;
    
    const newHour = direction === 'LEFT' 
      ? (selectedHour + 1) % 24 
      : (selectedHour - 1 + 24) % 24;
    
    setSelectedHour(newHour);
  }, [selectedHour]);

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => handleSwipe('LEFT'),
    onSwipedRight: () => handleSwipe('RIGHT'),
    preventScrollOnSwipe: true,
    trackMouse: false
  });

  // Add a function to get the current time with half-hour precision
  const getCurrentTimeDecimal = useCallback(() => {
    if (!currentTime) return 0;
    const now = DateTime.now();
    return now.hour + (now.minute / 60);
  }, [currentTime]);

  // Format half-hour time slot
  const formatTimeSlot = (timeSlot: number) => {
    const hour = Math.floor(timeSlot);
    const minute = timeSlot % 1 === 0 ? 0 : 30;
    return DateTime.fromObject({ hour, minute }).toFormat('h:mm a');
  };

  // Add function to handle working hours input change
  const handleWorkingHoursChange = (location: 1 | 2, type: 'start' | 'end', value: string) => {
    // Parse the input time (e.g., "9:00 AM") to 24-hour format hour number
    try {
      let hourValue: number;
      
      // Handle empty input
      if (!value.trim()) {
        hourValue = type === 'start' ? 9 : 17; // Default values
      } else {
        // Try to parse time in various formats
        const timeParts = value.match(/(\d+)(?::(\d+))?\s*(am|pm|a|p)?/i);
        if (!timeParts) throw new Error("Invalid time format");
        
        let hour = parseInt(timeParts[1], 10);
        const minutes = timeParts[2] ? parseInt(timeParts[2], 10) : 0;
        const ampm = timeParts[3] ? timeParts[3].toLowerCase() : null;
        
        // Handle 12-hour format
        if (ampm === 'pm' || ampm === 'p') {
          if (hour < 12) hour += 12;
        } else if (ampm === 'am' || ampm === 'a') {
          if (hour === 12) hour = 0;
        }
        
        // Validate hour range
        if (hour < 0 || hour > 23) throw new Error("Hour must be between 0 and 23");
        if (minutes < 0 || minutes > 59) throw new Error("Minutes must be between 0 and 59");
        
        // Round to nearest hour for simplicity
        hourValue = minutes >= 30 ? (hour + 1) % 24 : hour;
      }
      
      // Update the appropriate state
      if (location === 1) {
        setWorkingHours1(prev => ({...prev, [type]: hourValue}));
      } else {
        setWorkingHours2(prev => ({...prev, [type]: hourValue}));
      }
    } catch (error) {
      console.error("Error parsing time:", error);
      // Don't update state on error
    }
  };

  // Handle mouse down to start dragging
  const handleMouseDown = (timeSlot: number) => {
    setIsDragging(true);
    setDragStartHour(timeSlot);
    setDragEndHour(timeSlot);
    setSelectedHour(timeSlot); // Set initial selection
  };

  // Handle mouse move during dragging
  const handleMouseMove = (timeSlot: number) => {
    if (isDragging) {
      setDragEndHour(timeSlot);
      // We don't update selectedHour here because we want to wait until drag is complete
    }
  };

  // Handle mouse up to end dragging
  const handleMouseUp = () => {
    if (isDragging && dragStartHour !== null && dragEndHour !== null) {
      // Dragging is complete - store the selected range
      // We keep dragStart and dragEnd values for display purposes
      setIsDragging(false);
    }
  };

  // Cleanup function to handle cases where mouse up happens outside the grid
  useEffect(() => {
    const handleGlobalMouseUp = () => {
      if (isDragging) {
        setIsDragging(false);
      }
    };

    window.addEventListener('mouseup', handleGlobalMouseUp);
    return () => {
      window.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [isDragging]);

  // Get range of selected time slots
  const getSelectedTimeRange = () => {
    if (dragStartHour === null || dragEndHour === null) return [];
    
    const start = Math.min(dragStartHour, dragEndHour);
    const end = Math.max(dragStartHour, dragEndHour);
    
    // Create array of all slots in the range
    const slots = [];
    let current = start;
    while (current <= end) {
      slots.push(current);
      current += 0.5; // Half-hour increments
    }
    
    return slots;
  };

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-location1-bright">Loading...</div>
      </div>
    );
  }

  return (
    <main className="container relative mx-auto px-4 py-8 min-h-screen">
      <h1 className="text-4xl font-bold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-gray-800 to-gray-900 dark:from-location1-bright dark:to-location2-bright pt-12 md:pt-0">
        TimeZone Overlap
      </h1>

      {/* Top banner ad */}
      <Suspense fallback={<div className="h-[90px] bg-gray-800/50 rounded-lg" />}>
        <div className="mb-8">
          <Advertisement
            slot="1234567890"
            format="horizontal"
            className="w-full h-[90px]"
          />
        </div>
      </Suspense>
      
      <div className="grid lg:grid-cols-[1fr_300px] gap-6">
        <div className="space-y-8">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <label className="block text-sm font-medium dark:text-white text-gray-700">First Location</label>
              <Suspense fallback={<div className="h-10 bg-gray-800/50 rounded animate-pulse" />}>
                <Select<TimezoneOption, false, GroupBase<TimezoneOption>>
                  options={groupOptions}
                  value={timezone1}
                  onChange={(option) => option && setTimezone1(option)}
                  className="text-gray-900"
                  isSearchable
                  placeholder="Search timezone..."
                  classNamePrefix="select"
                />
              </Suspense>
              {/* Location 1 Info Card */}
              <div className="bg-gray-800 dark:bg-gray-800 p-3 rounded-lg space-y-2">
                <div className="flex items-center space-x-2">
                  <ClockIcon className="h-5 w-5 text-location1" />
                  <div>
                    <span className="text-location1-bright font-mono tabular-nums dark:text-location1-bright text-blue-600">{time1.toFormat('h:mm a').padEnd(8, ' ')}</span>
                    <span className="text-gray-500 dark:text-gray-400 text-sm ml-2">
                      {time1.toFormat('EEE, MMM d')}
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <LocationWeather 
                    locationName={timezone1.label}
                    timezone={timezone1.value}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-300">Working Hours:</span>
                  <div className="flex space-x-2 items-center">
                    <input
                      type="text"
                      className="w-20 px-2 py-1 bg-gray-700 text-white text-sm rounded"
                      placeholder="9:00 AM"
                      defaultValue="9:00 AM"
                      onChange={(e) => handleWorkingHoursChange(1, 'start', e.target.value)}
                    />
                    <span className="text-gray-400">to</span>
                    <input
                      type="text"
                      className="w-20 px-2 py-1 bg-gray-700 text-white text-sm rounded"
                      placeholder="5:00 PM"
                      defaultValue="5:00 PM"
                      onChange={(e) => handleWorkingHoursChange(1, 'end', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <label className="block text-sm font-medium dark:text-white text-gray-700">Second Location</label>
              <Suspense fallback={<div className="h-10 bg-gray-800/50 rounded animate-pulse" />}>
                <Select
                  options={groupOptions}
                  value={timezone2}
                  onChange={(option: TimezoneOption | null) => option && setTimezone2(option)}
                  className="text-gray-900"
                  isSearchable
                  placeholder="Search timezone..."
                  classNamePrefix="select"
                />
              </Suspense>
              {/* Location 2 Info Card */}
              <div className="bg-gray-800 dark:bg-gray-800 p-3 rounded-lg space-y-2">
                <div className="flex items-center space-x-2">
                  <ClockIcon className="h-5 w-5 text-location2" />
                  <div>
                    <span className="text-location2-bright font-mono tabular-nums dark:text-location2-bright text-orange-600">{time2.toFormat('h:mm a').padEnd(8, ' ')}</span>
                    <span className="text-gray-500 dark:text-gray-400 text-sm ml-2">
                      {time2.toFormat('EEE, MMM d')}
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <LocationWeather 
                    locationName={timezone2.label}
                    timezone={timezone2.value}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-300">Working Hours:</span>
                  <div className="flex space-x-2 items-center">
                    <input
                      type="text"
                      className="w-20 px-2 py-1 bg-gray-700 text-white text-sm rounded"
                      placeholder="9:00 AM"
                      defaultValue="9:00 AM"
                      onChange={(e) => handleWorkingHoursChange(2, 'start', e.target.value)}
                    />
                    <span className="text-gray-400">to</span>
                    <input
                      type="text"
                      className="w-20 px-2 py-1 bg-gray-700 text-white text-sm rounded"
                      placeholder="5:00 PM"
                      defaultValue="5:00 PM"
                      onChange={(e) => handleWorkingHoursChange(2, 'end', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="relative bg-gray-800 rounded-lg p-6" {...swipeHandlers}>
            {/* Add swipe instruction for mobile */}
            <div className="md:hidden text-sm text-gray-400 mb-4 text-center">
              Swipe left or right to change time
            </div>
            
            {/* Add color legend */}
            <div className="flex flex-wrap gap-4 mb-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-location1 bg-opacity-50 rounded"></div>
                <span className="text-location1-bright">{timezone1.label}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-location2 bg-opacity-50 rounded"></div>
                <span className="text-location2-bright">{timezone2.label}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-0.5 h-4 bg-white"></div>
                <span className="text-white">Current local time</span>
              </div>
              <div className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  id="show-overlaps" 
                  checked={showOverlaps} 
                  onChange={(e) => setShowOverlaps(e.target.checked)}
                  className="h-4 w-4 rounded bg-gray-700 border-gray-600 text-location1-bright focus:ring-location1-bright"
                />
                <label htmlFor="show-overlaps" className="text-gray-300">Show overlapping hours</label>
              </div>
            </div>

            <div className="relative">
              {/* Current time indicator */}
              {currentTime && (
                <div 
                  className="absolute top-0 bottom-0 w-0.5 bg-white z-10"
                  style={{ 
                    left: `${(getCurrentTimeDecimal() / 24) * 100}%`,
                    boxShadow: '0 0 4px rgba(255, 255, 255, 0.7)'
                  }}
                />
              )}
              
              {/* Modify the div that contains both location rows to add a relative position */}
              <div className="grid grid-rows-2 h-32 relative">
                {/* Location labels */}
                <div className="absolute -left-24 top-0 h-full flex flex-col justify-around text-xs">
                  <div className="text-location1-bright">{timezone1.label.split(' - ')[0]}</div>
                  <div className="text-location2-bright">{timezone2.label.split(' - ')[0]}</div>
                </div>

                {/* Selection overlay that spans both rows */}
                {(() => {
                  const selectedRange = getSelectedTimeRange();
                  if (selectedRange.length > 0) {
                    const firstSlot = selectedRange[0];
                    const lastSlot = selectedRange[selectedRange.length - 1];
                    const slotWidthPercent = 100 / 48; // Width of a single slot as percentage
                    const startPercent = (firstSlot / 24) * 100;
                    const endPercent = (lastSlot / 24) * 100 + slotWidthPercent;
                    const width = endPercent - startPercent;
                    
                    return (
                      <div 
                        className="absolute border-2 border-white z-10 h-full pointer-events-none"
                        style={{
                          left: `${startPercent}%`,
                          width: `${width}%`,
                        }}
                      />
                    );
                  }
                  return null;
                })()}

                {/* First location row - now with 48 columns */}
                <div className="grid grid-cols-[repeat(48,minmax(0,1fr))] gap-0 border-b border-gray-700">
                  {timeSlots.map((timeSlot) => {
                    const time1HourDecimal = timeSlot;
                    const time2HourDecimal = (timeSlot + hourDiff + 48) % 24;
                    
                    // Convert to hours for working hours check
                    const time1Hour = Math.floor(time1HourDecimal);
                    const time1Minute = (time1HourDecimal % 1) * 60;
                    const time1TotalMinutes = time1Hour * 60 + time1Minute;
                    
                    const time2Hour = Math.floor(time2HourDecimal);
                    const time2Minute = (time2HourDecimal % 1) * 60;
                    const time2TotalMinutes = time2Hour * 60 + time2Minute;
                    
                    // Convert working hours to total minutes for comparison
                    const workingStart1 = workingHours1.start * 60;
                    const workingEnd1 = workingHours1.end * 60;
                    const workingStart2 = workingHours2.start * 60;
                    const workingEnd2 = workingHours2.end * 60;
                    
                    // Use dynamic working hours
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
                    const isOverlap = isWorkingHour1 && isWorkingHour2;
                    
                    // Check if this time slot is in the selected range
                    const selectedRange = getSelectedTimeRange();
                    const isInSelectedRange = selectedRange.includes(timeSlot);

                    return (
                      <div
                        key={`loc1-${timeSlot}`}
                        className={`relative h-full cursor-pointer ${
                          timeSlot % 1 !== 0 ? 'border-r border-dashed border-gray-700/50' : 'border-r border-gray-700'
                        }`}
                        onMouseEnter={() => {
                          setHoveredHour(timeSlot);
                          handleMouseMove(timeSlot);
                        }}
                        onMouseLeave={() => setHoveredHour(null)}
                        onMouseDown={() => handleMouseDown(timeSlot)}
                        onMouseUp={handleMouseUp}
                      >
                        <div
                          className={`h-full ${
                            isWorkingHour1 ? 'bg-location1 bg-opacity-50' : 'bg-opacity-0'
                          }`}
                        />
                        {showOverlaps && isOverlap && (
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
                
                {/* Second location row - now with 48 columns */}
                <div className="grid grid-cols-[repeat(48,minmax(0,1fr))] gap-0">
                  {timeSlots.map((timeSlot) => {
                    const time1HourDecimal = timeSlot;
                    const time2HourDecimal = (timeSlot + hourDiff + 48) % 24;
                    
                    // Convert to hours for working hours check
                    const time1Hour = Math.floor(time1HourDecimal);
                    const time1Minute = (time1HourDecimal % 1) * 60;
                    const time1TotalMinutes = time1Hour * 60 + time1Minute;
                    
                    const time2Hour = Math.floor(time2HourDecimal);
                    const time2Minute = (time2HourDecimal % 1) * 60;
                    const time2TotalMinutes = time2Hour * 60 + time2Minute;
                    
                    // Convert working hours to total minutes for comparison
                    const workingStart1 = workingHours1.start * 60;
                    const workingEnd1 = workingHours1.end * 60;
                    const workingStart2 = workingHours2.start * 60;
                    const workingEnd2 = workingHours2.end * 60;
                    
                    // Use dynamic working hours
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
                    const isOverlap = isWorkingHour1 && isWorkingHour2;
                    
                    // Check if this time slot is in the selected range
                    const selectedRange = getSelectedTimeRange();
                    const isInSelectedRange = selectedRange.includes(timeSlot);

                    return (
                      <div
                        key={`loc2-${timeSlot}`}
                        className={`relative h-full cursor-pointer ${
                          timeSlot % 1 !== 0 ? 'border-r border-dashed border-gray-700/50' : 'border-r border-gray-700'
                        }`}
                        onMouseEnter={() => {
                          setHoveredHour(timeSlot);
                          handleMouseMove(timeSlot);
                        }}
                        onMouseLeave={() => setHoveredHour(null)}
                        onMouseDown={() => handleMouseDown(timeSlot)}
                        onMouseUp={handleMouseUp}
                      >
                        <div
                          className={`h-full ${
                            isWorkingHour2 ? 'bg-location2 bg-opacity-50' : 'bg-opacity-0'
                          }`}
                        />
                        {showOverlaps && isOverlap && (
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
              
              {/* Hover tooltip - updated for half-hour slots */}
              {hoveredHour !== null && (
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 px-3 py-1 rounded text-sm whitespace-nowrap shadow-lg z-20">
                  <span className={`font-mono tabular-nums ${
                    // Convert to minutes for comparison
                    (() => {
                      const hour = Math.floor(hoveredHour);
                      const minute = (hoveredHour % 1) * 60;
                      const totalMinutes = hour * 60 + minute;
                      const workingStart = workingHours1.start * 60;
                      const workingEnd = workingHours1.end * 60;
                      
                      return (workingHours1.start <= workingHours1.end
                        ? totalMinutes >= workingStart && totalMinutes < workingEnd
                        : totalMinutes >= workingStart || totalMinutes < workingEnd)
                        ? 'text-location1-bright' : 'text-location1';
                    })()
                  }`}>
                    {(() => {
                      const hour = Math.floor(hoveredHour);
                      const minute = hoveredHour % 1 === 0 ? 0 : 30;
                      return time1.set({ hour, minute, second: 0 }).toFormat('h:mm a').padEnd(8, ' ');
                    })()}
                  </span>
                  {' / '}
                  <span className={`font-mono tabular-nums ${
                    // Convert to minutes for comparison
                    (() => {
                      const hourDecimal = (hoveredHour + hourDiff + 48) % 24;
                      const hour = Math.floor(hourDecimal);
                      const minute = (hourDecimal % 1) * 60;
                      const totalMinutes = hour * 60 + minute;
                      const workingStart = workingHours2.start * 60;
                      const workingEnd = workingHours2.end * 60;
                      
                      return (workingHours2.start <= workingHours2.end
                        ? totalMinutes >= workingStart && totalMinutes < workingEnd
                        : totalMinutes >= workingStart || totalMinutes < workingEnd)
                        ? 'text-location2-bright' : 'text-location2';
                    })()
                  }`}>
                    {(() => {
                      const hourDecimal = (hoveredHour + hourDiff + 48) % 24;
                      const hour = Math.floor(hourDecimal);
                      const minute = Math.round((hourDecimal % 1) * 60);
                      return time2.set({ hour, minute, second: 0 }).toFormat('h:mm a').padEnd(8, ' ');
                    })()}
                  </span>
                  
                  {/* Show hours selected during drag */}
                  {isDragging && dragStartHour !== null && dragEndHour !== null && (
                    <div className="mt-1 text-xs text-white bg-gray-700 px-2 py-1 rounded">
                      {getTotalHoursSelected()} hour{getTotalHoursSelected() !== 1 ? 's' : ''} selected
                    </div>
                  )}
                </div>
              )}
            </div>
            
            <div className="absolute bottom-2 left-4 right-4 flex justify-between text-sm text-gray-400">
              <span>12:00 AM</span>
              <span>12:00 PM</span>
              <span>11:30 PM</span>
            </div>
          </div>

          {/* Selected Time Slot Display - updated for multiple slots */}
          {(dragStartHour !== null && dragEndHour !== null) || selectedHour !== null ? (
            <div className="mt-6 p-4 bg-gray-800 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-300">
                  {dragStartHour !== null && dragEndHour !== null ? 
                    `Selected Time Range (${getTotalHoursSelected()} hour${getTotalHoursSelected() !== 1 ? 's' : ''}):` : 
                    'Selected Time Slot:'}
                </h3>
                <button
                  onClick={copySelectedSlot}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    slotCopySuccess ? 'bg-green-600 text-white' : 'bg-gray-700 hover:bg-gray-600 text-white dark:text-white'
                  }`}
                  aria-label={slotCopySuccess ? "Time slot copied" : "Copy selected time slot"}
                >
                  <span className="text-sm font-medium">{slotCopySuccess ? 'Copied!' : 'Copy'}</span>
                  {slotCopySuccess ? (
                    <CheckIcon className="h-5 w-5" />
                  ) : (
                    <ClipboardIcon className="h-5 w-5" />
                  )}
                </button>
              </div>
              
              <div className="space-y-4">
                {/* First location */}
                <div className="p-3 bg-gray-700/30 rounded-lg">
                  <div className="flex items-center space-x-2 mb-1">
                    <div className="w-3 h-3 bg-location1 rounded-full"></div>
                    <h4 className="text-sm font-medium text-gray-300">{timezone1.label}</h4>
                  </div>
                  
                  {dragStartHour !== null && dragEndHour !== null ? (
                    <div>
                      {(() => {
                        const start = Math.min(dragStartHour, dragEndHour);
                        const end = Math.max(dragStartHour, dragEndHour);
                        
                        const startHour = Math.floor(start);
                        const startMinute = start % 1 === 0 ? 0 : 30;
                        
                        const endHour = Math.floor(end);
                        const endMinute = end % 1 === 0 ? 0 : 30;
                        
                        const startTime = time1.set({ hour: startHour, minute: startMinute, second: 0 });
                        const endTime = time1.set({ hour: endHour, minute: endMinute, second: 0 }).plus({ minutes: 30 });
                        
                        return (
                          <div className="space-y-1">
                            <div className="text-location1-bright font-mono text-lg">
                              {startTime.toFormat('h:mm a')} - {endTime.toFormat('h:mm a')}
                            </div>
                            <div className="text-gray-400 text-sm">
                              {startTime.toFormat('EEEE, MMMM d, yyyy')}
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  ) : (
                    <div>
                      {(() => {
                        if (selectedHour === null) return null;
                        
                        const hour = Math.floor(selectedHour);
                        const minute = selectedHour % 1 === 0 ? 0 : 30;
                        const selectedTime = time1.set({ hour, minute, second: 0 });
                        
                        return (
                          <div className="space-y-1">
                            <div className="text-location1-bright font-mono text-lg">
                              {selectedTime.toFormat('h:mm a')}
                            </div>
                            <div className="text-gray-400 text-sm">
                              {selectedTime.toFormat('EEEE, MMMM d, yyyy')}
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  )}
                </div>
                
                {/* Second location */}
                <div className="p-3 bg-gray-700/30 rounded-lg">
                  <div className="flex items-center space-x-2 mb-1">
                    <div className="w-3 h-3 bg-location2 rounded-full"></div>
                    <h4 className="text-sm font-medium text-gray-300">{timezone2.label}</h4>
                  </div>
                  
                  {dragStartHour !== null && dragEndHour !== null ? (
                    <div>
                      {(() => {
                        const start = Math.min(dragStartHour, dragEndHour);
                        const end = Math.max(dragStartHour, dragEndHour);
                        
                        const startTime2HourDecimal = (start + hourDiff + 48) % 24;
                        const endTime2HourDecimal = (end + hourDiff + 48) % 24;
                        
                        const startTime2Hour = Math.floor(startTime2HourDecimal);
                        const startTime2Minute = Math.round((startTime2HourDecimal % 1) * 60);
                        
                        const endTime2Hour = Math.floor(endTime2HourDecimal);
                        const endTime2Minute = Math.round((endTime2HourDecimal % 1) * 60);
                        
                        const startTime = time2.set({ hour: startTime2Hour, minute: startTime2Minute, second: 0 });
                        const endTime = time2.set({ hour: endTime2Hour, minute: endTime2Minute, second: 0 }).plus({ minutes: 30 });
                        
                        return (
                          <div className="space-y-1">
                            <div className="text-location2-bright font-mono text-lg">
                              {startTime.toFormat('h:mm a')} - {endTime.toFormat('h:mm a')}
                            </div>
                            <div className="text-gray-400 text-sm">
                              {startTime.toFormat('EEEE, MMMM d, yyyy')}
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  ) : (
                    <div>
                      {(() => {
                        if (selectedHour === null) return null;
                        
                        const hourDecimal = (selectedHour + hourDiff + 48) % 24;
                        const hour = Math.floor(hourDecimal);
                        const minute = Math.round((hourDecimal % 1) * 60);
                        const selectedTime = time2.set({ hour, minute, second: 0 });
                        
                        return (
                          <div className="space-y-1">
                            <div className="text-location2-bright font-mono text-lg">
                              {selectedTime.toFormat('h:mm a')}
                            </div>
                            <div className="text-gray-400 text-sm">
                              {selectedTime.toFormat('EEEE, MMMM d, yyyy')}
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  )}
                </div>
                
                {/* Show total hours selected */}
                {dragStartHour !== null && dragEndHour !== null && (
                  <div className="text-sm text-gray-400 mt-2">
                    Total time: {getTotalHoursSelected()} hour{getTotalHoursSelected() !== 1 ? 's' : ''}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="mt-6 p-4 bg-gray-800 rounded-lg">
              <div className="flex items-center gap-2 text-gray-400">
                <ClockIcon className="h-5 w-5" />
                <p>Click and drag to select a time range, or click on any time slot to select a single time.</p>
              </div>
            </div>
          )}

          {/* Bottom banner ad */}
          <div className="mt-8">
            <Advertisement
              slot="0987654321"
              format="horizontal"
              className="w-full h-[90px]"
            />
          </div>
        </div>

        {/* Sidebar ad */}
        <div className="hidden lg:block">
          <div className="sticky top-4">
            <Advertisement
              slot="1357924680"
              format="vertical"
              className="w-full h-[600px]"
            />
          </div>
        </div>
      </div>

      {/* In-feed ad for mobile */}
      <div className="mt-8 lg:hidden">
        <Advertisement
          slot="2468013579"
          format="rectangle"
          className="w-full h-[250px]"
        />
      </div>

      {/* Privacy Policy Link */}
      <footer className="mt-12 text-center text-sm text-gray-400">
        <Link href="/privacy" className="hover:text-location1-bright transition-colors">
          Privacy Policy
        </Link>
      </footer>
    </main>
  );
}
