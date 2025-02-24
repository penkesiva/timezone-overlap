# TimeZone Overlap

A modern web application that helps users visualize and find overlapping working hours across different time zones. Perfect for coordinating meetings and work schedules for distributed teams across the globe.

## Tech Stack

### Frontend
- **Framework**: Next.js 15.1.7 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Hooks
- **UI Components**:
  - React Select for searchable dropdowns
  - Framer Motion for animations
  - Heroicons for icons
  - Custom components

### Date & Time Handling
- Luxon for timezone calculations and formatting
- Date-fns for additional date utilities

### Performance & SEO
- Dynamic imports for code splitting
- Server-side and client components
- Optimized meta tags and OpenGraph
- Responsive images and favicons
- PWA support

### Development Tools
- ESLint for code quality
- Sharp for image processing
- SVGO for SVG optimization

## Key Features

### Time Zone Management
- Real-time timezone comparison
- Visual grid showing 24-hour overlap
- Auto-detection of user's timezone
- Searchable timezone selection with major cities
- Support for all major global timezones

### Visual Interface
* Interactive Time Grid
  - Color-coded working hours (9 AM - 5 PM)
  - Visual overlap indication
  - Hover states with exact times
  - Click to select specific time slots
* Responsive Design
  - Desktop optimized layout
  - Mobile-friendly interface
  - Adaptive ad placements

### User Experience
* Theme Support
  - Dark/Light mode toggle
  - System theme detection
  - Persistent theme preference
  - Smooth theme transitions
* Accessibility
  - Keyboard navigation
  - Screen reader support
  - ARIA labels
  - Focus management

### Additional Features
* Copy Functionality
  - One-click time slot copying
  - Formatted output with both timezones
  - Success confirmation
* Privacy Focused
  - Minimal data collection
  - No personal information stored
  - Transparent privacy policy
* Monetization
  - Google AdSense integration
  - Strategic ad placements
  - Non-intrusive ad experience

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```bash
NEXT_PUBLIC_ADSENSE_CLIENT_ID=your_adsense_client_id
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
