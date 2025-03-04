'use client';

import { useId } from 'react';

export interface ToggleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  labelPosition?: 'left' | 'right';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
}

const ToggleSwitch = ({
  checked,
  onChange,
  label,
  labelPosition = 'left',
  size = 'md',
  disabled = false
}: ToggleSwitchProps) => {
  const id = useId();
  
  // Size classes
  const sizeClasses = {
    sm: {
      switch: 'w-8 h-4',
      knob: 'h-4 w-4',
      knobTranslate: checked ? 'translate-x-4' : 'translate-x-0',
    },
    md: {
      switch: 'w-10 h-6',
      knob: 'h-6 w-6',
      knobTranslate: checked ? 'translate-x-4' : 'translate-x-0',
    },
    lg: {
      switch: 'w-12 h-7',
      knob: 'h-7 w-7',
      knobTranslate: checked ? 'translate-x-5' : 'translate-x-0',
    }
  };
  
  const { switch: switchClass, knob: knobClass, knobTranslate } = sizeClasses[size];
  
  return (
    <div className={`flex items-center ${labelPosition === 'right' ? 'flex-row' : 'flex-row-reverse justify-end'}`}>
      {label && (
        <label 
          htmlFor={id} 
          className={`text-sm font-medium cursor-pointer ${labelPosition === 'right' ? 'ml-2' : 'mr-2'} ${disabled ? 'text-gray-400 dark:text-gray-500' : 'text-gray-700 dark:text-gray-300'}`}
        >
          {label}
        </label>
      )}
      <div className="relative inline-block align-middle select-none">
        <input 
          type="checkbox" 
          id={id} 
          className="sr-only"
          checked={checked} 
          onChange={(e) => onChange(e.target.checked)} 
          disabled={disabled}
        />
        <label 
          htmlFor={id} 
          className={`block overflow-hidden rounded-full cursor-pointer transition-colors duration-200 ease-in-out ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${switchClass} ${checked ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'}`}
        >
          <span 
            className={`block rounded-full bg-white shadow transform transition-transform duration-200 ease-in-out ${knobClass} ${knobTranslate}`}
          ></span>
        </label>
      </div>
    </div>
  );
};

export default ToggleSwitch; 