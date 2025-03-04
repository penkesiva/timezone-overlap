'use client';

import { useState } from 'react';

export interface ColorOption {
  name: string;
  value: string;
  bgClass: string;
  hoverClass: string;
  selectedClass: string;
}

export interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
  label?: string;
}

const ColorPicker = ({ color, onChange, label = 'Color' }: ColorPickerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  
  // Available color options
  const colorOptions: ColorOption[] = [
    { name: 'blue', value: 'blue', bgClass: 'bg-blue-500', hoverClass: 'hover:bg-blue-600', selectedClass: 'ring-blue-500' },
    { name: 'purple', value: 'purple', bgClass: 'bg-purple-500', hoverClass: 'hover:bg-purple-600', selectedClass: 'ring-purple-500' },
    { name: 'green', value: 'green', bgClass: 'bg-green-500', hoverClass: 'hover:bg-green-600', selectedClass: 'ring-green-500' },
    { name: 'red', value: 'red', bgClass: 'bg-red-500', hoverClass: 'hover:bg-red-600', selectedClass: 'ring-red-500' },
    { name: 'yellow', value: 'yellow', bgClass: 'bg-yellow-500', hoverClass: 'hover:bg-yellow-600', selectedClass: 'ring-yellow-500' },
    { name: 'indigo', value: 'indigo', bgClass: 'bg-indigo-500', hoverClass: 'hover:bg-indigo-600', selectedClass: 'ring-indigo-500' },
    { name: 'pink', value: 'pink', bgClass: 'bg-pink-500', hoverClass: 'hover:bg-pink-600', selectedClass: 'ring-pink-500' },
    { name: 'teal', value: 'teal', bgClass: 'bg-teal-500', hoverClass: 'hover:bg-teal-600', selectedClass: 'ring-teal-500' },
    { name: 'orange', value: 'orange', bgClass: 'bg-orange-500', hoverClass: 'hover:bg-orange-600', selectedClass: 'ring-orange-500' },
    { name: 'cyan', value: 'cyan', bgClass: 'bg-cyan-500', hoverClass: 'hover:bg-cyan-600', selectedClass: 'ring-cyan-500' },
  ];
  
  // Find the selected color option
  const selectedColorOption = colorOptions.find(option => option.value === color) || colorOptions[0];
  
  // Toggle the color picker dropdown
  const toggleColorPicker = () => {
    setIsOpen(!isOpen);
  };
  
  // Handle color selection
  const handleColorSelect = (colorValue: string) => {
    onChange(colorValue);
    setIsOpen(false);
  };
  
  return (
    <div className="color-picker relative">
      <div className="flex items-center space-x-2">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</span>
        <button
          type="button"
          onClick={toggleColorPicker}
          className="w-6 h-6 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-800 focus:ring-blue-500"
          style={{ backgroundColor: `var(--${selectedColorOption.value}-500)` }}
          aria-expanded={isOpen}
          aria-haspopup="true"
        >
          <span className="sr-only">Select {selectedColorOption.name} color</span>
        </button>
      </div>
      
      {isOpen && (
        <div className="color-drawer absolute right-0 mt-2 p-2 bg-white dark:bg-gray-800 rounded-md shadow-lg z-10 border border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-5 gap-2">
            {colorOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleColorSelect(option.value)}
                className={`w-6 h-6 rounded-full ${option.bgClass} ${option.hoverClass} focus:outline-none ${color === option.value ? 'ring-2 ring-offset-2 ring-offset-white dark:ring-offset-gray-800 ' + option.selectedClass : ''}`}
                aria-label={option.name}
              />
            ))}
          </div>
          <div className="mt-2 flex justify-end">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ColorPicker; 