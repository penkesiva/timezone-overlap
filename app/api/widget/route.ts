import { NextResponse } from 'next/server';

/**
 * This API route serves the JavaScript code for the embeddable widget.
 * The script dynamically loads our widget component into any website that includes it.
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const origin = url.searchParams.get('origin') || '';
  
  // The script that will be embedded in the user's website
  const script = `
(function() {
  // Create a container element for the widget
  const container = document.createElement('div');
  container.id = 'timezone-widget-container';
  
  // Find the script tag that loaded this code
  const currentScript = document.currentScript;
  if (!currentScript) return;
  
  // Get configuration from script attributes
  const timezone1 = currentScript.getAttribute('data-timezone1') || 'America/New_York';
  const timezone2 = currentScript.getAttribute('data-timezone2') || 'Asia/Kolkata';
  const label1 = currentScript.getAttribute('data-label1') || '';
  const label2 = currentScript.getAttribute('data-label2') || '';
  const theme = currentScript.getAttribute('data-theme') || 'light';
  const showDate = currentScript.getAttribute('data-show-date') !== 'false';
  const compact = currentScript.getAttribute('data-compact') === 'true';
  
  // Replace the script with the container
  currentScript.parentNode.insertBefore(container, currentScript);
  
  // Load the widget styles
  const styles = document.createElement('link');
  styles.rel = 'stylesheet';
  styles.href = '${origin}/widget.css';
  document.head.appendChild(styles);
  
  // Function to load the widget
  const loadWidget = () => {
    fetch('${origin}/api/widget/content?timezone1=' + encodeURIComponent(timezone1) +
      '&timezone2=' + encodeURIComponent(timezone2) +
      '&label1=' + encodeURIComponent(label1) +
      '&label2=' + encodeURIComponent(label2) +
      '&theme=' + encodeURIComponent(theme) +
      '&showDate=' + (showDate ? 'true' : 'false') +
      '&compact=' + (compact ? 'true' : 'false')
    )
    .then(response => response.text())
    .then(html => {
      container.innerHTML = html;
      
      // Refresh the widget every minute
      setInterval(() => {
        loadWidget();
      }, 60000);
    })
    .catch(error => {
      console.error('Error loading timezone widget:', error);
      container.innerHTML = '<div style="color: red; padding: 10px;">Error loading timezone widget</div>';
    });
  };
  
  // Initial load
  loadWidget();
})();
  `.trim();

  return new NextResponse(script, {
    headers: {
      'Content-Type': 'application/javascript',
      'Cache-Control': 'max-age=3600',
      'Access-Control-Allow-Origin': '*',
    },
  });
} 