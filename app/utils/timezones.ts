export interface TimezoneOption {
  readonly value: string;
  readonly label: string;
  readonly group: string;
}

// All major timezones with their proper names
export const allTimezones: TimezoneOption[] = [
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
export const groupOptions = Object.entries(groupedTimeZones)
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([group, zones]) => ({
    label: group,
    options: zones
  }));

// Find timezone by value
export const findTimezoneOption = (timezone: string): TimezoneOption => {
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