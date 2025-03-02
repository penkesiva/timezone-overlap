(function() {
  // Configuration with default values
  const defaultConfig = {
    timezone1: 'America/Los_Angeles',
    timezone2: 'Europe/London',
    label1: 'Los Angeles (PT)',
    label2: 'London (GMT)',
    theme: 'dark',
    showDate: true,
    compact: false
  };

  // Parse script attributes from the embedding script tag
  function parseScriptAttributes() {
    const scripts = document.getElementsByTagName('script');
    const currentScript = scripts[scripts.length - 1];
    
    const config = {...defaultConfig};
    
    // Extract configuration from data attributes
    for (const key in defaultConfig) {
      const dataAttr = `data-${key.replace(/([A-Z])/g, "-$1").toLowerCase()}`;
      if (currentScript.hasAttribute(dataAttr)) {
        let value = currentScript.getAttribute(dataAttr);
        
        // Convert string boolean values to actual booleans
        if (value === 'true') value = true;
        if (value === 'false') value = false;
        
        config[key] = value;
      }
    }
    
    return config;
  }

  // Load Tailwind CSS
  function loadTailwindCSS() {
    return new Promise((resolve) => {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css';
      link.onload = resolve;
      document.head.appendChild(link);
    });
  }

  // Load Luxon for time zone handling
  function loadLuxon() {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/luxon@3.4.4/build/global/luxon.min.js';
      script.onload = resolve;
      document.head.appendChild(script);
    });
  }

  // Create the widget container
  function createWidgetContainer() {
    const div = document.createElement('div');
    div.id = 'timezone-overlap-widget';
    div.style.width = '100%';
    div.style.maxWidth = '500px';
    div.style.margin = '0 auto';
    div.style.fontFamily = 'system-ui, -apple-system, sans-serif';
    
    // Insert the container where the script is
    const scripts = document.getElementsByTagName('script');
    const currentScript = scripts[scripts.length - 1];
    currentScript.parentNode.insertBefore(div, currentScript);
    
    return div;
  }

  // Render the widget with the current time
  function renderWidget(container, config) {
    const { DateTime } = luxon;
    
    const time1 = DateTime.now().setZone(config.timezone1);
    const time2 = DateTime.now().setZone(config.timezone2);
    
    // Calculate the offset between the two timezones
    const hourDiff = (time2.offset - time1.offset) / 60;
    
    // Apply theming based on the config
    const bgColor = config.theme === 'dark' ? 'bg-gray-800' : 'bg-white';
    const textColor = config.theme === 'dark' ? 'text-white' : 'text-gray-900';
    const subTextColor = config.theme === 'dark' ? 'text-gray-400' : 'text-gray-500';
    const borderColor = config.theme === 'dark' ? 'border-gray-700' : 'border-gray-200';
    const location1Color = config.theme === 'dark' ? 'text-blue-400' : 'text-blue-600';
    const location2Color = config.theme === 'dark' ? 'text-orange-400' : 'text-orange-600';
    
    // Generate HTML for the widget
    const html = `
      <div class="${bgColor} ${textColor} rounded-lg shadow-md border ${borderColor} overflow-hidden" style="width: 100%; max-width: ${config.compact ? '300px' : '500px'};">
        <div class="p-3 flex justify-between items-center border-b ${borderColor}">
          <div class="text-sm">
            Timezone Comparison
          </div>
          <a 
            href="https://timezoneoverlap.net" 
            target="_blank" 
            rel="noopener noreferrer"
            class="text-xs ${subTextColor} hover:underline"
          >
            powered by timezoneoverlap.net
          </a>
        </div>
        
        <div class="p-4 space-y-4">
          <!-- Location 1 -->
          <div class="flex items-center space-x-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 ${location1Color}">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <span class="${location1Color} font-mono text-lg">
                ${time1.toFormat('h:mm a')}
              </span>
              ${config.showDate ? `
                <span class="${subTextColor} text-sm ml-2">
                  ${time1.toFormat('EEE, MMM d')}
                </span>
              ` : ''}
              <div class="${subTextColor} text-sm">${config.label1}</div>
            </div>
          </div>
          
          <!-- Location 2 -->
          <div class="flex items-center space-x-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 ${location2Color}">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <span class="${location2Color} font-mono text-lg">
                ${time2.toFormat('h:mm a')}
              </span>
              ${config.showDate ? `
                <span class="${subTextColor} text-sm ml-2">
                  ${time2.toFormat('EEE, MMM d')}
                </span>
              ` : ''}
              <div class="${subTextColor} text-sm">${config.label2}</div>
            </div>
          </div>
          
          <!-- Time difference -->
          ${!config.compact ? `
            <div class="text-xs ${subTextColor} pt-2 border-t ${borderColor}">
              Time difference: ${Math.abs(hourDiff)} hour${Math.abs(hourDiff) !== 1 ? 's' : ''}
              ${hourDiff > 0 ? ` (${config.label2} is ahead)` : hourDiff < 0 ? ` (${config.label1} is ahead)` : ''}
            </div>
          ` : ''}
        </div>
      </div>
    `;
    
    container.innerHTML = html;
    
    // Update the time every minute
    setTimeout(() => renderWidget(container, config), 60000);
  }

  // Initialize the widget
  async function initWidget() {
    try {
      const config = parseScriptAttributes();
      const container = createWidgetContainer();
      
      // Show loading state
      container.innerHTML = '<div class="text-center p-4">Loading timezone widget...</div>';
      
      // Load dependencies in parallel
      await Promise.all([loadTailwindCSS(), loadLuxon()]);
      
      // Render the widget
      renderWidget(container, config);
    } catch (error) {
      console.error('Error initializing TimeZone Overlap widget:', error);
    }
  }

  // Start initialization
  initWidget();
})(); 