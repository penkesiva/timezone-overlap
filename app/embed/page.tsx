'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { groupOptions } from '@/app/utils/timezones';
import { ClipboardIcon, CheckIcon } from '@heroicons/react/24/outline';

// Dynamically load components
const Select = dynamic(() => import('react-select'), { ssr: false });
const EmbeddableWidget = dynamic(() => import('@/app/components/EmbeddableWidget'), { ssr: false });

export default function EmbedPage() {
  // Widget configuration state
  const [timezone1, setTimezone1] = useState<string>('America/New_York');
  const [timezone2, setTimezone2] = useState<string>('Asia/Kolkata');
  const [label1, setLabel1] = useState<string>('');
  const [label2, setLabel2] = useState<string>('');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [showDate, setShowDate] = useState<boolean>(true);
  const [compact, setCompact] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [origin, setOrigin] = useState<string>('');
  const [mounted, setMounted] = useState<boolean>(false);
  
  // Add working hours state
  const [workingHours1, setWorkingHours1] = useState({ start: 9, end: 17 });
  const [workingHours2, setWorkingHours2] = useState({ start: 9, end: 17 });
  const [showWorkingHours, setShowWorkingHours] = useState<boolean>(true);
  
  // Add meeting time state
  const [meetingTime, setMeetingTime] = useState({ start: 13, end: 14 }); // Default to 1-2 PM
  const [showMeetingTime, setShowMeetingTime] = useState<boolean>(true);
  
  // Set origin and mounted on client, load saved timezones from localStorage
  useEffect(() => {
    setOrigin(window.location.origin);
    setMounted(true);
    
    // Load saved timezones from localStorage if available
    try {
      const savedTimezone1 = localStorage.getItem('timezone1');
      const savedTimezone2 = localStorage.getItem('timezone2');
      
      if (savedTimezone1) {
        setTimezone1(savedTimezone1);
      }
      
      if (savedTimezone2) {
        setTimezone2(savedTimezone2);
      }
      
      // Load theme preference
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
        setTheme(savedTheme as 'light' | 'dark');
      }
      
      // Load working hours
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
    } catch (e) {
      console.error('Error accessing localStorage:', e);
    }
    
    // Setup event listener for theme changes
    const handleThemeChange = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail && customEvent.detail.theme) {
        setTheme(customEvent.detail.theme as 'light' | 'dark');
      }
    };
    
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'theme' && e.newValue) {
        setTheme(e.newValue as 'light' | 'dark');
      }
    };
    
    window.addEventListener('themeChange', handleThemeChange);
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('themeChange', handleThemeChange);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);
  
  // Generate embed code based on current configuration
  const getEmbedCode = () => {
    return `<script
  src="${origin}/api/widget?origin=${encodeURIComponent(origin)}"
  data-timezone1="${timezone1}"
  data-timezone2="${timezone2}"
  data-label1="${label1}"
  data-label2="${label2}"
  data-theme="${theme}"
  data-show-date="${showDate}"
  data-compact="${compact}"
  data-working-hours1-start="${workingHours1.start}"
  data-working-hours1-end="${workingHours1.end}"
  data-working-hours2-start="${workingHours2.start}"
  data-working-hours2-end="${workingHours2.end}"
  data-show-working-hours="${showWorkingHours}"
  data-meeting-time-start="${meetingTime.start}"
  data-meeting-time-end="${meetingTime.end}"
  data-show-meeting-time="${showMeetingTime}"
  async
></script>`;
  };
  
  // Copy embed code to clipboard
  const handleCopyClick = () => {
    navigator.clipboard.writeText(getEmbedCode()).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // Handle selection change for timezone1
  const handleTimezone1Change = (selected: any) => {
    if (selected && selected.value) {
      setTimezone1(selected.value);
      // Save to localStorage for persistence between pages
      try {
        localStorage.setItem('timezone1', selected.value);
      } catch (e) {
        console.error('Error saving to localStorage:', e);
      }
    }
  };

  // Handle selection change for timezone2
  const handleTimezone2Change = (selected: any) => {
    if (selected && selected.value) {
      setTimezone2(selected.value);
      // Save to localStorage for persistence between pages
      try {
        localStorage.setItem('timezone2', selected.value);
      } catch (e) {
        console.error('Error saving to localStorage:', e);
      }
    }
  };

  // Find the current timezone option for timezone1
  const findTimezone1Option = () => {
    for (const group of groupOptions) {
      const option = group.options.find(o => o.value === timezone1);
      if (option) return option;
    }
    return null;
  };

  // Find the current timezone option for timezone2
  const findTimezone2Option = () => {
    for (const group of groupOptions) {
      const option = group.options.find(o => o.value === timezone2);
      if (option) return option;
    }
    return null;
  };
  
  // Format working hours (12-hour format with AM/PM)
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

  // Handle working hours input change
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
        const newWorkingHours = {...workingHours1, [type]: hourValue};
        setWorkingHours1(newWorkingHours);
        
        // Save to localStorage
        try {
          localStorage.setItem('workingHours1', JSON.stringify(newWorkingHours));
        } catch (e) {
          console.error('Error saving to localStorage:', e);
        }
      } else {
        const newWorkingHours = {...workingHours2, [type]: hourValue};
        setWorkingHours2(newWorkingHours);
        
        // Save to localStorage
        try {
          localStorage.setItem('workingHours2', JSON.stringify(newWorkingHours));
        } catch (e) {
          console.error('Error saving to localStorage:', e);
        }
      }
    } catch (error) {
      console.error("Error parsing time:", error);
      // Don't update state on error
    }
  };
  
  if (!mounted) {
    return <div className="container mx-auto px-4 py-8 max-w-6xl">Loading...</div>;
  }
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Embed Timezone Widget</h1>
        <p className="text-gray-600 dark:text-gray-300">
          Customize the widget and add it to your website.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Configuration Panel */}
        <div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Widget Configuration</h2>
            
            <div className="space-y-4">
              {/* Timezone 1 Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                  First Timezone
                </label>
                <Select
                  options={groupOptions}
                  onChange={handleTimezone1Change}
                  value={findTimezone1Option()}
                  className="basic-select"
                  classNamePrefix="select"
                  styles={{
                    control: (base) => ({
                      ...base,
                      backgroundColor: theme === 'dark' ? '#374151' : base.backgroundColor,
                      borderColor: theme === 'dark' ? '#4B5563' : base.borderColor,
                    }),
                    option: (base, state) => ({
                      ...base,
                      backgroundColor: theme === 'dark' 
                        ? (state.isSelected ? '#2563EB' : (state.isFocused ? '#4B5563' : '#1F2937'))
                        : (state.isSelected ? base.backgroundColor : (state.isFocused ? '#F3F4F6' : base.backgroundColor)),
                      color: theme === 'dark' ? '#F9FAFB' : base.color,
                    }),
                    menu: (base) => ({
                      ...base,
                      backgroundColor: theme === 'dark' ? '#1F2937' : base.backgroundColor,
                    }),
                    singleValue: (base) => ({
                      ...base,
                      color: theme === 'dark' ? '#F9FAFB' : base.color,
                    }),
                    input: (base) => ({
                      ...base,
                      color: theme === 'dark' ? '#F9FAFB' : base.color,
                    }),
                    placeholder: (base) => ({
                      ...base,
                      color: theme === 'dark' ? '#9CA3AF' : base.color,
                    }),
                    multiValue: (base) => ({
                      ...base,
                      backgroundColor: theme === 'dark' ? '#4B5563' : base.backgroundColor,
                    }),
                    multiValueLabel: (base) => ({
                      ...base,
                      color: theme === 'dark' ? '#F9FAFB' : base.color,
                    }),
                    multiValueRemove: (base) => ({
                      ...base,
                      color: theme === 'dark' ? '#D1D5DB' : base.color,
                      ':hover': {
                        backgroundColor: theme === 'dark' ? '#6B7280' : (base[':hover']?.backgroundColor || '#f8f9fa'),
                        color: theme === 'dark' ? '#F3F4F6' : (base[':hover']?.color || '#212529'),
                      },
                    }),
                  }}
                />
              </div>
              
              {/* Custom Label 1 and Working Hours 1 */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                    Custom Label (optional)
                  </label>
                  <input
                    type="text"
                    value={label1}
                    onChange={e => setLabel1(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm p-2 border"
                    placeholder="Max 8 chars"
                    maxLength={8}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                    Working Hours - {label1 || findTimezone1Option()?.label.split(' - ')[0] || 'USA'}
                  </label>
                  <div className="flex space-x-2 items-center">
                    <input
                      type="text"
                      className="w-24 px-2 py-1 rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm border"
                      placeholder="9:00 AM"
                      value={formatWorkingHours(workingHours1.start)}
                      onChange={(e) => handleWorkingHoursChange(1, 'start', e.target.value)}
                    />
                    <span className="text-gray-500 dark:text-gray-400">to</span>
                    <input
                      type="text"
                      className="w-24 px-2 py-1 rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm border"
                      placeholder="5:00 PM"
                      value={formatWorkingHours(workingHours1.end)}
                      onChange={(e) => handleWorkingHoursChange(1, 'end', e.target.value)}
                    />
                  </div>
                </div>
              </div>
              
              {/* Divider */}
              <div className="my-4 border-t border-gray-200 dark:border-gray-700 opacity-50"></div>
              
              {/* Timezone 2 Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                  Second Timezone
                </label>
                <Select
                  options={groupOptions}
                  onChange={handleTimezone2Change}
                  value={findTimezone2Option()}
                  className="basic-select"
                  classNamePrefix="select"
                  styles={{
                    control: (base) => ({
                      ...base,
                      backgroundColor: theme === 'dark' ? '#374151' : base.backgroundColor,
                      borderColor: theme === 'dark' ? '#4B5563' : base.borderColor,
                    }),
                    option: (base, state) => ({
                      ...base,
                      backgroundColor: theme === 'dark' 
                        ? (state.isSelected ? '#2563EB' : (state.isFocused ? '#4B5563' : '#1F2937'))
                        : (state.isSelected ? base.backgroundColor : (state.isFocused ? '#F3F4F6' : base.backgroundColor)),
                      color: theme === 'dark' ? '#F9FAFB' : base.color,
                    }),
                    menu: (base) => ({
                      ...base,
                      backgroundColor: theme === 'dark' ? '#1F2937' : base.backgroundColor,
                    }),
                    singleValue: (base) => ({
                      ...base,
                      color: theme === 'dark' ? '#F9FAFB' : base.color,
                    }),
                    input: (base) => ({
                      ...base,
                      color: theme === 'dark' ? '#F9FAFB' : base.color,
                    }),
                    placeholder: (base) => ({
                      ...base,
                      color: theme === 'dark' ? '#9CA3AF' : base.color,
                    }),
                    multiValue: (base) => ({
                      ...base,
                      backgroundColor: theme === 'dark' ? '#4B5563' : base.backgroundColor,
                    }),
                    multiValueLabel: (base) => ({
                      ...base,
                      color: theme === 'dark' ? '#F9FAFB' : base.color,
                    }),
                    multiValueRemove: (base) => ({
                      ...base,
                      color: theme === 'dark' ? '#D1D5DB' : base.color,
                      ':hover': {
                        backgroundColor: theme === 'dark' ? '#6B7280' : (base[':hover']?.backgroundColor || '#f8f9fa'),
                        color: theme === 'dark' ? '#F3F4F6' : (base[':hover']?.color || '#212529'),
                      },
                    }),
                  }}
                />
              </div>
              
              {/* Custom Label 2 and Working Hours 2 */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                    Custom Label (optional)
                  </label>
                  <input
                    type="text"
                    value={label2}
                    onChange={e => setLabel2(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm p-2 border"
                    placeholder="Max 8 chars"
                    maxLength={8}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                    Working Hours - {label2 || findTimezone2Option()?.label.split(' - ')[0] || 'Peru'}
                  </label>
                  <div className="flex space-x-2 items-center">
                    <input
                      type="text"
                      className="w-24 px-2 py-1 rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm border"
                      placeholder="9:00 AM"
                      value={formatWorkingHours(workingHours2.start)}
                      onChange={(e) => handleWorkingHoursChange(2, 'start', e.target.value)}
                    />
                    <span className="text-gray-500 dark:text-gray-400">to</span>
                    <input
                      type="text"
                      className="w-24 px-2 py-1 rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm border"
                      placeholder="5:00 PM"
                      value={formatWorkingHours(workingHours2.end)}
                      onChange={(e) => handleWorkingHoursChange(2, 'end', e.target.value)}
                    />
                  </div>
                </div>
              </div>
              
              {/* Divider */}
              <div className="my-4 border-t border-gray-200 dark:border-gray-700 opacity-50"></div>
              
              {/* Meeting Time Configuration */}
              <div>
                <label className="block text-base font-medium text-amber-500 dark:text-amber-300 mb-2">
                  Meeting Time (Local Time)
                </label>
                <div className="flex space-x-2 items-center">
                  <input
                    type="text"
                    className="w-24 px-2 py-1 rounded-md border-amber-300 dark:border-amber-500 shadow-sm focus:border-amber-500 focus:ring-amber-500 dark:bg-gray-700 dark:text-white sm:text-sm border"
                    placeholder="1:00 PM"
                    value={formatWorkingHours(meetingTime.start)}
                    onChange={(e) => {
                      try {
                        // Parse the input time
                        const timeParts = e.target.value.match(/(\d+)(?::(\d+))?\s*(am|pm|a|p)?/i);
                        if (!timeParts) return;
                        
                        let hour = parseInt(timeParts[1], 10);
                        const ampm = timeParts[3] ? timeParts[3].toLowerCase() : null;
                        
                        // Handle 12-hour format
                        if (ampm === 'pm' || ampm === 'p') {
                          if (hour < 12) hour += 12;
                        } else if (ampm === 'am' || ampm === 'a') {
                          if (hour === 12) hour = 0;
                        }
                        
                        setMeetingTime({...meetingTime, start: hour});
                      } catch (error) {
                        console.error("Error parsing time:", error);
                      }
                    }}
                  />
                  <span className="text-gray-500 dark:text-gray-400">to</span>
                  <input
                    type="text"
                    className="w-24 px-2 py-1 rounded-md border-amber-300 dark:border-amber-500 shadow-sm focus:border-amber-500 focus:ring-amber-500 dark:bg-gray-700 dark:text-white sm:text-sm border"
                    placeholder="2:00 PM"
                    value={formatWorkingHours(meetingTime.end)}
                    onChange={(e) => {
                      try {
                        // Parse the input time
                        const timeParts = e.target.value.match(/(\d+)(?::(\d+))?\s*(am|pm|a|p)?/i);
                        if (!timeParts) return;
                        
                        let hour = parseInt(timeParts[1], 10);
                        const ampm = timeParts[3] ? timeParts[3].toLowerCase() : null;
                        
                        // Handle 12-hour format
                        if (ampm === 'pm' || ampm === 'p') {
                          if (hour < 12) hour += 12;
                        } else if (ampm === 'am' || ampm === 'a') {
                          if (hour === 12) hour = 0;
                        }
                        
                        setMeetingTime({...meetingTime, end: hour});
                      } catch (error) {
                        console.error("Error parsing time:", error);
                      }
                    }}
                  />
                </div>
              </div>
              
              {/* Theme Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                  Theme
                </label>
                <div className="mt-1 flex space-x-4">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      className="form-radio text-blue-600"
                      name="theme"
                      value="light"
                      checked={theme === 'light'}
                      onChange={() => setTheme('light')}
                    />
                    <span className="ml-2 text-sm dark:text-gray-300">Light</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      className="form-radio text-blue-600"
                      name="theme"
                      value="dark"
                      checked={theme === 'dark'}
                      onChange={() => setTheme('dark')}
                    />
                    <span className="ml-2 text-sm dark:text-gray-300">Dark</span>
                  </label>
                </div>
              </div>
              
              {/* Display Options */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                  Display Options
                </label>
                <div className="mt-1 space-y-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="form-checkbox text-blue-600"
                      checked={compact}
                      onChange={(e) => setCompact(e.target.checked)}
                    />
                    <span className="ml-2 text-sm dark:text-gray-300">Compact mode</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="form-checkbox text-blue-600"
                      checked={showDate}
                      onChange={(e) => setShowDate(e.target.checked)}
                    />
                    <span className="ml-2 text-sm dark:text-gray-300">Show date</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="form-checkbox text-blue-600"
                      checked={showWorkingHours}
                      onChange={(e) => setShowWorkingHours(e.target.checked)}
                    />
                    <span className="ml-2 text-sm dark:text-gray-300">Show working hours</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="form-checkbox text-amber-500"
                      checked={showMeetingTime}
                      onChange={(e) => setShowMeetingTime(e.target.checked)}
                    />
                    <span className="ml-2 text-sm text-amber-600 dark:text-amber-300">Show meeting time</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Preview and Embed Code */}
        <div>
          {/* Preview */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow mb-6">
            <h2 className="text-xl font-semibold mb-4">Preview Widget</h2>
            <div>
              {origin && (
                <EmbeddableWidget 
                  timezone1={timezone1}
                  timezone2={timezone2}
                  label1={label1}
                  label2={label2}
                  theme={theme}
                  showDate={showDate}
                  compact={compact}
                  workingHours1Start={workingHours1.start}
                  workingHours1End={workingHours1.end}
                  workingHours2Start={workingHours2.start}
                  workingHours2End={workingHours2.end}
                  showWorkingHours={showWorkingHours}
                  meetingTimeStart={meetingTime.start}
                  meetingTimeEnd={meetingTime.end}
                  showMeetingTime={showMeetingTime}
                />
              )}
            </div>
          </div>
          
          {/* Embed Code */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Embed Code</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-2 text-sm">
              Copy and paste this code into your website where you want the widget to appear.
            </p>
            <div className="relative">
              <pre className="bg-gray-100 dark:bg-gray-700 p-4 rounded text-sm overflow-x-auto whitespace-pre-wrap dark:text-gray-200">
                {getEmbedCode()}
              </pre>
              <button
                onClick={handleCopyClick}
                className="absolute top-2 right-2 p-2 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 rounded transition"
                title="Copy to clipboard"
              >
                {copied ? (
                  <CheckIcon className="h-5 w-5 text-green-600 dark:text-green-400" />
                ) : (
                  <ClipboardIcon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-8 bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700 p-4 rounded">
        <h3 className="font-bold text-blue-800 dark:text-blue-300 mb-2">Usage Tips</h3>
        <ul className="list-disc list-inside text-blue-700 dark:text-blue-200 text-sm space-y-1">
          <li>The widget auto-updates every minute.</li>
          <li>You can place the widget in any HTML container on your site.</li>
          <li>Adjust the custom labels to better identify each timezone.</li>
          <li>The widget works with light and dark themes to match your site design.</li>
          <li>The compact mode is useful for sidebars or smaller spaces.</li>
        </ul>
      </div>
    </div>
  );
} 