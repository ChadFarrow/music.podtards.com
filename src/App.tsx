import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AlbumGallery } from './components/AlbumGallery';
import { AlbumViewEnhanced } from './components/AlbumViewEnhanced';
import { ScrollToTop } from './components/ScrollToTop';
import { PodcastPlayer } from './components/PodcastPlayer';
import { ThemeDemo } from './components/ThemeDemo';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 6 * 60 * 60 * 1000, // 6 hours
      gcTime: 24 * 60 * 60 * 1000, // 24 hours
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <ScrollToTop />
        <div className="min-h-screen bg-black text-white">
          <ThemeDemo />
          <Routes>
            <Route path="/" element={<AlbumGallery />} />
            <Route path="/albums" element={<AlbumGallery />} />
            <Route path="/albums/:albumSlug" element={<AlbumViewEnhanced />} />
          </Routes>
          <PodcastPlayer />
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
