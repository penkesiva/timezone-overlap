'use client';

import { useState, useEffect } from 'react';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Always start in dark mode if no preference is saved
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setIsDark(savedTheme === 'dark');
    document.documentElement.classList.toggle('dark', savedTheme === 'dark');
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

  if (!mounted) {
    return null;
  }

  return (
    <button
      onClick={toggleTheme}
      className={`fixed top-4 right-4 p-2 rounded-full transition-colors duration-200 z-50 md:top-4 md:right-4 top-16 ${
        isDark 
          ? 'bg-gray-700 hover:bg-gray-600 text-yellow-300 shadow-md' 
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