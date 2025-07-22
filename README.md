# Podtardstr Music

A focused album discovery site with Value4Value Lightning payments.

## 🎵 Features

- **Album Gallery**: Browse featured albums with beautiful artwork
- **Individual Album Pages**: Immersive album experience with dynamic theming
- **Value4Value Payments**: Lightning payments to support artists
- **Podcast Player**: Built-in audio player with playlist support
- **Mobile Optimized**: Responsive design with PWA support
- **Dynamic Theming**: Album artwork colors applied to UI elements

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd podtardstr-music

# Install dependencies
npm install

# Start development server
npm run dev
```

### Building for Production

```bash
npm run build
```

## 🏗️ Project Structure

```
src/
├── components/          # React components
│   ├── AlbumGallery.tsx     # Main albums grid
│   ├── AlbumViewEnhanced.tsx # Individual album page
│   ├── AlbumBackground.tsx   # Dynamic background theming
│   ├── TrackList.tsx         # Album track listing
│   ├── PodcastPlayer.tsx     # Audio player
│   └── ui/                   # shadcn/ui components
├── hooks/               # Custom React hooks
│   ├── useAlbumFeed.ts      # RSS feed parsing
│   ├── usePodcastPlayer.ts  # Audio player state
│   └── useColorExtraction.ts # Album artwork color extraction
├── lib/                 # Utility functions
│   ├── payment-utils.ts     # Lightning payment processing
│   └── feed-parser.ts       # RSS feed parsing
└── contexts/            # React contexts
    └── ThemeContext.tsx     # Theme management
```

## 🎨 Design Features

- **Apple Music-style Theming**: Dynamic color extraction from album artwork
- **Immersive Layout**: Full-screen album backgrounds with overlay content
- **Responsive Grid**: Adaptive album gallery layout
- **Smooth Animations**: Hover effects and transitions
- **Dark Theme**: Optimized for music listening experience

## ⚡ Value4Value Integration

- **Lightning Payments**: Direct payments to artists via Bitcoin Connect
- **RSS Feed Parsing**: Automatic extraction of payment information
- **Multi-recipient Support**: Split payments to multiple artists per track
- **Podcast Index 2.0**: Compliant TLV metadata for payments

## 📱 Mobile Support

- **PWA Ready**: Installable on iOS and Android
- **Touch Optimized**: Large touch targets and smooth scrolling
- **Safe Areas**: Proper handling of device notches and home indicators
- **Offline Support**: Service worker for caching

## 🛠️ Technology Stack

- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **shadcn/ui** for UI components
- **React Router** for navigation
- **TanStack Query** for data fetching
- **Zustand** for state management
- **Bitcoin Connect** for Lightning payments

## 🌐 Deployment

The site is designed to be deployed to `music.podtards.com` as a subdomain of the main Podtardstr application.

### Vercel Deployment

1. Connect your repository to Vercel
2. Set the domain to `music.podtards.com`
3. Configure build settings:
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

## 📄 License

This project is part of the Podtardstr ecosystem and follows the same licensing terms.# Rollback to pre-Bunny.net state - Mon Jul 21 21:39:58 EDT 2025
# Deployment test - Mon Jul 21 21:41:54 EDT 2025
