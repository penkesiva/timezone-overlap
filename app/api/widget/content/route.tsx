import { NextResponse } from 'next/server';
import { renderToStaticMarkup } from 'react-dom/server';
import EmbeddableWidget from '@/app/components/EmbeddableWidget';

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
  
  // Render the widget component to static HTML
  const widgetHtml = renderToStaticMarkup(
    <EmbeddableWidget
      timezone1={timezone1}
      timezone2={timezone2}
      label1={label1}
      label2={label2}
      theme={theme}
      showDate={showDate}
      compact={compact}
    />
  );
  
  return new NextResponse(widgetHtml, {
    headers: {
      'Content-Type': 'text/html',
      'Cache-Control': 'max-age=60', // Short cache to ensure relatively fresh content
      'Access-Control-Allow-Origin': '*',
    },
  });
} 