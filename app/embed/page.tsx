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
  
  // Set origin and mounted on client
  useEffect(() => {
    setOrigin(window.location.origin);
    setMounted(true);
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
    }
  };

  // Handle selection change for timezone2
  const handleTimezone2Change = (selected: any) => {
    if (selected && selected.value) {
      setTimezone2(selected.value);
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
  
  if (!mounted) {
    return <div className="container mx-auto px-4 py-8 max-w-6xl">Loading...</div>;
  }
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Embed Timezone Widget</h1>
        <p className="text-gray-600">
          Customize the widget and add it to your website.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Configuration Panel */}
        <div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Widget Configuration</h2>
            
            <div className="space-y-4">
              {/* Timezone 1 Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Timezone
                </label>
                <Select
                  options={groupOptions}
                  onChange={handleTimezone1Change}
                  value={findTimezone1Option()}
                  className="basic-select"
                  classNamePrefix="select"
                />
              </div>
              
              {/* Custom Label 1 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Custom Label (optional)
                </label>
                <input
                  type="text"
                  value={label1}
                  onChange={e => setLabel1(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                  placeholder="e.g., New York Office"
                />
              </div>
              
              {/* Timezone 2 Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Second Timezone
                </label>
                <Select
                  options={groupOptions}
                  onChange={handleTimezone2Change}
                  value={findTimezone2Option()}
                  className="basic-select"
                  classNamePrefix="select"
                />
              </div>
              
              {/* Custom Label 2 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Custom Label (optional)
                </label>
                <input
                  type="text"
                  value={label2}
                  onChange={e => setLabel2(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                  placeholder="e.g., India Office"
                />
              </div>
              
              {/* Theme Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
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
                    <span className="ml-2">Light</span>
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
                    <span className="ml-2">Dark</span>
                  </label>
                </div>
              </div>
              
              {/* Display Options */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Display Options
                </label>
                <div className="mt-1 space-y-2">
                  <label className="inline-flex items-center">
                    <input
                      type="checkbox"
                      className="form-checkbox text-blue-600"
                      checked={showDate}
                      onChange={(e) => setShowDate(e.target.checked)}
                    />
                    <span className="ml-2">Show date</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="checkbox"
                      className="form-checkbox text-blue-600"
                      checked={compact}
                      onChange={(e) => setCompact(e.target.checked)}
                    />
                    <span className="ml-2">Compact mode</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Preview and Embed Code */}
        <div>
          {/* Preview */}
          <div className="bg-white p-6 rounded-lg shadow mb-6">
            <h2 className="text-xl font-semibold mb-4">Preview</h2>
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
                />
              )}
            </div>
          </div>
          
          {/* Embed Code */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Embed Code</h2>
            <p className="text-gray-600 mb-2 text-sm">
              Copy and paste this code into your website where you want the widget to appear.
            </p>
            <div className="relative">
              <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto whitespace-pre-wrap">
                {getEmbedCode()}
              </pre>
              <button
                onClick={handleCopyClick}
                className="absolute top-2 right-2 p-2 bg-gray-200 hover:bg-gray-300 rounded transition"
                title="Copy to clipboard"
              >
                {copied ? (
                  <CheckIcon className="h-5 w-5 text-green-600" />
                ) : (
                  <ClipboardIcon className="h-5 w-5 text-gray-600" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-8 bg-blue-50 border border-blue-200 p-4 rounded">
        <h3 className="font-bold text-blue-800 mb-2">Usage Tips</h3>
        <ul className="list-disc list-inside text-blue-700 text-sm space-y-1">
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