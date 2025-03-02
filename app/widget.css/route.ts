import { NextResponse } from 'next/server';

/**
 * This API route serves the CSS styles for the embeddable widget.
 */
export async function GET() {
  // Basic CSS for the widget - using minimal styles to avoid conflicts
  const css = `
/* Reset styles for the widget */
#timezone-widget-container * {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}

#timezone-widget-container {
  display: block;
  max-width: 400px;
  margin: 0;
  font-size: 16px;
  line-height: 1.5;
}

/* Light theme */
.timezone-widget.bg-white {
  background-color: #ffffff;
  color: #111827;
  border-color: #e5e7eb;
}

/* Dark theme */
.timezone-widget.bg-gray-900 {
  background-color: #111827;
  color: #ffffff;
  border-color: #374151;
}

.timezone-widget {
  border-width: 1px;
  border-style: solid;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  width: 100%;
}

.timezone-widget a {
  text-decoration: none;
}

.timezone-widget a:hover {
  text-decoration: underline;
}

/* Light theme specific styles */
.bg-white .text-gray-500 {
  color: #6b7280;
}

.bg-white .text-gray-600 {
  color: #4b5563;
}

.bg-white .text-blue-600 {
  color: #2563eb;
}

.bg-white .bg-gray-50 {
  background-color: #f9fafb;
}

/* Dark theme specific styles */
.bg-gray-900 .text-gray-300 {
  color: #d1d5db;
}

.bg-gray-900 .text-gray-400 {
  color: #9ca3af;
}

.bg-gray-900 .text-gray-500 {
  color: #6b7280;
}

.bg-gray-900 .text-blue-400 {
  color: #60a5fa;
}

.bg-gray-900 .bg-gray-800 {
  background-color: #1f2937;
}

/* Layout utilities */
.timezone-widget .p-3 {
  padding: 0.75rem;
}

.timezone-widget .p-2 {
  padding: 0.5rem;
}

.timezone-widget .mt-3 {
  margin-top: 0.75rem;
}

.timezone-widget .mt-1 {
  margin-top: 0.25rem;
}

.timezone-widget .flex {
  display: flex;
}

.timezone-widget .flex-col {
  flex-direction: column;
}

.timezone-widget .grid {
  display: grid;
}

.timezone-widget .grid-cols-1 {
  grid-template-columns: repeat(1, minmax(0, 1fr));
}

.timezone-widget .grid-cols-2 {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.timezone-widget .gap-2 {
  gap: 0.5rem;
}

.timezone-widget .gap-4 {
  gap: 1rem;
}

.timezone-widget .items-center {
  align-items: center;
}

.timezone-widget .justify-between {
  justify-content: space-between;
}

.timezone-widget .rounded {
  border-radius: 0.25rem;
}

.timezone-widget .rounded-lg {
  border-radius: 0.5rem;
}

/* Typography */
.timezone-widget .text-xs {
  font-size: 0.75rem;
  line-height: 1rem;
}

.timezone-widget .text-sm {
  font-size: 0.875rem;
  line-height: 1.25rem;
}

.timezone-widget .text-lg {
  font-size: 1.125rem;
  line-height: 1.75rem;
}

.timezone-widget .font-medium {
  font-weight: 500;
}

.timezone-widget .font-bold {
  font-weight: 700;
}
  `.trim();

  return new NextResponse(css, {
    headers: {
      'Content-Type': 'text/css',
      'Cache-Control': 'max-age=3600',
      'Access-Control-Allow-Origin': '*',
    },
  });
} 