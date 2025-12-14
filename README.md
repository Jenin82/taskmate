# TaskMaster MVP

A multi-step task marketplace where users can hire TaskMasters for various tasks like fuel delivery, queue standing, pickup & delivery, and more.

## Features

- **ChatGPT-style Task Input** - Natural language task description with auto-detection
- **Dynamic Forms** - Task-specific forms based on category
- **Live Tracking** - Real-time map tracking with tasker location
- **Fair Pricing** - Distance-based and time-based pricing calculations
- **Modern UI** - Built with shadcn/ui components and Tailwind CSS

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **UI Library**: shadcn/ui
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Maps**: Google Maps API
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm
- Google Maps API Key

### Setup

1. Clone the repository:

```bash
git clone https://github.com/yourusername/taskmate.git
cd taskmate
```

2. Install dependencies:

```bash
pnpm install
```

3. Set up environment variables:

```bash
cp env.example .env.local
```

4. Add your Google Maps API key to `.env.local`:

```
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_api_key_here
```

5. Run the development server:

```bash
pnpm dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Google Maps API Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the following APIs:
   - Maps JavaScript API
   - Places API
   - Geocoding API
4. Create an API key and restrict it to your domain

## Project Structure

```
/app
  /page.tsx                 # Task request page (home)
  /task-details/page.tsx    # Dynamic task details form
  /payment/page.tsx         # Payment summary
  /tracking/[id]/page.tsx   # Live tracking
/components
  /ui/*                     # shadcn components
  /LocationPicker.tsx       # Google Maps location picker
  /TaskCard.tsx             # Task summary card
  /LiveMap.tsx              # Live tracking map
  /TaskerCard.tsx           # Tasker profile card
  /PriceBreakdown.tsx       # Pricing display
  /ProgressStepper.tsx      # Multi-step indicator
  /TimelineStatus.tsx       # Task progress timeline
  /SearchingOverlay.tsx     # Tasker search animation
/lib
  /mockData.ts              # Sample data & constants
  /taskDetection.ts         # Keyword detection logic
  /pricingCalculator.ts     # Pricing calculations
  /utils.ts                 # Utility functions
/store
  /taskStore.ts             # Zustand state management
/types
  /index.ts                 # TypeScript interfaces
```

## Task Categories

- **Fuel Delivery** - Petrol/diesel delivery to your location
- **Queue Standing** - Someone waits in line for you
- **Pickup & Delivery** - Pick up and deliver items
- **General Task** - Any other task you need help with

## Demo

Try the coupon code `FIRST50` for 50% off!

## License

MIT
