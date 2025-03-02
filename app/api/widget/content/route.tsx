import { NextResponse } from 'next/server';
import { DateTime } from 'luxon';
import { findTimezoneOption } from '@/app/utils/timezones';

/**
 * This API route renders the HTML content for the embeddable widget
 * based on the query parameters passed from the client.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  
  // Get widget configuration from query parameters
  const timezone1 = searchParams.get('timezone1') || 'America/New_York';
  const timezone2 = searchParams.get('timezone2') || 'Asia/Kolkata';
  const label1 = searchParams.get('label1') || '';
  const label2 = searchParams.get('label2') || '';
  const theme = (searchParams.get('theme') || 'light') as 'light' | 'dark';
  const showDate = searchParams.get('showDate') !== 'false';
  const compact = searchParams.get('compact') === 'true';
  
  // Get current time data
  const currentTime = DateTime.now();
  const time1 = currentTime.setZone(timezone1);
  const time2 = currentTime.setZone(timezone2);
  
  // Use provided labels or get from timezone data
  const tz1Label = label1 || findTimezoneOption(timezone1).label;
  const tz2Label = label2 || findTimezoneOption(timezone2).label;
  
  const timeFormat = compact ? 'h:mm a' : 'h:mm:ss a';
  const dateFormat = 'EEE, MMM d';
  
  // Create styling based on theme
  const bgClass = theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-900';
  const borderClass = theme === 'dark' ? 'border-gray-700' : 'border-gray-200';
  const subtitleClass = theme === 'dark' ? 'text-gray-300' : 'text-gray-500';
  const linkClass = theme === 'dark' ? 'text-blue-400' : 'text-blue-600';
  const timeBlockBg = theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50';
  const labelClass = theme === 'dark' ? 'text-gray-400' : 'text-gray-600';
  const dateClass = 'text-gray-500';
  
  // Generate HTML for the widget directly
  const widgetHtml = `
    <div class="timezone-widget font-sans ${bgClass} border ${borderClass} rounded-lg shadow overflow-hidden" style="max-width: ${compact ? '300px' : '400px'}">
      <div class="p-3">
        <div class="flex justify-between items-center">
          <h3 class="text-sm font-medium ${subtitleClass}">
            Timezone Comparison
          </h3>
          <a 
            href="https://timezoneoverlap.net" 
            target="_blank" 
            rel="noopener noreferrer"
            class="text-xs ${linkClass} hover:underline"
          >
            timezoneoverlap.net
          </a>
        </div>
        
        <div class="mt-3 grid ${compact ? 'grid-cols-1 gap-2' : 'grid-cols-2 gap-4'}">
          <!-- First Timezone -->
          <div class="p-2 rounded ${timeBlockBg}">
            <div class="flex flex-col">
              <span class="text-xs font-medium ${labelClass}">
                ${tz1Label}
              </span>
              <span class="text-lg font-bold">
                ${time1.toFormat(timeFormat)}
              </span>
              ${showDate ? `<span class="text-xs mt-1 ${dateClass}">${time1.toFormat(dateFormat)}</span>` : ''}
            </div>
          </div>
          
          <!-- Second Timezone -->
          <div class="p-2 rounded ${timeBlockBg}">
            <div class="flex flex-col">
              <span class="text-xs font-medium ${labelClass}">
                ${tz2Label}
              </span>
              <span class="text-lg font-bold">
                ${time2.toFormat(timeFormat)}
              </span>
              ${showDate ? `<span class="text-xs mt-1 ${dateClass}">${time2.toFormat(dateFormat)}</span>` : ''}
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
  
  return new NextResponse(widgetHtml, {
    headers: {
      'Content-Type': 'text/html',
      'Cache-Control': 'max-age=60', // Short cache to ensure relatively fresh content
      'Access-Control-Allow-Origin': '*',
    },
  });
} 