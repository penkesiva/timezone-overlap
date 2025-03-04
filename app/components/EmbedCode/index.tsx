'use client';

import { useState } from 'react';
import { ClipboardIcon, CheckIcon } from '@heroicons/react/24/outline';

export interface EmbedCodeProps {
  code: string;
}

const EmbedCode = ({ code }: EmbedCodeProps) => {
  const [copied, setCopied] = useState(false);
  
  const handleCopyClick = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };
  
  return (
    <div className="relative">
      <pre className="bg-gray-100 dark:bg-gray-900 p-4 rounded-lg overflow-x-auto text-sm">
        <code>{code}</code>
      </pre>
      <button
        onClick={handleCopyClick}
        className="absolute top-2 right-2 p-2 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 rounded transition"
        title="Copy to clipboard"
      >
        {copied ? (
          <CheckIcon className="h-5 w-5 text-green-600 dark:text-green-400" />
        ) : (
          <ClipboardIcon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
        )}
      </button>
      <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
        Paste this code into your HTML where you want the widget to appear.
      </p>
    </div>
  );
};

export default EmbedCode; 