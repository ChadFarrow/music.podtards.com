// Podcast Index API types and fetch function
export interface PodcastIndexPodcast {
  id: number;
  title: string;
  url: string;
  originalUrl?: string;
  link?: string;
  description?: string;
  author?: string;
  ownerName?: string;
  image?: string;
  artwork?: string;
  feedImage?: string;
  itunesId?: number;
  generator?: string;
  language?: string;
  type?: string;
  categories?: Record<string, string>;
  dead?: boolean;
  crawlErrors?: number;
  parseErrors?: number;
  explicit?: boolean;
  podcastGuid?: string;
  podcastType?: string;
  value?: {
    model: {
      type: string;
      method: string;
      suggested: string;
    };
    destinations: Array<{
      name: string;
      address: string;
      type: string;
      split: number;
      fee?: boolean;
      customKey?: string;
      customValue?: string;
    }>;
  };
}

export interface PodcastIndexEpisode {
  id: number;
  title: string;
  link?: string;
  description?: string;
  guid?: string;
  datePublished?: number;
  datePublishedPretty?: string;
  dateCrawled?: number;
  enclosureUrl?: string;
  enclosureType?: string;
  enclosureLength?: number;
  duration?: number;
  explicit?: boolean;
  episode?: number;
  episodeType?: string;
  season?: number;
  image?: string;
  feedItunesId?: number;
  feedImage?: string;
  feedId?: number;
  feedTitle?: string;
  feedLanguage?: string;
  transcriptUrl?: string;
  chaptersUrl?: string;
  transcriptType?: string;
  value?: {
    model: {
      type: string;
      method: string;
      suggested: string;
    };
    destinations: Array<{
      name: string;
      address: string;
      type: string;
      split: number;
      fee?: boolean;
      customKey?: string;
      customValue?: string;
    }>;
  };
}

export interface PodcastIndexResponse<T> {
  status: string;
  feeds?: T[];
  items?: T[];
  count?: number;
  query?: string;
  description?: string;
}

// Podcast Index API fetch function
export async function podcastIndexFetch<T>(
  endpoint: string,
  params: Record<string, string> = {}
): Promise<PodcastIndexResponse<T>> {
  const apiKey = import.meta.env.VITE_PODCAST_INDEX_API_KEY;
  const apiSecret = import.meta.env.VITE_PODCAST_INDEX_API_SECRET;

  if (!apiKey || !apiSecret) {
    console.warn('Podcast Index API credentials not found. Using fallback RSS parsing.');
    throw new Error('Podcast Index API credentials not configured');
  }

  // For client-side apps, we need to proxy through a server
  // Since this is a static site, we'll use the fallback approach
  console.log('Podcast Index API not available in client-side app, using fallback');
  throw new Error('Podcast Index API not available in client-side app');
}

// Fallback function for when API credentials are not available
export async function podcastIndexFetchFallback<T>(
  endpoint: string,
  params: Record<string, string> = {}
): Promise<PodcastIndexResponse<T>> {
  console.log('Using fallback RSS parsing instead of Podcast Index API');
  
  // Return empty response for fallback
  // This allows the app to continue working with RSS feed parsing
  return {
    status: 'fallback',
    feeds: [],
    items: [],
    count: 0,
    query: params.q || '',
    description: 'Using RSS feed parsing fallback - Podcast Index API not available in client-side app',
  };
} 