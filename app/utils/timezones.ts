import { DateTime } from 'luxon';

export interface TimezoneOption {
  value: string;
  label: string;
  offset: string;
  abbr: string;
  group: string;
}

// List of common timezones with their labels and offsets
export const timezoneOptions: TimezoneOption[] = [
  // North America
  { value: 'America/Los_Angeles', label: 'Los Angeles', offset: 'UTC-8/UTC-7', abbr: 'PT', group: 'North America' },
  { value: 'America/Denver', label: 'Denver', offset: 'UTC-7/UTC-6', abbr: 'MT', group: 'North America' },
  { value: 'America/Chicago', label: 'Chicago', offset: 'UTC-6/UTC-5', abbr: 'CT', group: 'North America' },
  { value: 'America/New_York', label: 'New York', offset: 'UTC-5/UTC-4', abbr: 'ET', group: 'North America' },
  { value: 'America/Toronto', label: 'Toronto', offset: 'UTC-5/UTC-4', abbr: 'ET', group: 'North America' },
  { value: 'America/Vancouver', label: 'Vancouver', offset: 'UTC-8/UTC-7', abbr: 'PT', group: 'North America' },
  
  // Europe
  { value: 'Europe/London', label: 'London', offset: 'UTC+0/UTC+1', abbr: 'GMT/BST', group: 'Europe' },
  { value: 'Europe/Paris', label: 'Paris', offset: 'UTC+1/UTC+2', abbr: 'CET/CEST', group: 'Europe' },
  { value: 'Europe/Berlin', label: 'Berlin', offset: 'UTC+1/UTC+2', abbr: 'CET/CEST', group: 'Europe' },
  { value: 'Europe/Madrid', label: 'Madrid', offset: 'UTC+1/UTC+2', abbr: 'CET/CEST', group: 'Europe' },
  { value: 'Europe/Rome', label: 'Rome', offset: 'UTC+1/UTC+2', abbr: 'CET/CEST', group: 'Europe' },
  
  // Asia
  { value: 'Asia/Tokyo', label: 'Tokyo', offset: 'UTC+9', abbr: 'JST', group: 'Asia' },
  { value: 'Asia/Shanghai', label: 'Shanghai', offset: 'UTC+8', abbr: 'CST', group: 'Asia' },
  { value: 'Asia/Singapore', label: 'Singapore', offset: 'UTC+8', abbr: 'SGT', group: 'Asia' },
  { value: 'Asia/Dubai', label: 'Dubai', offset: 'UTC+4', abbr: 'GST', group: 'Asia' },
  { value: 'Asia/Kolkata', label: 'Mumbai', offset: 'UTC+5:30', abbr: 'IST', group: 'Asia' },
  
  // Australia & Pacific
  { value: 'Australia/Sydney', label: 'Sydney', offset: 'UTC+10/UTC+11', abbr: 'AEST/AEDT', group: 'Australia & Pacific' },
  { value: 'Australia/Melbourne', label: 'Melbourne', offset: 'UTC+10/UTC+11', abbr: 'AEST/AEDT', group: 'Australia & Pacific' },
  { value: 'Pacific/Auckland', label: 'Auckland', offset: 'UTC+12/UTC+13', abbr: 'NZST/NZDT', group: 'Australia & Pacific' },
  
  // South America
  { value: 'America/Sao_Paulo', label: 'São Paulo', offset: 'UTC-3/UTC-2', abbr: 'BRT/BRST', group: 'South America' },
  { value: 'America/Buenos_Aires', label: 'Buenos Aires', offset: 'UTC-3', abbr: 'ART', group: 'South America' },
  
  // Africa
  { value: 'Africa/Johannesburg', label: 'Johannesburg', offset: 'UTC+2', abbr: 'SAST', group: 'Africa' },
  { value: 'Africa/Cairo', label: 'Cairo', offset: 'UTC+2', abbr: 'EET', group: 'Africa' },
];

// Group timezone options by continent/region
export const groupedTimezoneOptions = timezoneOptions.reduce((acc, option) => {
  const group = option.group;
  if (!acc[group]) {
    acc[group] = [];
  }
  acc[group].push(option);
  return acc;
}, {} as Record<string, TimezoneOption[]>);

// Find a timezone option by its value
export const findTimezoneOption = (value: string): TimezoneOption => {
  const option = timezoneOptions.find(option => option.value === value);
  if (!option) {
    // Return a default option if not found
    return {
      value,
      label: value.split('/').pop() || value,
      offset: 'Unknown',
      abbr: 'UNK',
      group: 'Other'
    };
  }
  return option;
};

// Get current time in a specific timezone
export const getCurrentTimeInTimezone = (timezone: string): DateTime => {
  return DateTime.now().setZone(timezone);
};

// Format time for display
export const formatTime = (time: DateTime, format: string = 'h:mm a'): string => {
  return time.toFormat(format);
};

// Get current offset for a timezone
export const getTimezoneOffset = (timezone: string): string => {
  const now = DateTime.now().setZone(timezone);
  return now.toFormat('ZZZZ');
};

// Get abbreviation for a timezone
export const getTimezoneAbbreviation = (timezone: string): string => {
  const now = DateTime.now().setZone(timezone);
  return now.toFormat('ZZZZ');
};

// Calculate time difference between two timezones
export const getTimeDifference = (timezone1: string, timezone2: string): number => {
  const time1 = DateTime.now().setZone(timezone1);
  const time2 = DateTime.now().setZone(timezone2);
  return time1.offset - time2.offset;
};

// Format time difference for display
export const formatTimeDifference = (hours: number): string => {
  const absHours = Math.abs(hours);
  const sign = hours >= 0 ? '+' : '-';
  return `${sign}${absHours}h`;
};

// Check if a time is within working hours
export const isWithinWorkingHours = (
  time: DateTime, 
  workingHours: { start: number; end: number }
): boolean => {
  const hour = time.hour;
  return hour >= workingHours.start && hour < workingHours.end;
};

// Find overlapping working hours between timezones
export const findOverlappingHours = (
  timezone1: string,
  timezone2: string,
  workingHours1: { start: number; end: number },
  workingHours2: { start: number; end: number }
): { start: number; end: number } | null => {
  // Convert working hours to UTC for comparison
  const now = DateTime.now();
  const tz1Start = now.setZone(timezone1).set({ hour: workingHours1.start }).toUTC().hour;
  const tz1End = now.setZone(timezone1).set({ hour: workingHours1.end }).toUTC().hour;
  const tz2Start = now.setZone(timezone2).set({ hour: workingHours2.start }).toUTC().hour;
  const tz2End = now.setZone(timezone2).set({ hour: workingHours2.end }).toUTC().hour;
  
  // Find overlap
  const overlapStart = Math.max(tz1Start, tz2Start);
  const overlapEnd = Math.min(tz1End, tz2End);
  
  if (overlapStart < overlapEnd) {
    // Convert back to local time in timezone1
    const localOverlapStart = now.setZone('UTC').set({ hour: overlapStart }).setZone(timezone1).hour;
    const localOverlapEnd = now.setZone('UTC').set({ hour: overlapEnd }).setZone(timezone1).hour;
    
    return { start: localOverlapStart, end: localOverlapEnd };
  }
  
  return null; // No overlap
}; 