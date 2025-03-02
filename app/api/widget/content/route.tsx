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
  
  // Get working hours configuration
  const workingHours1Start = parseInt(searchParams.get('workingHours1Start') || '9', 10);
  const workingHours1End = parseInt(searchParams.get('workingHours1End') || '17', 10);
  const workingHours2Start = parseInt(searchParams.get('workingHours2Start') || '9', 10);
  const workingHours2End = parseInt(searchParams.get('workingHours2End') || '17', 10);
  const showWorkingHours = searchParams.get('showWorkingHours') !== 'false';
  
  // Get current time data
  const currentTime = DateTime.now();
  const time1 = currentTime.setZone(timezone1);
  const time2 = currentTime.setZone(timezone2);
  
  // Use provided labels or get from timezone data
  const tz1Label = label1 || findTimezoneOption(timezone1).label;
  const tz2Label = label2 || findTimezoneOption(timezone2).label;
  
  const timeFormat = 'h:mm a';
  const dateFormat = 'EEE, MMM d';
  
  // Create styling based on theme
  const bgClass = theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-900';
  const borderClass = theme === 'dark' ? 'border-gray-700' : 'border-gray-200';
  const subtitleClass = theme === 'dark' ? 'text-gray-300' : 'text-gray-500';
  const linkClass = theme === 'dark' ? 'text-blue-400' : 'text-blue-600';
  const timeBlockBg = theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50';
  const labelClass = theme === 'dark' ? 'text-gray-400' : 'text-gray-600';
  const dateClass = 'text-gray-500';
  
  // Working hours colors
  const loc1Color = theme === 'dark' ? 'bg-blue-500/50' : 'bg-blue-200';
  const loc2Color = theme === 'dark' ? 'bg-purple-500/50' : 'bg-purple-200';
  const overlapColor = theme === 'dark' ? 'bg-green-500/50' : 'bg-green-200';
  
  // Calculate hour difference between timezones
  const time1Hour = time1.hour + time1.minute / 60;
  const time2Hour = time2.hour + time2.minute / 60;
  const hourDiff = time2Hour - time1Hour;
  
  // Generate time slots HTML for visualization
  let timeSlotsHtml = '';
  let timeSlotsHtml2 = '';
  
  for (let hour = 0; hour < 24; hour++) {
    // First location
    const time1TotalMinutes = hour * 60;
    const workingStart1 = workingHours1Start * 60;
    const workingEnd1 = workingHours1End * 60;
    
    const isWorkingHour1 = showWorkingHours && (
      workingHours1Start <= workingHours1End
        ? time1TotalMinutes >= workingStart1 && time1TotalMinutes < workingEnd1
        : time1TotalMinutes >= workingStart1 || time1TotalMinutes < workingEnd1
    );
    
    // Second location
    const time2HourDecimal = (hour + hourDiff + 24) % 24;
    const time2TotalMinutes = time2HourDecimal * 60;
    const workingStart2 = workingHours2Start * 60;
    const workingEnd2 = workingHours2End * 60;
    
    const isWorkingHour2 = showWorkingHours && (
      workingHours2Start <= workingHours2End
        ? time2TotalMinutes >= workingStart2 && time2TotalMinutes < workingEnd2
        : time2TotalMinutes >= workingStart2 || time2TotalMinutes < workingEnd2
    );
    
    // Check for overlap
    const isOverlap = isWorkingHour1 && isWorkingHour2;
    
    // Add slots HTML
    const backgroundColor1 = isOverlap ? overlapColor : isWorkingHour1 ? loc1Color : '';
    timeSlotsHtml += `
      <div class="h-full border-r border-gray-700/30" style="grid-column: span 1">
        <div class="h-full ${backgroundColor1}"></div>
      </div>
    `;
    
    const backgroundColor2 = isOverlap ? overlapColor : isWorkingHour2 ? loc2Color : '';
    timeSlotsHtml2 += `
      <div class="h-full border-r border-gray-700/30" style="grid-column: span 1">
        <div class="h-full ${backgroundColor2}"></div>
      </div>
    `;
  }
  
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
        
        ${showWorkingHours ? `
        <!-- Time Visualization Grid -->
        <div class="mt-4 relative ${timeBlockBg} p-3 rounded">
          <div class="min-h-[70px]">
            <!-- Time indicator line -->
            <div 
              class="absolute top-0 bottom-0 w-[2px] bg-red-500 z-20"
              style="left: ${(time1Hour / 24) * 100}%; height: 100%;"
            ></div>
            
            <!-- Time grid -->
            <div class="relative h-[70px]">
              <!-- Timezone labels -->
              <div class="absolute left-0 h-full grid grid-rows-2 text-xs z-10">
                <div class="flex items-center ${theme === 'dark' ? 'text-blue-300' : 'text-blue-600'}">
                  <div class="w-2 h-2 rounded-full bg-blue-500 mr-1"></div>
                  <span>${tz1Label.split(' - ')[0].substring(0, compact ? 10 : 15)}</span>
                </div>
                <div class="flex items-center ${theme === 'dark' ? 'text-purple-300' : 'text-purple-600'}">
                  <div class="w-2 h-2 rounded-full bg-purple-500 mr-1"></div>
                  <span>${tz2Label.split(' - ')[0].substring(0, compact ? 10 : 15)}</span>
                </div>
              </div>
              
              <div class="ml-[70px]">
                <!-- First location row -->
                <div class="grid grid-cols-[repeat(24,minmax(0,1fr))] gap-0 border-b border-gray-700 h-[35px]">
                  ${timeSlotsHtml}
                </div>
                
                <!-- Second location row -->
                <div class="grid grid-cols-[repeat(24,minmax(0,1fr))] gap-0 h-[35px]">
                  ${timeSlotsHtml2}
                </div>
              </div>
            </div>
            
            <!-- Legend for colors -->
            <div class="mt-2 pt-2 border-t border-gray-700 grid grid-cols-3 gap-2 text-xs">
              <div class="flex items-center">
                <div class="w-3 h-3 mr-1 rounded ${loc1Color}"></div>
                <span class="${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}">
                  ${tz1Label.split(' - ')[0].substring(0, 8)} hours
                </span>
              </div>
              <div class="flex items-center">
                <div class="w-3 h-3 mr-1 rounded ${loc2Color}"></div>
                <span class="${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}">
                  ${tz2Label.split(' - ')[0].substring(0, 8)} hours
                </span>
              </div>
              <div class="flex items-center">
                <div class="w-3 h-3 mr-1 rounded ${overlapColor}"></div>
                <span class="${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}">Overlap</span>
              </div>
            </div>
            
            <!-- Time markers -->
            <div class="absolute bottom-0 left-0 right-0 flex justify-between text-[10px] text-gray-400 mt-1 ml-[70px]">
              <span>12 AM</span>
              <span>12 PM</span>
              <span>11 PM</span>
            </div>
          </div>
        </div>
        ` : ''}
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