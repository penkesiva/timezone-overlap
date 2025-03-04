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

// Define select styles function that adapts to theme
const getSelectStyles = (isDarkMode: boolean) => ({
  control: (base: any) => ({
    ...base,
    backgroundColor: isDarkMode ? '#374151' : base.backgroundColor,
    borderColor: isDarkMode ? '#4B5563' : base.borderColor,
  }),
  option: (base: any, state: any) => ({
    ...base,
    backgroundColor: isDarkMode 
      ? (state.isSelected ? '#2563EB' : (state.isFocused ? '#4B5563' : '#1F2937'))
      : (state.isSelected ? base.backgroundColor : (state.isFocused ? '#F3F4F6' : base.backgroundColor)),
    color: isDarkMode ? '#F9FAFB' : base.color,
  }),
  menu: (base: any) => ({
    ...base,
    backgroundColor: isDarkMode ? '#1F2937' : base.backgroundColor,
  }),
  singleValue: (base: any) => ({
    ...base,
    color: isDarkMode ? '#F9FAFB' : base.color,
  }),
  input: (base: any) => ({
    ...base,
    color: isDarkMode ? '#F9FAFB' : base.color,
  }),
  placeholder: (base: any) => ({
    ...base,
    color: isDarkMode ? '#9CA3AF' : base.color,
  }),
});

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
  
  // Add meeting time state
  const [meetingTime, setMeetingTime] = useState({start: 13, end: 14});
  const [showMeetingTime, setShowMeetingTime] = useState(true);

  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    setMounted(true);
    const updateTime = () => {
      setCurrentTime(DateTime.now());
    };
    
    updateTime();
    const interval = setInterval(updateTime, 1000);
    
    // Get initial theme state
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setIsDarkMode(savedTheme === 'dark');
    
    // Listen for theme changes
    const handleThemeChange = (e: CustomEvent) => {
      if (e.detail?.theme) {
        setIsDarkMode(e.detail.theme === 'dark');
      }
    };
    
    window.addEventListener('themeChange', handleThemeChange as EventListener);
    
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
      
      // Load working hours from localStorage
      const savedWorkingHours1 = localStorage.getItem('workingHours1');
      const savedWorkingHours2 = localStorage.getItem('workingHours2');
      
      if (savedWorkingHours1) {
        try {
          setWorkingHours1(JSON.parse(savedWorkingHours1));
        } catch (e) {
          console.error('Error parsing workingHours1:', e);
        }
      }
      
      if (savedWorkingHours2) {
        try {
          setWorkingHours2(JSON.parse(savedWorkingHours2));
        } catch (e) {
          console.error('Error parsing workingHours2:', e);
        }
      }
      
      // Load selection state if available
      const savedDragStart = localStorage.getItem('dragStartHour');
      const savedDragEnd = localStorage.getItem('dragEndHour');
      
      if (savedDragStart && savedDragEnd) {
        try {
          setDragStartHour(parseFloat(savedDragStart));
          setDragEndHour(parseFloat(savedDragEnd));
        } catch (e) {
          console.error('Error parsing selection state:', e);
        }
      }
      
    } catch (e) {
      console.error('Error accessing localStorage:', e);
    }
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('themeChange', handleThemeChange as EventListener);
    };
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

  // Save working hours to localStorage when they change
  useEffect(() => {
    if (mounted) {
      try {
        localStorage.setItem('workingHours1', JSON.stringify(workingHours1));
      } catch (e) {
        console.error('Error saving workingHours1 to localStorage:', e);
      }
    }
  }, [workingHours1, mounted]);
  
  useEffect(() => {
    if (mounted) {
      try {
        localStorage.setItem('workingHours2', JSON.stringify(workingHours2));
      } catch (e) {
        console.error('Error saving workingHours2 to localStorage:', e);
      }
    }
  }, [workingHours2, mounted]);
  
  // Save selection state to localStorage when it changes
  useEffect(() => {
    if (mounted && dragStartHour !== null && dragEndHour !== null) {
      try {
        localStorage.setItem('dragStartHour', dragStartHour.toString());
        localStorage.setItem('dragEndHour', dragEndHour.toString());
      } catch (e) {
        console.error('Error saving selection to localStorage:', e);
      }
    }
  }, [dragStartHour, dragEndHour, mounted]);

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

  // Format working hours
  const formatWorkingHours = (hour: number) => {
    // Convert 24-hour format to 12-hour format with AM/PM
    let period = 'AM';
    let hour12 = hour;
    
    if (hour >= 12) {
      period = 'PM';
      hour12 = hour === 12 ? 12 : hour - 12;
    } else if (hour === 0) {
      hour12 = 12;
    }
    
    return `${hour12}:00 ${period}`;
  };

  // Improved time input handling with auto-complete for AM/PM
  const handleTimeInputChange = (e: React.ChangeEvent<HTMLInputElement>, location: 1 | 2, type: 'start' | 'end') => {
    let value = e.target.value;
    
    // Auto-complete AM/PM when user types 'a' or 'p'
    if (value.endsWith('a') && !value.endsWith('am') && !value.endsWith('AM')) {
      value = value.slice(0, -1) + 'AM';
    } else if (value.endsWith('p') && !value.endsWith('pm') && !value.endsWith('PM')) {
      value = value.slice(0, -1) + 'PM';
    }
    
    // Update the input value
    handleWorkingHoursChange(location, type, value);
  };

  // Helper function to check if a time slot is within working hours for a location
  const isLocationWorkingHour = (timeSlot: number, locationIndex: number) => {
    const hourDecimal = locationIndex === 1 ? 
      timeSlot : 
      (timeSlot + hourDiff + 48) % 24;
    
    const hour = Math.floor(hourDecimal);
    const minute = (hourDecimal % 1) * 60;
    const totalMinutes = hour * 60 + minute;
    
    const workingHours = locationIndex === 1 ? workingHours1 : workingHours2;
    const workingStart = workingHours.start * 60;
    const workingEnd = workingHours.end * 60;
    
    return (
      workingHours.start <= workingHours.end
        ? totalMinutes >= workingStart && totalMinutes < workingEnd
        : totalMinutes >= workingStart || totalMinutes < workingEnd
    );
  };
  
  // Helper function to check if a time slot is within meeting hours
  const isMeetingTimeSlot = (timeSlot: number) => {
    const hour = Math.floor(timeSlot);
    
    return (
      meetingTime.start <= meetingTime.end
        ? hour >= meetingTime.start && hour < meetingTime.end
        : hour >= meetingTime.start || hour < meetingTime.end
    );
  };
  
  // Helper function to check if selected time is in working hours for a location
  const isSelectedTimeInWorkingHours = (locationIndex: number) => {
    if (dragStartHour === null || dragEndHour === null) return false;
    
    // Check if any part of the selected time range is in working hours
    for (let i = Math.min(dragStartHour, dragEndHour); i <= Math.max(dragStartHour, dragEndHour); i += 0.5) {
      if (isLocationWorkingHour(i, locationIndex)) return true;
    }
    return false;
  };
  
  // Helper function to check if selected time is in meeting hours
  const isSelectedTimeInMeetingHours = () => {
    if (dragStartHour === null || dragEndHour === null) return false;
    
    // Check if any part of the selected time range is in meeting hours
    for (let i = Math.min(dragStartHour, dragEndHour); i <= Math.max(dragStartHour, dragEndHour); i += 0.5) {
      if (isMeetingTimeSlot(i)) return true;
    }
    return false;
  };
  
  // Helper function to format selected time for a timezone
  const formatSelectedTime = (timezone = timezone1, hourOffset = 0) => {
    if (dragStartHour === null || dragEndHour === null) return '';
    
    const startHour = Math.floor(Math.min(dragStartHour, dragEndHour));
    const startMinute = (Math.min(dragStartHour, dragEndHour) % 1) * 60;
    
    const endHour = Math.floor(Math.max(dragStartHour, dragEndHour));
    const endMinute = (Math.max(dragStartHour, dragEndHour) % 1) * 60;
    
    let startTime, endTime;
    
    if (hourOffset === 0) {
      startTime = time1.set({ hour: startHour, minute: startMinute, second: 0 }).toFormat('h:mm a');
      endTime = time1.set({ hour: endHour, minute: endMinute, second: 0 }).toFormat('h:mm a');
    } else {
      startTime = time2.set({ 
        hour: (startHour + hourOffset + 48) % 24, 
        minute: startMinute, 
        second: 0 
      }).toFormat('h:mm a');
      endTime = time2.set({ 
        hour: (endHour + hourOffset + 48) % 24, 
        minute: endMinute, 
        second: 0 
      }).toFormat('h:mm a');
    }
    
    return `${startTime} - ${endTime}`;
  };
  
  // Helper function to calculate total selected hours
  const formatTotalSelectedHours = () => {
    if (dragStartHour === null || dragEndHour === null) return 0;
    
    return Math.abs(dragEndHour - dragStartHour);
  };

  // Helper function to get hours label
  const getHoursLabel = (hour: number) => {
    const hour12 = hour % 12 === 0 ? 12 : hour % 12;
    const period = hour < 12 ? 'AM' : 'PM';
    return `${hour12} ${period}`;
  };

  // Add this function to calculate the overlap duration between working hours
  const getWorkingHoursOverlap = () => {
    // Convert working hours to decimal for easier comparison
    const tz1Start = workingHours1.start;
    const tz1End = workingHours1.end;
    const tz2StartInTz1 = (workingHours2.start - hourDiff + 24) % 24;
    const tz2EndInTz1 = (workingHours2.end - hourDiff + 24) % 24;
    
    // Handle cases where working hours cross midnight
    const tz1Range = tz1Start <= tz1End 
      ? { start: tz1Start, end: tz1End }
      : { start: tz1Start, end: tz1End + 24 };
    
    const tz2Range = tz2StartInTz1 <= tz2EndInTz1 
      ? { start: tz2StartInTz1, end: tz2EndInTz1 }
      : { start: tz2StartInTz1, end: tz2EndInTz1 + 24 };
    
    // Calculate overlap
    const overlapStart = Math.max(tz1Range.start, tz2Range.start);
    const overlapEnd = Math.min(tz1Range.end, tz2Range.end);
    
    // If there's no overlap, return 0
    if (overlapStart >= overlapEnd) return 0;
    
    // Return overlap duration in hours
    return overlapEnd - overlapStart;
  };

  // Calculate if selected time has overlap between timezones
  const getSelectedTimeOverlap = () => {
    if (dragStartHour === null || dragEndHour === null) return 0;
    
    const start = Math.min(dragStartHour, dragEndHour);
    const end = Math.max(dragStartHour, dragEndHour);
    
    let overlapHours = 0;
    
    // Check each half-hour slot in the selection
    for (let slot = start; slot <= end; slot += 0.5) {
      // For each slot, check if it's a working hour in both timezones
      const time1HourDecimal = slot;
      const time2HourDecimal = (slot + hourDiff + 48) % 24;
      
      // Convert to total minutes for comparison
      const time1TotalMinutes = time1HourDecimal * 60;
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
      
      // If both are working hours, add 0.5 hours to the overlap count
      if (isWorkingHour1 && isWorkingHour2) {
        overlapHours += 0.5;
      }
    }
    
    return overlapHours;
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
      <div className="flex flex-col items-center justify-between mb-8 md:flex-row">
        <div>
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-800 to-gray-900 dark:from-location1-bright dark:to-location2-bright pt-12 md:pt-0">
            TimeZone Overlap
          </h1>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-2">
            Compare time zones and find overlapping working hours
          </p>
        </div>
      </div>

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
                  styles={getSelectStyles(isDarkMode)}
                  isSearchable
                  placeholder="Search timezone..."
                  classNamePrefix="select"
                />
              </Suspense>
              {/* Location 1 Info Card */}
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg space-y-2 border border-gray-200 dark:border-gray-700">
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
                  <span className="text-sm text-gray-600 dark:text-gray-300">Working Hours:</span>
                  <div className="flex space-x-2 items-center">
                    <input
                      type="text"
                      className="w-20 px-2 py-1 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white text-sm rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="9:00 AM"
                      value={formatWorkingHours(workingHours1.start)}
                      onChange={(e) => handleTimeInputChange(e, 1, 'start')}
                    />
                    <span className="text-gray-600 dark:text-gray-400">to</span>
                    <input
                      type="text"
                      className="w-20 px-2 py-1 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white text-sm rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="5:00 PM"
                      value={formatWorkingHours(workingHours1.end)}
                      onChange={(e) => handleTimeInputChange(e, 1, 'end')}
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
                  styles={getSelectStyles(isDarkMode)}
                  isSearchable
                  placeholder="Search timezone..."
                  classNamePrefix="select"
                />
              </Suspense>
              {/* Location 2 Info Card */}
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg space-y-2 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-2">
                  <ClockIcon className="h-5 w-5 text-location2" />
                  <div>
                    <span className="text-location2-bright font-mono tabular-nums dark:text-location2-bright text-purple-600">{time2.toFormat('h:mm a').padEnd(8, ' ')}</span>
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
                  <span className="text-sm text-gray-600 dark:text-gray-300">Working Hours:</span>
                  <div className="flex space-x-2 items-center">
                    <input
                      type="text"
                      className="w-20 px-2 py-1 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white text-sm rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="9:00 AM"
                      value={formatWorkingHours(workingHours2.start)}
                      onChange={(e) => handleTimeInputChange(e, 2, 'start')}
                    />
                    <span className="text-gray-600 dark:text-gray-400">to</span>
                    <input
                      type="text"
                      className="w-20 px-2 py-1 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white text-sm rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="5:00 PM"
                      value={formatWorkingHours(workingHours2.end)}
                      onChange={(e) => handleTimeInputChange(e, 2, 'end')}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="relative bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700" {...swipeHandlers}>
            {/* Add swipe instruction for mobile */}
            <div className="md:hidden text-sm text-gray-400 mb-4 text-center">
              Swipe left or right to change time
            </div>
            
            {/* Add color legend */}
            <div className="mt-6 border-t border-gray-700 pt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-lg font-semibold mb-4 text-white">Color Legend</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-blue-600 bg-opacity-50 dark:bg-blue-500 dark:bg-opacity-50 rounded"></div>
                    <span className="text-blue-700 dark:text-location1-bright">{timezone1.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-purple-600 bg-opacity-50 dark:bg-purple-500 dark:bg-opacity-50 rounded"></div>
                    <span className="text-purple-700 dark:text-location2-bright">{timezone2.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-amber-600 bg-opacity-50 dark:bg-amber-500 dark:bg-opacity-50 rounded"></div>
                    <span className="text-amber-700 dark:text-amber-300">Meeting Time</span>
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
                    <label htmlFor="show-overlaps" className="text-gray-700 dark:text-gray-300">Show overlapping hours</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input 
                      type="checkbox" 
                      id="show-meeting-time" 
                      checked={showMeetingTime} 
                      onChange={(e) => setShowMeetingTime(e.target.checked)}
                      className="h-4 w-4 rounded bg-gray-700 border-gray-600 text-amber-400 focus:ring-amber-400"
                    />
                    <label htmlFor="show-meeting-time" className="text-gray-700 dark:text-gray-300">Show meeting time</label>
                  </div>
                </div>
              </div>

              {/* Meeting Time Card */}
              {showMeetingTime && (
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-semibold mb-2 text-amber-700 dark:text-amber-300">Meeting Time</h3>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label htmlFor="meeting-start" className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Start Time</label>
                      <input
                        type="text"
                        id="meeting-start"
                        className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded py-2 px-3 text-gray-800 dark:text-white focus:ring-1 focus:ring-amber-500 focus:border-amber-500"
                        value={formatWorkingHours(meetingTime.start)}
                        onChange={(e) => {
                          let value = e.target.value;
                          // Auto-complete AM/PM
                          if (value.endsWith('a') && !value.endsWith('am') && !value.endsWith('AM')) {
                            value = value.slice(0, -1) + 'AM';
                          } else if (value.endsWith('p') && !value.endsWith('pm') && !value.endsWith('PM')) {
                            value = value.slice(0, -1) + 'PM';
                          }
                          
                          // Parse the time and set state
                          try {
                            const timeParts = value.match(/(\d+)(?::(\d+))?\s*(am|pm|a|p)?/i);
                            if (timeParts) {
                              let hour = parseInt(timeParts[1], 10);
                              const ampm = timeParts[3] ? timeParts[3].toLowerCase() : null;
                              
                              if (ampm === 'pm' || ampm === 'p') {
                                if (hour < 12) hour += 12;
                              } else if (ampm === 'am' || ampm === 'a') {
                                if (hour === 12) hour = 0;
                              }
                              
                              if (hour >= 0 && hour <= 23) {
                                setMeetingTime(prev => ({ ...prev, start: hour }));
                              }
                            }
                          } catch (error) {
                            console.error("Error parsing time:", error);
                          }
                        }}
                        placeholder="9:00 AM"
                      />
                    </div>
                    <div>
                      <label htmlFor="meeting-end" className="block text-sm text-gray-600 dark:text-gray-400 mb-1">End Time</label>
                      <input
                        type="text"
                        id="meeting-end"
                        className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded py-2 px-3 text-gray-800 dark:text-white focus:ring-1 focus:ring-amber-500 focus:border-amber-500"
                        value={formatWorkingHours(meetingTime.end)}
                        onChange={(e) => {
                          let value = e.target.value;
                          // Auto-complete AM/PM
                          if (value.endsWith('a') && !value.endsWith('am') && !value.endsWith('AM')) {
                            value = value.slice(0, -1) + 'AM';
                          } else if (value.endsWith('p') && !value.endsWith('pm') && !value.endsWith('PM')) {
                            value = value.slice(0, -1) + 'PM';
                          }
                          
                          // Parse the time and set state
                          try {
                            const timeParts = value.match(/(\d+)(?::(\d+))?\s*(am|pm|a|p)?/i);
                            if (timeParts) {
                              let hour = parseInt(timeParts[1], 10);
                              const ampm = timeParts[3] ? timeParts[3].toLowerCase() : null;
                              
                              if (ampm === 'pm' || ampm === 'p') {
                                if (hour < 12) hour += 12;
                              } else if (ampm === 'am' || ampm === 'a') {
                                if (hour === 12) hour = 0;
                              }
                              
                              if (hour >= 0 && hour <= 23) {
                                setMeetingTime(prev => ({ ...prev, end: hour }));
                              }
                            }
                          } catch (error) {
                            console.error("Error parsing time:", error);
                          }
                        }}
                        placeholder="5:00 PM"
                      />
                    </div>
                  </div>
                  <div className="mb-2">
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="text-sm text-gray-600 dark:text-gray-400">{timezone1.label.split(' - ')[0]}</span>
                        <div className="text-lg font-bold text-amber-700 dark:text-amber-300">
                          {time1.set({ hour: meetingTime.start, minute: 0 }).toFormat('h a')} - {time1.set({ hour: meetingTime.end, minute: 0 }).toFormat('h a')}
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-sm text-gray-600 dark:text-gray-400">{timezone2.label.split(' - ')[0]}</span>
                        <div className="text-lg font-bold text-amber-700 dark:text-amber-300">
                          {time2.set({ hour: (meetingTime.start + hourDiff + 24) % 24, minute: 0 }).toFormat('h a')} - {time2.set({ hour: (meetingTime.end + hourDiff + 24) % 24, minute: 0 }).toFormat('h a')}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Time Grid Visualization with Hover */}
            <div 
              className="mt-4 relative overflow-hidden rounded-lg"
              onMouseLeave={() => setHoveredHour(null)}
            >
              <div className="h-[180px] relative">
                {/* Highlight selected range */}
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
                <div className="grid grid-cols-[repeat(48,minmax(0,1fr))] gap-0 h-[90px]">
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
                    
                    // Check if this hour is a meeting time
                    const isMeetingHour = showMeetingTime && (
                      meetingTime.start <= meetingTime.end
                        ? time1Hour >= meetingTime.start && time1Hour < meetingTime.end
                        : time1Hour >= meetingTime.start || time1Hour < meetingTime.end
                    );
                    
                    // Check if this time slot is in the selected range
                    const isInSelectedRange = dragStartHour !== null && dragEndHour !== null
                      ? (dragStartHour <= dragEndHour
                          ? timeSlot >= dragStartHour && timeSlot <= dragEndHour
                          : timeSlot >= dragStartHour || timeSlot <= dragEndHour)
                      : false;

                    return (
                      <div
                        key={`tz1-${timeSlot}`}
                        className={`
                          relative h-full border-r border-gray-700 border-opacity-30 cursor-pointer
                          ${isInSelectedRange ? 'bg-white bg-opacity-20' : ''}
                        `}
                        onMouseEnter={() => setHoveredHour(timeSlot)}
                        onMouseDown={(e) => handleMouseDown(timeSlot)}
                        onMouseMove={(e) => handleMouseMove(timeSlot)}
                        onMouseUp={() => handleMouseUp()}
                      >
                        <div
                          className={`
                            h-full 
                            ${isMeetingHour ? 'bg-amber-600 bg-opacity-50 dark:bg-amber-500 dark:bg-opacity-50' :
                              showOverlaps && isOverlap ? 'bg-indigo-600 bg-opacity-40 dark:bg-indigo-500 dark:bg-opacity-40' :
                              isWorkingHour1 ? 'bg-blue-600 bg-opacity-50 dark:bg-blue-500 dark:bg-opacity-50' : ''}
                          `}
                        ></div>
                      </div>
                    );
                  })}
                </div>
                
                {/* Second location row - now with 48 columns */}
                <div className="grid grid-cols-[repeat(48,minmax(0,1fr))] gap-0 mt-[1px]">
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
                    
                    // Check if this hour is a meeting time
                    const isMeetingHour = showMeetingTime && (
                      meetingTime.start <= meetingTime.end
                        ? time1Hour >= meetingTime.start && time1Hour < meetingTime.end
                        : time1Hour >= meetingTime.start || time1Hour < meetingTime.end
                    );
                    
                    // Check if this time slot is in the selected range
                    const isInSelectedRange = dragStartHour !== null && dragEndHour !== null
                      ? (dragStartHour <= dragEndHour
                          ? timeSlot >= dragStartHour && timeSlot <= dragEndHour
                          : timeSlot >= dragStartHour || timeSlot <= dragEndHour)
                      : false;

                    return (
                      <div
                        key={`tz2-${timeSlot}`}
                        className={`
                          relative h-full border-r border-gray-700 border-opacity-30 cursor-pointer
                          ${isInSelectedRange ? 'bg-white bg-opacity-20' : ''}
                        `}
                        onMouseEnter={() => setHoveredHour(timeSlot)}
                        onMouseDown={(e) => handleMouseDown(timeSlot)}
                        onMouseMove={(e) => handleMouseMove(timeSlot)}
                        onMouseUp={() => handleMouseUp()}
                      >
                        <div
                          className={`
                            h-full 
                            ${isMeetingHour ? 'bg-amber-600 bg-opacity-50 dark:bg-amber-500 dark:bg-opacity-50' :
                              showOverlaps && isOverlap ? 'bg-indigo-600 bg-opacity-40 dark:bg-indigo-500 dark:bg-opacity-40' :
                              isWorkingHour2 ? 'bg-purple-600 bg-opacity-50 dark:bg-purple-500 dark:bg-opacity-50' : ''}
                          `}
                        ></div>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              {/* Simplified hover tooltip - similar to the Preview Widget */}
              {hoveredHour !== null && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute top-0 left-0 w-full h-full pointer-events-none"
                >
                  {/* Position the tooltip based on hovered hour */}
                  <div 
                    className="absolute bg-gray-800 text-white text-xs p-2 rounded shadow-lg z-50"
                    style={{
                      left: `${(hoveredHour / 24) * 100}%`,
                      top: '50%',
                      transform: 'translate(-50%, -50%)'
                    }}
                  >
                    <div className="flex flex-col items-center gap-1">
                      <div className="font-medium">
                        {time1.set({ hour: Math.floor(hoveredHour), minute: (hoveredHour % 1) * 60 }).toFormat('h:mm a')}
                      </div>
                      <div className="font-medium">
                        {time2.set({ hour: Math.floor((hoveredHour + hourDiff + 48) % 24), minute: ((hoveredHour + hourDiff + 48) % 1) * 60 }).toFormat('h:mm a')}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
            
            <div className="mt-2 flex justify-between text-sm text-gray-600 dark:text-gray-400">
              <span>12:00 AM</span>
              <span>12:00 PM</span>
              <span>11:30 PM</span>
            </div>
          </div>

          {/* Selected Time Slot */}
          {(dragStartHour !== null && dragEndHour !== null) || selectedHour !== null ? (
            <div className="mt-6 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
              <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Selected Time</h3>
              
              {/* Move the Time Grid here */}
              <div className="mb-6 relative overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="h-[110px] relative">
                  {/* First location row */}
                  <div className="grid grid-cols-[repeat(48,minmax(0,1fr))] gap-0 h-[54px]">
                    {timeSlots.map((timeSlot) => {
                      const time1HourDecimal = timeSlot;
                      const time1Hour = Math.floor(time1HourDecimal);
                      const time1Minute = (time1HourDecimal % 1) * 60;
                      const time1TotalMinutes = time1Hour * 60 + time1Minute;
                      
                      // Convert working hours to total minutes for comparison
                      const workingStart1 = workingHours1.start * 60;
                      const workingEnd1 = workingHours1.end * 60;
                      
                      // Check if working hour
                      const isWorkingHour1 = (
                        workingHours1.start <= workingHours1.end
                          ? time1TotalMinutes >= workingStart1 && time1TotalMinutes < workingEnd1
                        : time1TotalMinutes >= workingStart1 || time1TotalMinutes < workingEnd1
                      );
                      
                      // Check if meeting hour
                      const isMeetingHour = showMeetingTime && (
                        meetingTime.start <= meetingTime.end
                          ? time1Hour >= meetingTime.start && time1Hour < meetingTime.end
                        : time1Hour >= meetingTime.start || time1Hour < meetingTime.end
                      );
                      
                      // Check if in selected range
                      const isInSelectedRange = dragStartHour !== null && dragEndHour !== null
                        ? (dragStartHour <= dragEndHour
                            ? timeSlot >= dragStartHour && timeSlot <= dragEndHour
                          : timeSlot >= dragStartHour || timeSlot <= dragEndHour)
                        : false;
                        
                      // Get the time2 equivalent for this slot to check overlap
                      const time2HourDecimal = (timeSlot + hourDiff + 48) % 24;
                      const time2Hour = Math.floor(time2HourDecimal);
                      const time2Minute = (time2HourDecimal % 1) * 60;
                      const time2TotalMinutes = time2Hour * 60 + time2Minute;
                      
                      const workingStart2 = workingHours2.start * 60;
                      const workingEnd2 = workingHours2.end * 60;
                      
                      const isWorkingHour2 = (
                        workingHours2.start <= workingHours2.end
                          ? time2TotalMinutes >= workingStart2 && time2TotalMinutes < workingEnd2
                        : time2TotalMinutes >= workingStart2 || time2TotalMinutes < workingEnd2
                      );
                      
                      const isOverlap = isWorkingHour1 && isWorkingHour2;

                      return (
                        <div
                          key={`panel-tz1-${timeSlot}`}
                          className={`
                            relative h-full border-r border-gray-200 dark:border-gray-700 border-opacity-30
                            ${isInSelectedRange ? 'bg-white bg-opacity-20' : ''}
                          `}
                        >
                          <div
                            className={`
                              h-full 
                              ${isMeetingHour ? 'bg-amber-600 bg-opacity-50 dark:bg-amber-500 dark:bg-opacity-50' :
                                showOverlaps && isOverlap ? 'bg-indigo-600 bg-opacity-40 dark:bg-indigo-500 dark:bg-opacity-40' :
                                isWorkingHour1 ? 'bg-blue-600 bg-opacity-50 dark:bg-blue-500 dark:bg-opacity-50' : ''}
                            `}
                          ></div>
                        </div>
                      );
                    })}
                  </div>
                  
                  {/* Second location row */}
                  <div className="grid grid-cols-[repeat(48,minmax(0,1fr))] gap-0 h-[54px] mt-[2px]">
                    {timeSlots.map((timeSlot) => {
                      const time2HourDecimal = (timeSlot + hourDiff + 48) % 24;
                      const time2Hour = Math.floor(time2HourDecimal);
                      const time2Minute = (time2HourDecimal % 1) * 60;
                      const time2TotalMinutes = time2Hour * 60 + time2Minute;
                      
                      // Convert working hours to total minutes for comparison
                      const workingStart2 = workingHours2.start * 60;
                      const workingEnd2 = workingHours2.end * 60;
                      
                      // Check if working hour
                      const isWorkingHour2 = (
                        workingHours2.start <= workingHours2.end
                          ? time2TotalMinutes >= workingStart2 && time2TotalMinutes < workingEnd2
                        : time2TotalMinutes >= workingStart2 || time2TotalMinutes < workingEnd2
                      );
                      
                      // Also check timezone1 for this slot to determine overlap
                      const time1HourDecimal = timeSlot;
                      const time1Hour = Math.floor(time1HourDecimal);
                      const time1Minute = (time1HourDecimal % 1) * 60;
                      const time1TotalMinutes = time1Hour * 60 + time1Minute;
                      
                      const workingStart1 = workingHours1.start * 60;
                      const workingEnd1 = workingHours1.end * 60;
                      
                      const isWorkingHour1 = (
                        workingHours1.start <= workingHours1.end
                          ? time1TotalMinutes >= workingStart1 && time1TotalMinutes < workingEnd1
                        : time1TotalMinutes >= workingStart1 || time1TotalMinutes < workingEnd1
                      );
                      
                      const isOverlap = isWorkingHour1 && isWorkingHour2;
                      
                      // Check if meeting hour
                      const isMeetingHour = showMeetingTime && (
                        meetingTime.start <= meetingTime.end
                          ? time1Hour >= meetingTime.start && time1Hour < meetingTime.end
                        : time1Hour >= meetingTime.start || time1Hour < meetingTime.end
                      );
                      
                      // Check if in selected range
                      const isInSelectedRange = dragStartHour !== null && dragEndHour !== null
                        ? (dragStartHour <= dragEndHour
                            ? timeSlot >= dragStartHour && timeSlot <= dragEndHour
                          : timeSlot >= dragStartHour || timeSlot <= dragEndHour)
                        : false;

                      return (
                        <div
                          key={`panel-tz2-${timeSlot}`}
                          className={`
                            relative h-full border-r border-gray-200 dark:border-gray-700 border-opacity-30
                            ${isInSelectedRange ? 'bg-white bg-opacity-20' : ''}
                          `}
                        >
                          <div
                            className={`
                              h-full 
                              ${isMeetingHour ? 'bg-amber-600 bg-opacity-50 dark:bg-amber-500 dark:bg-opacity-50' :
                                showOverlaps && isOverlap ? 'bg-indigo-600 bg-opacity-40 dark:bg-indigo-500 dark:bg-opacity-40' :
                                isWorkingHour2 ? 'bg-purple-600 bg-opacity-50 dark:bg-purple-500 dark:bg-opacity-50' : ''}
                            `}
                          ></div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                
                {/* Time labels */}
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1 px-1">
                  <span>12a</span>
                  <span>6a</span>
                  <span>12p</span>
                  <span>6p</span>
                  <span>12a</span>
                </div>
              </div>
              
              {/* Time information */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <span className="block text-sm text-gray-600 dark:text-gray-400">{timezone1.label.split(' - ')[0]}</span>
                  <span className="block text-lg font-bold text-gray-800 dark:text-white">
                    {formatSelectedTime()}
                  </span>
                </div>
                <div>
                  <span className="block text-sm text-gray-600 dark:text-gray-400">{timezone2.label.split(' - ')[0]}</span>
                  <span className="block text-lg font-bold text-gray-800 dark:text-white">
                    {formatSelectedTime(timezone2, hourDiff)}
                  </span>
                </div>
              </div>
              
              {/* Overlap information */}
              <div className="mb-4 p-3 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800 rounded-md">
                <h4 className="text-sm font-medium text-indigo-800 dark:text-indigo-300 mb-2 flex items-center">
                  <div className="w-3 h-3 rounded-full bg-indigo-600 bg-opacity-70 dark:bg-indigo-500 mr-2"></div>
                  Working Hours Overlap
                </h4>
                
                <div className="grid grid-cols-1 gap-2">
                  <div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Total Potential Overlap</p>
                    <p className="text-sm font-medium text-indigo-800 dark:text-indigo-300">
                      {getWorkingHoursOverlap().toFixed(1)} hours
                    </p>
                  </div>
                  
                  {getSelectedTimeOverlap() > 0 && (
                    <div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Overlap in Selected Time</p>
                      <p className="text-sm font-medium text-indigo-800 dark:text-indigo-300">
                        {getSelectedTimeOverlap().toFixed(1)} hours ({Math.round((getSelectedTimeOverlap() / getTotalHoursSelected()) * 100)}% of selection)
                      </p>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Status indicators */}
              <div className="mb-4 grid grid-cols-2 gap-2">
                <div className={`text-xs rounded-md py-1 px-2 flex items-center ${isSelectedTimeInWorkingHours(1) ? 'bg-blue-200 text-blue-800 dark:bg-location1 dark:bg-opacity-20 dark:text-location1-bright' : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'}`}>
                  <div className={`w-2 h-2 rounded-full mr-2 ${isSelectedTimeInWorkingHours(1) ? 'bg-location1 bg-opacity-70' : 'bg-gray-600'}`}></div>
                  {isSelectedTimeInWorkingHours(1) ? 
                    `${timezone1.label.split(' - ')[0]} working hours` : 
                    `Outside ${timezone1.label.split(' - ')[0]} working hours`
                  }
                </div>
                <div className={`text-xs rounded-md py-1 px-2 flex items-center ${isSelectedTimeInWorkingHours(2) ? 'bg-purple-200 text-purple-800 dark:bg-location2 dark:bg-opacity-20 dark:text-location2-bright' : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'}`}>
                  <div className={`w-2 h-2 rounded-full mr-2 ${isSelectedTimeInWorkingHours(2) ? 'bg-location2 bg-opacity-70' : 'bg-gray-600'}`}></div>
                  {isSelectedTimeInWorkingHours(2) ? 
                    `${timezone2.label.split(' - ')[0]} working hours` : 
                    `Outside ${timezone2.label.split(' - ')[0]} working hours`
                  }
                </div>
              </div>
              
              {/* Meeting Time information, if applicable */}
              {showMeetingTime && (
                <div className="mb-4">
                  <div className="p-3 border border-amber-200 dark:border-amber-800 rounded-md bg-amber-50 dark:bg-amber-900/30">
                    <h4 className="text-sm font-medium text-amber-800 dark:text-amber-300 mb-2">Meeting Time</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-600 dark:text-gray-400">{timezone1.label.split(' - ')[0]}</p>
                        <p className="text-sm font-medium text-amber-800 dark:text-amber-300">
                          {time1.set({ hour: meetingTime.start, minute: 0 }).toFormat('h:mm a')} - {time1.set({ hour: meetingTime.end, minute: 0 }).toFormat('h:mm a')}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 dark:text-gray-400">{timezone2.label.split(' - ')[0]}</p>
                        <p className="text-sm font-medium text-amber-800 dark:text-amber-300">
                          {time2.set({ hour: (meetingTime.start + hourDiff + 24) % 24, minute: 0 }).toFormat('h:mm a')} - {time2.set({ hour: (meetingTime.end + hourDiff + 24) % 24, minute: 0 }).toFormat('h:mm a')}
                        </p>
                      </div>
                    </div>
                    {isSelectedTimeInMeetingHours() && (
                      <div className="mt-2 flex items-center">
                        <div className="w-2 h-2 rounded-full bg-amber-600 dark:bg-amber-500 mr-2"></div>
                        <span className="text-xs text-amber-800 dark:text-amber-300">This time overlaps with meeting hours</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {/* Copy button and total hours */}
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Total: {formatTotalSelectedHours().toFixed(1)} {formatTotalSelectedHours() === 1 ? 'hour' : 'hours'}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={copySelectedSlot}
                    className={`px-3 py-1.5 rounded ${
                      slotCopySuccess ? 'bg-green-600 text-white' : 'bg-blue-600 text-white'
                    } text-sm focus:outline-none flex items-center`}
                  >
                    {slotCopySuccess ? (
                      <>
                        <CheckIcon className="h-4 w-4 mr-1" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <ClipboardIcon className="h-4 w-4 mr-1" />
                        Copy
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ) : null}

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
