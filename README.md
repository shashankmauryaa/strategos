# Strategos - Geopolitical Simulation Platform

A comprehensive web-based geopolitical simulation and analysis platform built with React, TypeScript, and modern web technologies.

## Features

- **Interactive Dashboard** - Real-time overview of global geopolitical events and metrics
- **Conflict Mapping** - Visual representation of ongoing conflicts worldwide using Leaflet maps
- **Country Analysis** - Detailed profiles and statistics for countries across the globe
- **Arms Flow Tracking** - Monitor weapons transfers and military aid between nations
- **AI Console** - AI-powered analysis and insights for geopolitical scenarios
- **Simulation Engine** - What-if scenario modeling and outcome prediction
- **Nuclear Monitoring** - Track nuclear capabilities and proliferation indicators
- **Alliance Networks** - Visualize and analyze international alliances and partnerships
- **OSINT Dashboard** - Open-source intelligence gathering and analysis tools
- **Alert System** - Real-time notifications for critical geopolitical events
- **Arms Race Analytics** - Track military spending and arms competition metrics
- **Knowledge Graph** - Relationship mapping between entities, events, and locations
- **Advanced Search** - Full-text search across all data sources

## Tech Stack

- **Frontend Framework**: React 19 with TypeScript
- **Build Tool**: Vite
- **Routing**: React Router DOM
- **State Management**: Zustand
- **Data Fetching**: TanStack React Query
- **UI Components**: Radix UI primitives
- **Styling**: Tailwind CSS v4
- **Maps**: Leaflet & React Leaflet
- **Charts**: Recharts
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Deployment**: GitHub Pages

## Installation

```bash
# Install dependencies
npm install
```

## Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

## Deployment

The project is configured for deployment to GitHub Pages:

```bash
# Deploy to GitHub Pages
npm run deploy
```

## Project Structure

```
src/
├── components/     # Reusable UI components
├── layouts/       # Layout components (AppLayout, Sidebar, TopBar)
├── pages/         # Page components for each route
├── data/          # Static data files (alerts, arms, conflicts)
├── store/         # Zustand state management
├── types/         # TypeScript type definitions
├── lib/           # Utility functions and configurations
└── assets/        # Static assets (images, icons)
```

## Available Scripts

- `npm run dev` - Start development server with hot module replacement
- `npm run build` - Build production bundle with TypeScript compilation
- `npm run lint` - Run ESLint for code quality checks
- `npm run preview` - Preview production build locally
- `npm run deploy` - Deploy to GitHub Pages

## Browser Support

Modern browsers supporting ES6+ features:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## License

Private project - All rights reserved
