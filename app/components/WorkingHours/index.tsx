'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import react-select to avoid SSR issues
const Select = dynamic(() => import('react-select'), { ssr: false });

export interface WorkingHoursSelectorProps {
  value: { start: number; end: number };
  onChange: (hours: { start: number; end: number }) => void;
  label?: string;
  disabled?: boolean;
}

const WorkingHoursSelector = ({
  value,
  onChange,
  label = 'Working Hours',
  disabled = false
}: WorkingHoursSelectorProps) => {
  const [mounted, setMounted] = useState(false);
  
  // Set mounted state on client-side
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Create hour options (0-23)
  const hourOptions = Array.from({ length: 24 }, (_, i) => ({
    value: i,
    label: i === 0 ? '12 AM' : i < 12 ? `${i} AM` : i === 12 ? '12 PM' : `${i - 12} PM`
  }));
  
  // Format time for display
  const formatTime = (hour: number) => {
    return hour === 0 ? '12 AM' : hour < 12 ? `${hour} AM` : hour === 12 ? '12 PM' : `${hour - 12} PM`;
  };
  
  // Handle start hour change
  const handleStartChange = (option: any) => {
    if (option && option.value !== undefined) {
      const newStart = option.value;
      // Ensure end time is after start time
      const newEnd = newStart >= value.end ? newStart + 1 : value.end;
      onChange({ start: newStart, end: newEnd > 23 ? 23 : newEnd });
    }
  };
  
  // Handle end hour change
  const handleEndChange = (option: any) => {
    if (option && option.value !== undefined) {
      const newEnd = option.value;
      // Ensure start time is before end time
      const newStart = newEnd <= value.start ? newEnd - 1 : value.start;
      onChange({ start: newStart < 0 ? 0 : newStart, end: newEnd });
    }
  };
  
  // Custom styles for react-select
  const customStyles = {
    control: (provided: any, state: any) => ({
      ...provided,
      borderColor: state.isFocused ? '#3b82f6' : '#d1d5db',
      boxShadow: state.isFocused ? '0 0 0 1px #3b82f6' : 'none',
      '&:hover': {
        borderColor: state.isFocused ? '#3b82f6' : '#9ca3af'
      },
      opacity: disabled ? 0.6 : 1,
      cursor: disabled ? 'not-allowed' : 'default'
    }),
    option: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: state.isSelected 
        ? '#3b82f6' 
        : state.isFocused 
          ? '#e5e7eb' 
          : 'transparent',
      color: state.isSelected ? 'white' : '#374151',
      cursor: 'pointer',
      ':active': {
        backgroundColor: state.isSelected ? '#3b82f6' : '#d1d5db'
      }
    })
  };
  
  return (
    <div className="working-hours-selector">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        {label}
      </label>
      
      {mounted ? (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Select
              value={hourOptions.find(option => option.value === value.start)}
              onChange={handleStartChange}
              options={hourOptions}
              placeholder="Start time"
              isDisabled={disabled}
              styles={customStyles}
              className="basic-single"
              classNamePrefix="select"
            />
          </div>
          <div>
            <Select
              value={hourOptions.find(option => option.value === value.end)}
              onChange={handleEndChange}
              options={hourOptions}
              placeholder="End time"
              isDisabled={disabled}
              styles={customStyles}
              className="basic-single"
              classNamePrefix="select"
            />
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          <div className="h-10 bg-gray-100 dark:bg-gray-700 rounded animate-pulse"></div>
          <div className="h-10 bg-gray-100 dark:bg-gray-700 rounded animate-pulse"></div>
        </div>
      )}
      
      {mounted && (
        <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          {formatTime(value.start)} - {formatTime(value.end)}
        </div>
      )}
    </div>
  );
};

export default WorkingHoursSelector; 