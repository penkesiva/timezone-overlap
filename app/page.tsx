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
  const [selectedHour, setSelectedHour] = useState<number>(9);
  const [currentTime, setCurrentTime] = useState<DateTime | null>(null);
  const [mounted, setMounted] = useState(false);
  const [slotCopySuccess, setSlotCopySuccess] = useState(false);

  useEffect(() => {
    setMounted(true);
    const updateTime = () => {
      setCurrentTime(DateTime.now());
    };
    
    updateTime();
    const interval = setInterval(updateTime, 1000);
    
    return () => clearInterval(interval);
  }, []);

  const workingHours = Array.from({ length: 24 }, (_, i) => i);

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

  const copySelectedSlot = useCallback(async () => {
    if (selectedHour === null) return;

    const time1Hour = selectedHour;
    const time2Hour = (selectedHour + hourDiff + 24) % 24;
    
    const selectedTime1 = time1.set({ hour: time1Hour, minute: 0, second: 0 });
    const selectedTime2 = time2.set({ hour: time2Hour, minute: 0, second: 0 });
    
    const text = `Selected time slot:
${timezone1.label}: ${selectedTime1.toFormat('h:00 a').padEnd(8, ' ')} (${selectedTime1.toFormat('EEE, MMM d')})
${timezone2.label}: ${selectedTime2.toFormat('h:00 a').padEnd(8, ' ')} (${selectedTime2.toFormat('EEE, MMM d')})`;

    const success = await copyToClipboard(text);
    if (success) {
      setSlotCopySuccess(true);
      setTimeout(() => setSlotCopySuccess(false), 2000);
    } else {
      alert('Failed to copy to clipboard. Please try selecting and copying manually.');
    }
  }, [selectedHour, timezone1.label, timezone2.label, time1, time2, hourDiff]);

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-location1-bright">Loading...</div>
      </div>
    );
  }

  return (
    <main className="container relative mx-auto px-4 py-8 min-h-screen">
      <h1 className="text-4xl font-bold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-gray-800 to-gray-900 dark:from-location1-bright dark:to-location2-bright">
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
              <div className="flex items-center space-x-2">
                <ClockIcon className="h-5 w-5 text-location1" />
                <div>
                  <span className="text-location1-bright font-mono tabular-nums dark:text-location1-bright text-blue-600">{time1.toFormat('h:mm a').padEnd(8, ' ')}</span>
                  <span className="text-gray-500 dark:text-gray-400 text-sm ml-2">
                    {time1.toFormat('EEE, MMM d')}
                  </span>
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
              <div className="flex items-center space-x-2">
                <ClockIcon className="h-5 w-5 text-location2" />
                <div>
                  <span className="text-location2-bright font-mono tabular-nums dark:text-location2-bright text-orange-600">{time2.toFormat('h:mm a').padEnd(8, ' ')}</span>
                  <span className="text-gray-500 dark:text-gray-400 text-sm ml-2">
                    {time2.toFormat('EEE, MMM d')}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="relative bg-gray-800 rounded-lg p-6">
            {/* Add color legend */}
            <div className="flex flex-wrap gap-4 mb-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-location1 bg-opacity-50 rounded"></div>
                <span className="text-location1-bright">{timezone1.label} working hours (9:00 AM-5:00 PM)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-location2 bg-opacity-50 rounded"></div>
                <span className="text-location2-bright">{timezone2.label} working hours (9:00 AM-5:00 PM)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-[#AF69EE] rounded"></div>
                <span className="text-[#AF69EE]">Overlapping working hours</span>
              </div>
            </div>

            <div className="grid grid-cols-24 gap-0">
              {workingHours.map((hour) => {
                const time1Hour = hour;
                const time2Hour = (hour + hourDiff + 24) % 24;
                
                const isWorkingHour1 = time1Hour >= 9 && time1Hour <= 17;
                const isWorkingHour2 = time2Hour >= 9 && time2Hour <= 17;
                const isOverlap = isWorkingHour1 && isWorkingHour2;

                return (
                  <div
                    key={hour}
                    className={`relative h-32 cursor-pointer ${
                      selectedHour === hour ? 'ring-2 ring-white' : ''
                    }`}
                    onMouseEnter={() => setHoveredHour(hour)}
                    onMouseLeave={() => setHoveredHour(null)}
                    onClick={() => setSelectedHour(hour)}
                  >
                    <div
                      className={`h-full border-r border-gray-700 ${
                        isWorkingHour1 ? 'bg-location1 bg-opacity-50' : 'bg-opacity-0'
                      }`}
                    />
                    <div
                      className={`absolute inset-0 ${
                        isWorkingHour2 ? 'bg-location2 bg-opacity-50' : 'bg-opacity-0'
                      }`}
                    />
                    {isOverlap && (
                      <div className="absolute inset-0 bg-[#AF69EE] bg-opacity-50 mix-blend-multiply" />
                    )}
                    {hoveredHour === hour && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute top-0 left-0 right-0 h-full bg-white bg-opacity-20 z-10"
                      />
                    )}
                    {hoveredHour === hour && (
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 px-3 py-1 rounded text-sm whitespace-nowrap shadow-lg z-20">
                        <span className={`font-mono tabular-nums ${isWorkingHour1 ? 'text-location1-bright' : 'text-location1'}`}>
                          {time1.set({ hour: time1Hour, minute: 0, second: 0 }).toFormat('h:00 a').padEnd(8, ' ')}
                        </span>
                        {' / '}
                        <span className={`font-mono tabular-nums ${isWorkingHour2 ? 'text-location2-bright' : 'text-location2'}`}>
                          {time2.set({ hour: time2Hour, minute: 0, second: 0 }).toFormat('h:00 a').padEnd(8, ' ')}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            
            <div className="absolute bottom-2 left-4 right-4 flex justify-between text-sm text-gray-400">
              <span>12:00 AM</span>
              <span>12:00 PM</span>
              <span>11:59 PM</span>
            </div>
          </div>

          {/* Selected Time Slot Display */}
          {selectedHour !== null ? (
            <div className="mt-6 p-4 bg-gray-800 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-gray-300">Selected Time Slot:</h3>
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-location1-bright font-mono tabular-nums">
                        {timezone1.label}: {time1.set({ hour: selectedHour, minute: 0, second: 0 }).toFormat('h:00 a').padEnd(8, ' ')}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-location2-bright font-mono tabular-nums">
                        {timezone2.label}: {time2.set({ hour: (selectedHour + hourDiff + 24) % 24, minute: 0, second: 0 }).toFormat('h:00 a').padEnd(8, ' ')}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={copySelectedSlot}
                  className={`p-2 rounded-lg transition-colors ${
                    slotCopySuccess ? 'bg-green-600 text-white' : 'bg-gray-700 hover:bg-gray-600 text-white dark:text-white'
                  }`}
                  aria-label="Copy selected time slot"
                >
                  {slotCopySuccess ? (
                    <CheckIcon className="h-5 w-5" />
                  ) : (
                    <ClipboardIcon className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>
          ) : (
            <div className="mt-6 p-4 bg-gray-800 rounded-lg">
              <div className="flex items-center gap-2 text-gray-400">
                <ClockIcon className="h-5 w-5" />
                <p>Click on any time slot in the grid above to see and copy the corresponding times.</p>
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
