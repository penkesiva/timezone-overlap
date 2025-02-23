'use client';

import { useState, useEffect } from 'react';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    // Check if user has a theme preference in localStorage
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setIsDark(savedTheme === 'dark');
      document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
    
    // Update HTML class for dark mode
    document.documentElement.classList.toggle('dark', newTheme);
    
    // Update body background
    document.body.classList.toggle('from-gray-900', newTheme);
    document.body.classList.toggle('to-gray-800', newTheme);
    document.body.classList.toggle('from-gray-50', !newTheme);
    document.body.classList.toggle('to-gray-100', !newTheme);
  };

  return (
    <button
      onClick={toggleTheme}
      className={`fixed top-4 right-4 p-2 rounded-full transition-colors duration-200 ${
        isDark 
          ? 'bg-white bg-opacity-20 hover:bg-opacity-30 text-white' 
          : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
      }`}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDark ? (
        <SunIcon className="w-6 h-6" />
      ) : (
        <MoonIcon className="w-6 h-6" />
      )}
    </button>
  );
} 