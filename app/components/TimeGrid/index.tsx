'use client';

import { useState, useEffect } from 'react';
import { DateTime } from 'luxon';
import { findTimezoneOption } from '@/app/utils/timezones';

export interface TimeGridProps {
  timezone1: string;
  timezone2: string;
  timezone3?: string;
  label1?: string;
  label2?: string;
  label3?: string;
  workingHours1: { start: number; end: number };
  workingHours2: { start: number; end: number };
  workingHours3?: { start: number; end: number };
  showWorkingHours: boolean;
  meetingTime?: { start: number; end: number };
  showMeetingTime: boolean;
  color1?: string;
  color2?: string;
  color3?: string;
}

const TimeGrid = ({
  timezone1,
  timezone2,
  timezone3,
  label1 = '',
  label2 = '',
  label3 = '',
  workingHours1,
  workingHours2,
  workingHours3,
  showWorkingHours,
  meetingTime,
  showMeetingTime,
  color1 = 'blue',
  color2 = 'purple',
  color3 = 'green'
}: TimeGridProps) => {
  const [currentDateTime, setCurrentDateTime] = useState<DateTime>(DateTime.now());
  
  // Width of each hour cell in pixels
  const hourWidth = 25;
  
  // Update time every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDateTime(DateTime.now());
    }, 60000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Get timezone labels
  const tz1Label = label1 || findTimezoneOption(timezone1).label;
  const tz2Label = label2 || findTimezoneOption(timezone2).label;
  const tz3Label = label3 || (timezone3 ? findTimezoneOption(timezone3).label : '');
  
  // Format the times
  const time1 = currentDateTime.setZone(timezone1);
  const time2 = currentDateTime.setZone(timezone2);
  const time3 = timezone3 ? currentDateTime.setZone(timezone3) : null;
  
  // Get the start time for the time grid (always 12 AM)
  const getStartTime = () => {
    return 0; // Start at 12 AM (hour 0)
  };

  // Get the end time for the time grid
  const getEndTime = () => {
    return 24; // End at 12 AM next day (hour 24)
  };

  // Calculate the position for the current time indicator
  const calculateCurrentTimePosition = () => {
    const now = currentDateTime;
    const hour = now.hour;
    const minute = now.minute;
    
    // Calculate position based on hours and minutes from 12 AM
    return (hour + minute / 60 - getStartTime()) * hourWidth;
  };

  // Render the time grid legend (hour markers)
  const renderTimeGridLegend = () => {
    const hours = [];
    for (let i = getStartTime(); i <= getEndTime(); i++) {
      const hour = i % 24;
      const isFullHour = hour % 3 === 0; // Highlight every 3 hours
      const hourLabel = hour === 0 ? '12 AM' : hour < 12 ? `${hour} AM` : hour === 12 ? '12 PM' : `${hour - 12} PM`;
      
      hours.push(
        <div key={i} className={`hour-marker ${isFullHour ? 'main-hour' : ''}`} style={{ left: `${(i - getStartTime()) * hourWidth}px` }}>
          {isFullHour && <div className="hour-label">{hourLabel}</div>}
        </div>
      );
    }
    
    return (
      <div className="time-grid-legend">
        <div className="hour-markers">{hours}</div>
      </div>
    );
  };
  
  // Render hour markers for a specific timezone
  const renderHourMarkers = (timezone: string) => {
    const hours = [];
    const now = currentDateTime;
    
    // Only create markers for every 3 hours to reduce clutter
    for (let i = getStartTime(); i <= getEndTime(); i += 3) {
      const hour = i % 24;
      const timeAtHour = now.setZone(timezone).set({ hour, minute: 0 });
      const hourLabel = timeAtHour.toFormat('h a');
      
      hours.push(
        <div key={i} className="hour-marker main-hour" style={{ left: `${(i - getStartTime()) * hourWidth}px` }}>
          <div className="hour-label">{hourLabel}</div>
        </div>
      );
    }
    
    return hours;
  };
  
  // Get color class based on color name
  const getColorClass = (color: string = 'blue') => {
    return `text-${color}-600 dark:text-${color}-400`;
  };
  
  return (
    <div className="time-grid relative overflow-x-auto pb-6">
      {/* Time grid legend */}
      <div className="time-grid-header mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
        {renderTimeGridLegend()}
      </div>
      
      {/* Timezone rows */}
      <div className="timezone-rows space-y-6">
        {/* First timezone */}
        <div className="timezone-row flex">
          <div className={`timezone-label w-24 flex-shrink-0 font-medium ${getColorClass(color1)}`}>
            {tz1Label}
          </div>
          <div className="timezone-hours relative flex-grow h-10 bg-gray-50 dark:bg-gray-900 rounded">
            {showWorkingHours && (
              <div 
                className={`working-hours-indicator absolute top-0 bottom-0 bg-${color1}-100 dark:bg-${color1}-900/30 rounded`}
                style={{
                  left: `${(workingHours1.start - getStartTime()) * hourWidth}px`,
                  width: `${(workingHours1.end - workingHours1.start) * hourWidth}px`
                }}
              ></div>
            )}
            {renderHourMarkers(timezone1)}
          </div>
        </div>
        
        {/* Second timezone */}
        <div className="timezone-row flex">
          <div className={`timezone-label w-24 flex-shrink-0 font-medium ${getColorClass(color2)}`}>
            {tz2Label}
          </div>
          <div className="timezone-hours relative flex-grow h-10 bg-gray-50 dark:bg-gray-900 rounded">
            {showWorkingHours && (
              <div 
                className={`working-hours-indicator absolute top-0 bottom-0 bg-${color2}-100 dark:bg-${color2}-900/30 rounded`}
                style={{
                  left: `${(workingHours2.start - getStartTime()) * hourWidth}px`,
                  width: `${(workingHours2.end - workingHours2.start) * hourWidth}px`
                }}
              ></div>
            )}
            {renderHourMarkers(timezone2)}
          </div>
        </div>
        
        {/* Third timezone (optional) */}
        {timezone3 && workingHours3 && (
          <div className="timezone-row flex">
            <div className={`timezone-label w-24 flex-shrink-0 font-medium ${getColorClass(color3)}`}>
              {tz3Label}
            </div>
            <div className="timezone-hours relative flex-grow h-10 bg-gray-50 dark:bg-gray-900 rounded">
              {showWorkingHours && (
                <div 
                  className={`working-hours-indicator absolute top-0 bottom-0 bg-${color3}-100 dark:bg-${color3}-900/30 rounded`}
                  style={{
                    left: `${(workingHours3.start - getStartTime()) * hourWidth}px`,
                    width: `${(workingHours3.end - workingHours3.start) * hourWidth}px`
                  }}
                ></div>
              )}
              {renderHourMarkers(timezone3)}
            </div>
          </div>
        )}
      </div>
      
      {/* Current time indicator */}
      <div 
        className="current-time-indicator absolute top-0 bottom-0 z-10"
        style={{ left: `${calculateCurrentTimePosition()}px` }}
      >
        <div className="current-time-line h-full w-0.5 bg-red-500"></div>
        <div className="current-time-dot w-2 h-2 rounded-full bg-red-500 absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
      </div>
      
      {/* Meeting time indicator */}
      {showMeetingTime && meetingTime && (
        <div 
          className="meeting-time-indicator absolute h-full z-5"
          style={{ 
            left: `${(meetingTime.start - getStartTime()) * hourWidth}px`,
            width: `${(meetingTime.end - meetingTime.start) * hourWidth}px`
          }}
        >
          <div className="meeting-time-bar h-full bg-amber-200 dark:bg-amber-900/30 opacity-50 rounded"></div>
        </div>
      )}
      
      <style jsx>{`
        .time-grid {
          width: ${24 * hourWidth + 50}px;
          min-height: 100px;
          padding: 8px;
          background: rgba(255, 255, 255, 0.5);
          border-radius: 8px;
        }
        
        :global(.dark) .time-grid {
          background: rgba(0, 0, 0, 0.2);
        }
        
        .time-grid-legend {
          position: relative;
          height: 20px;
          margin-bottom: 10px;
        }
        
        .hour-markers {
          position: absolute;
          width: 100%;
          height: 100%;
        }
        
        .hour-marker {
          position: absolute;
          height: 100%;
          width: 1px;
          background-color: rgba(0, 0, 0, 0.1);
        }
        
        .main-hour {
          width: 2px;
          background-color: rgba(0, 0, 0, 0.2);
        }
        
        :global(.dark) .hour-marker {
          background-color: rgba(255, 255, 255, 0.1);
        }
        
        :global(.dark) .main-hour {
          background-color: rgba(255, 255, 255, 0.2);
        }
        
        .hour-label {
          position: absolute;
          top: 0;
          left: 2px;
          font-size: 10px;
          font-weight: 600;
          color: #666;
          white-space: nowrap;
        }
        
        :global(.dark) .hour-label {
          color: #aaa;
        }
        
        .timezone-row {
          position: relative;
          margin-bottom: 10px;
        }
        
        .timezone-label {
          padding-right: 10px;
          font-size: 14px;
          line-height: 40px;
        }
        
        .timezone-hours {
          position: relative;
          height: 40px;
          overflow: hidden;
          border: 1px solid rgba(0, 0, 0, 0.1);
        }
        
        :global(.dark) .timezone-hours {
          border-color: rgba(255, 255, 255, 0.1);
        }
        
        .working-hours-indicator {
          position: absolute;
          height: 100%;
          border-radius: 4px;
        }
        
        .current-time-indicator {
          position: absolute;
          top: 20px;
          bottom: 0;
          width: 2px;
          z-index: 10;
        }
        
        .current-time-line {
          background-color: #ef4444 !important;
          box-shadow: 0 0 4px rgba(239, 68, 68, 0.6);
        }
        
        .current-time-dot {
          background-color: #ef4444 !important;
          box-shadow: 0 0 4px rgba(239, 68, 68, 0.6);
        }
        
        .meeting-time-indicator {
          position: absolute;
          top: 20px;
          bottom: 0;
          z-index: 5;
        }
      `}</style>
    </div>
  );
};

export default TimeGrid; 