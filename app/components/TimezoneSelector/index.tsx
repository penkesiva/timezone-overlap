'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { ActionMeta, FormatOptionLabelMeta } from 'react-select';
import { timezoneOptions, TimezoneOption, groupedTimezoneOptions } from '@/app/utils/timezones';

// Dynamically import react-select to avoid SSR issues
const Select = dynamic(() => import('react-select'), { ssr: false });

export interface TimezoneSelectorProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  isDisabled?: boolean;
  className?: string;
}

const TimezoneSelector = ({
  value,
  onChange,
  label = 'Select Timezone',
  placeholder = 'Search for a timezone...',
  isDisabled = false,
  className = ''
}: TimezoneSelectorProps) => {
  const [mounted, setMounted] = useState(false);
  const [selectedOption, setSelectedOption] = useState<TimezoneOption | null>(null);
  
  // Set mounted state on client-side
  useEffect(() => {
    setMounted(true);
    
    // Find the selected timezone option
    const option = timezoneOptions.find(option => option.value === value);
    if (option) {
      setSelectedOption(option);
    }
  }, [value]);
  
  // Format the timezone options for react-select
  const formatGroupOptions = () => {
    return Object.entries(groupedTimezoneOptions)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([group, options]) => ({
        label: group,
        options
      }));
  };
  
  // Handle timezone selection
  const handleChange = (
    newValue: unknown,
    actionMeta: ActionMeta<unknown>
  ) => {
    const option = newValue as TimezoneOption | null;
    if (option) {
      onChange(option.value);
      setSelectedOption(option);
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
      }
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
    }),
    menu: (provided: any) => ({
      ...provided,
      zIndex: 10
    }),
    groupHeading: (provided: any) => ({
      ...provided,
      fontSize: '0.875rem',
      fontWeight: 600,
      color: '#6b7280',
      textTransform: 'none',
      marginBottom: '0.5rem'
    })
  };
  
  // Format option label
  const formatOptionLabel = (
    data: unknown,
    formatOptionLabelMeta: FormatOptionLabelMeta<unknown>
  ) => {
    const option = data as TimezoneOption;
    return (
      <div className="flex justify-between items-center">
        <div>{option.label}</div>
        <div className="text-xs text-gray-500 dark:text-gray-400">{option.offset}</div>
      </div>
    );
  };
  
  return (
    <div className={`timezone-selector ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {label}
        </label>
      )}
      
      {mounted ? (
        <Select
          value={selectedOption}
          onChange={handleChange}
          options={formatGroupOptions()}
          placeholder={placeholder}
          isDisabled={isDisabled}
          className="basic-single"
          classNamePrefix="select"
          isSearchable
          styles={customStyles}
          formatOptionLabel={formatOptionLabel}
        />
      ) : (
        <div className="h-10 w-full bg-gray-100 dark:bg-gray-700 rounded animate-pulse"></div>
      )}
    </div>
  );
};

export default TimezoneSelector; 