# Timezone Widget - Embeddable Timezone Comparison Tool

This feature allows you to embed a timezone comparison widget on any website. The widget displays the current time in two different timezones and updates automatically.

## Quick Start

1. Visit the [Embed Page](https://timezone.world/embed) to configure your widget
2. Customize the widget settings (timezones, labels, theme, etc.)
3. Copy the generated embed code
4. Paste the code into your website's HTML where you want the widget to appear

## Widget Features

- **Real-time Comparison**: Shows the current time in two different timezones
- **Auto-updating**: Refreshes every minute to show accurate times
- **Customizable**: Choose any two timezones from our extensive list
- **Light/Dark Themes**: Choose a theme that matches your website design
- **Compact Mode**: Smaller widget layout for sidebars or limited space
- **Custom Labels**: Add your own labels to identify each timezone (e.g., "New York Office", "Remote Team")
- **Responsive**: Works on all screen sizes and devices

## Technical Details

### Embed Code Structure

```html
<script
  src="https://timezone.world/api/widget?origin=https://timezone.world"
  data-timezone1="America/New_York"
  data-timezone2="Asia/Kolkata"
  data-label1="New York Office"
  data-label2="India Team"
  data-theme="light"
  data-show-date="true"
  data-compact="false"
  async
></script>
```

### Configuration Options

| Attribute | Description | Default | Options |
|-----------|-------------|---------|---------|
| `data-timezone1` | First timezone to display | `America/New_York` | Any [IANA timezone](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones) |
| `data-timezone2` | Second timezone to display | `Asia/Kolkata` | Any [IANA timezone](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones) |
| `data-label1` | Custom label for the first timezone | *(empty)* | Any text |
| `data-label2` | Custom label for the second timezone | *(empty)* | Any text |
| `data-theme` | Visual theme for the widget | `light` | `light`, `dark` |
| `data-show-date` | Whether to show the date | `true` | `true`, `false` |
| `data-compact` | Compact display mode | `false` | `true`, `false` |

## Implementation Notes

- The widget is lightweight and only loads the necessary code and styles
- All resources are loaded asynchronously to prevent blocking your page load
- The widget isolates its styles to avoid conflicting with your website's CSS
- The widget automatically handles daylight saving time changes

## Browser Compatibility

The widget works on all modern browsers:
- Chrome/Edge (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Opera (latest version)
- iOS Safari (latest version)
- Android Chrome (latest version)

## Support

If you encounter any issues with the widget or have feature requests, please contact us at support@timezone.world or create an issue in our [GitHub repository](https://github.com/timezone-world/timezone-widget).

## License

The Timezone Widget is provided under the MIT License. You are free to use it on any website, including commercial projects. 