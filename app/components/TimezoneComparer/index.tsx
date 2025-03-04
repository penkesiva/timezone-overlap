'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { findOverlappingHours } from '@/app/utils/timezones';
import TimeGrid from '../TimeGrid';
import TimezoneSelector from '../TimezoneSelector';
import WorkingHoursSelector from '../WorkingHours';
import MeetingTimeSelector from '../MeetingTime';
import ColorPicker from '../ColorPicker';
import ToggleSwitch from '../ToggleSwitch';

// Define the props interface
export interface TimezoneComparerProps {
  initialTimezone1?: string;
  initialTimezone2?: string;
  initialTimezone3?: string;
  initialLabel1?: string;
  initialLabel2?: string;
  initialLabel3?: string;
  initialWorkingHours1?: { start: number; end: number };
  initialWorkingHours2?: { start: number; end: number };
  initialWorkingHours3?: { start: number; end: number };
  initialShowWorkingHours?: boolean;
  initialMeetingTime?: { start: number; end: number };
  initialShowMeetingTime?: boolean;
  initialColor1?: string;
  initialColor2?: string;
  initialColor3?: string;
  compact?: boolean;
  showThirdTimezone?: boolean;
  onTimezoneChange?: (timezone1: string, timezone2: string, timezone3?: string) => void;
  onWorkingHoursChange?: (workingHours1: { start: number; end: number }, workingHours2: { start: number; end: number }, workingHours3?: { start: number; end: number }) => void;
  onMeetingTimeChange?: (meetingTime: { start: number; end: number } | undefined) => void;
}

const TimezoneComparer = ({
  initialTimezone1 = 'America/New_York',
  initialTimezone2 = 'Europe/London',
  initialTimezone3,
  initialLabel1 = '',
  initialLabel2 = '',
  initialLabel3 = '',
  initialWorkingHours1 = { start: 9, end: 17 },
  initialWorkingHours2 = { start: 9, end: 17 },
  initialWorkingHours3 = { start: 9, end: 17 },
  initialShowWorkingHours = true,
  initialMeetingTime,
  initialShowMeetingTime = false,
  initialColor1 = 'blue',
  initialColor2 = 'purple',
  initialColor3 = 'green',
  compact = false,
  showThirdTimezone = false,
  onTimezoneChange,
  onWorkingHoursChange,
  onMeetingTimeChange
}: TimezoneComparerProps) => {
  // State for timezones
  const [timezone1, setTimezone1] = useState(initialTimezone1);
  const [timezone2, setTimezone2] = useState(initialTimezone2);
  const [timezone3, setTimezone3] = useState(initialTimezone3);
  
  // State for custom labels
  const [label1, setLabel1] = useState(initialLabel1);
  const [label2, setLabel2] = useState(initialLabel2);
  const [label3, setLabel3] = useState(initialLabel3);
  
  // State for working hours
  const [workingHours1, setWorkingHours1] = useState(initialWorkingHours1);
  const [workingHours2, setWorkingHours2] = useState(initialWorkingHours2);
  const [workingHours3, setWorkingHours3] = useState(initialWorkingHours3);
  const [showWorkingHours, setShowWorkingHours] = useState(initialShowWorkingHours);
  
  // State for meeting time
  const [meetingTime, setMeetingTime] = useState(initialMeetingTime);
  const [showMeetingTime, setShowMeetingTime] = useState(initialShowMeetingTime);
  
  // State for colors
  const [color1, setColor1] = useState(initialColor1);
  const [color2, setColor2] = useState(initialColor2);
  const [color3, setColor3] = useState(initialColor3);
  
  // State for third timezone visibility
  const [isThirdTimezoneVisible, setIsThirdTimezoneVisible] = useState(showThirdTimezone);
  
  // State for overlapping working hours
  const [overlappingHours, setOverlappingHours] = useState<{ start: number; end: number } | null>(null);
  
  // Calculate overlapping working hours when timezones or working hours change
  useEffect(() => {
    if (showWorkingHours) {
      const overlap = findOverlappingHours(timezone1, timezone2, workingHours1, workingHours2);
      setOverlappingHours(overlap);
    } else {
      setOverlappingHours(null);
    }
  }, [timezone1, timezone2, workingHours1, workingHours2, showWorkingHours]);
  
  // Call onTimezoneChange callback when timezones change
  useEffect(() => {
    if (onTimezoneChange) {
      onTimezoneChange(timezone1, timezone2, isThirdTimezoneVisible ? timezone3 : undefined);
    }
  }, [timezone1, timezone2, timezone3, isThirdTimezoneVisible, onTimezoneChange]);
  
  // Call onWorkingHoursChange callback when working hours change
  useEffect(() => {
    if (onWorkingHoursChange) {
      onWorkingHoursChange(
        workingHours1,
        workingHours2,
        isThirdTimezoneVisible ? workingHours3 : undefined
      );
    }
  }, [workingHours1, workingHours2, workingHours3, isThirdTimezoneVisible, onWorkingHoursChange]);
  
  // Call onMeetingTimeChange callback when meeting time changes
  useEffect(() => {
    if (onMeetingTimeChange) {
      onMeetingTimeChange(showMeetingTime ? meetingTime : undefined);
    }
  }, [meetingTime, showMeetingTime, onMeetingTimeChange]);
  
  // Handle timezone changes
  const handleTimezone1Change = (value: string) => {
    setTimezone1(value);
  };
  
  const handleTimezone2Change = (value: string) => {
    setTimezone2(value);
  };
  
  const handleTimezone3Change = (value: string) => {
    setTimezone3(value);
  };
  
  // Handle label changes
  const handleLabel1Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLabel1(e.target.value);
  };
  
  const handleLabel2Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLabel2(e.target.value);
  };
  
  const handleLabel3Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLabel3(e.target.value);
  };
  
  // Handle working hours changes
  const handleWorkingHours1Change = (hours: { start: number; end: number }) => {
    setWorkingHours1(hours);
  };
  
  const handleWorkingHours2Change = (hours: { start: number; end: number }) => {
    setWorkingHours2(hours);
  };
  
  const handleWorkingHours3Change = (hours: { start: number; end: number }) => {
    setWorkingHours3(hours);
  };
  
  // Handle meeting time changes
  const handleMeetingTimeChange = (time: { start: number; end: number } | undefined) => {
    setMeetingTime(time);
  };
  
  // Handle color changes
  const handleColor1Change = (color: string) => {
    setColor1(color);
  };
  
  const handleColor2Change = (color: string) => {
    setColor2(color);
  };
  
  const handleColor3Change = (color: string) => {
    setColor3(color);
  };
  
  // Toggle third timezone visibility
  const toggleThirdTimezone = () => {
    setIsThirdTimezoneVisible(!isThirdTimezoneVisible);
  };
  
  return (
    <div className={`timezone-comparer ${compact ? 'compact' : ''}`}>
      <div className="timezone-settings mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* First Timezone Settings */}
          <div className="timezone-setting-group p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Timezone 1</h3>
              <ColorPicker 
                color={color1} 
                onChange={handleColor1Change} 
                label="Color"
              />
            </div>
            
            <div className="space-y-4">
              <TimezoneSelector
                value={timezone1}
                onChange={handleTimezone1Change}
                label="Select timezone"
              />
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Custom label (optional)
                </label>
                <input
                  type="text"
                  value={label1}
                  onChange={handleLabel1Change}
                  placeholder="E.g., Home, Office, etc."
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              
              <WorkingHoursSelector
                value={workingHours1}
                onChange={handleWorkingHours1Change}
                label="Working hours"
                disabled={!showWorkingHours}
              />
            </div>
          </div>
          
          {/* Second Timezone Settings */}
          <div className="timezone-setting-group p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Timezone 2</h3>
              <ColorPicker 
                color={color2} 
                onChange={handleColor2Change} 
                label="Color"
              />
            </div>
            
            <div className="space-y-4">
              <TimezoneSelector
                value={timezone2}
                onChange={handleTimezone2Change}
                label="Select timezone"
              />
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Custom label (optional)
                </label>
                <input
                  type="text"
                  value={label2}
                  onChange={handleLabel2Change}
                  placeholder="E.g., Home, Office, etc."
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              
              <WorkingHoursSelector
                value={workingHours2}
                onChange={handleWorkingHours2Change}
                label="Working hours"
                disabled={!showWorkingHours}
              />
            </div>
          </div>
          
          {/* Third Timezone Settings (Optional) */}
          {isThirdTimezoneVisible && (
            <div className="timezone-setting-group p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium">Timezone 3</h3>
                <ColorPicker 
                  color={color3} 
                  onChange={handleColor3Change} 
                  label="Color"
                />
              </div>
              
              <div className="space-y-4">
                <TimezoneSelector
                  value={timezone3 || 'Australia/Sydney'}
                  onChange={handleTimezone3Change}
                  label="Select timezone"
                />
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Custom label (optional)
                  </label>
                  <input
                    type="text"
                    value={label3}
                    onChange={handleLabel3Change}
                    placeholder="E.g., Home, Office, etc."
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
                
                <WorkingHoursSelector
                  value={workingHours3}
                  onChange={handleWorkingHours3Change}
                  label="Working hours"
                  disabled={!showWorkingHours}
                />
              </div>
            </div>
          )}
        </div>
        
        {/* Global Settings */}
        <div className="global-settings mt-6 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <ToggleSwitch
                checked={showWorkingHours}
                onChange={setShowWorkingHours}
                label="Show working hours"
              />
            </div>
            
            <div>
              <ToggleSwitch
                checked={showMeetingTime}
                onChange={setShowMeetingTime}
                label="Show meeting time"
              />
              
              {showMeetingTime && (
                <div className="mt-3">
                  <MeetingTimeSelector
                    value={meetingTime || { start: 13, end: 14 }}
                    onChange={handleMeetingTimeChange}
                    label="Meeting time"
                  />
                </div>
              )}
            </div>
            
            <div>
              <ToggleSwitch
                checked={isThirdTimezoneVisible}
                onChange={toggleThirdTimezone}
                label="Add third timezone"
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Time Grid */}
      <div className="time-grid-container p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-x-auto">
        <TimeGrid
          timezone1={timezone1}
          timezone2={timezone2}
          timezone3={isThirdTimezoneVisible ? timezone3 : undefined}
          label1={label1}
          label2={label2}
          label3={isThirdTimezoneVisible ? label3 : undefined}
          workingHours1={workingHours1}
          workingHours2={workingHours2}
          workingHours3={isThirdTimezoneVisible ? workingHours3 : undefined}
          showWorkingHours={showWorkingHours}
          meetingTime={meetingTime}
          showMeetingTime={showMeetingTime}
          color1={color1}
          color2={color2}
          color3={color3}
        />
      </div>
      
      {/* Overlapping Working Hours */}
      {showWorkingHours && overlappingHours && (
        <div className="overlapping-hours mt-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <h3 className="text-lg font-medium text-green-800 dark:text-green-200 mb-2">
            Overlapping Working Hours
          </h3>
          <p className="text-green-700 dark:text-green-300">
            Both timezones have overlapping working hours from{' '}
            <span className="font-semibold">
              {overlappingHours.start === 0 ? '12 AM' : 
               overlappingHours.start < 12 ? `${overlappingHours.start} AM` : 
               overlappingHours.start === 12 ? '12 PM' : 
               `${overlappingHours.start - 12} PM`}
            </span>{' '}
            to{' '}
            <span className="font-semibold">
              {overlappingHours.end === 0 ? '12 AM' : 
               overlappingHours.end < 12 ? `${overlappingHours.end} AM` : 
               overlappingHours.end === 12 ? '12 PM' : 
               `${overlappingHours.end - 12} PM`}
            </span>{' '}
            in {label1 || timezone1.split('/').pop()}'s time.
          </p>
        </div>
      )}
      
      <style jsx>{`
        .timezone-comparer {
          width: 100%;
        }
        
        .compact .timezone-settings {
          display: none;
        }
        
        .timezone-setting-group {
          transition: all 0.3s ease;
        }
        
        .timezone-setting-group:hover {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        
        .time-grid-container {
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
        }
      `}</style>
    </div>
  );
};

export default TimezoneComparer; 