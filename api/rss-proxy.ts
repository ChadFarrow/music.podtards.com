import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createHash } from 'crypto';

// In-memory cache for development (Vercel will handle caching in production)
const cache = new Map<string, { data: string; etag: string; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes in milliseconds

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, If-None-Match');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { url, cache: cacheBust } = req.query;
  
  if (!url || typeof url !== 'string') {
    res.status(400).json({ error: 'URL parameter is required' });
    return;
  }

  try {
    console.log('RSS Proxy: Fetching', url);
    
    // Validate URL
    let parsedUrl;
    try {
      parsedUrl = new URL(url);
    } catch (urlError) {
      console.error('Invalid URL:', url, urlError);
      res.status(400).json({ error: 'Invalid URL format' });
      return;
    }

    // Only allow HTTP and HTTPS protocols
    if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
      console.error('Invalid protocol:', parsedUrl.protocol);
      res.status(400).json({ error: 'Only HTTP and HTTPS URLs are allowed' });
      return;
    }

    // Generate cache key with cache busting
    const cacheKey = createHash('md5').update(url + (cacheBust || '')).digest('hex');
    
    // Check cache first (skip if cache busting)
    const cached = cacheBust ? null : cache.get(cacheKey);
    const now = Date.now();
    
    if (cached && (now - cached.timestamp) < CACHE_TTL) {
      console.log('RSS Proxy: Serving from cache');
      
      // Check if client has the same version (ETag)
      const ifNoneMatch = req.headers['if-none-match'];
      if (ifNoneMatch === cached.etag) {
        res.status(304).end(); // Not Modified
        return;
      }
      
      // Set cache headers
      res.setHeader('ETag', cached.etag);
      res.setHeader('Cache-Control', 'public, max-age=300, s-maxage=600');
      res.setHeader('CDN-Cache-Control', 'public, max-age=600');
      res.setHeader('Vercel-CDN-Cache-Control', 'public, max-age=600');
      res.setHeader('Content-Type', 'application/xml; charset=utf-8');
      
      res.status(200).send(cached.data);
      return;
    }

    // Fetch the RSS feed with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout
    
    console.log('RSS Proxy: Making fetch request to', url);
    
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; PodtardstrMusic/1.0; RSS Feed Reader)',
        'Accept': 'application/rss+xml, application/xml, text/xml, application/atom+xml, */*',
        'Accept-Encoding': 'gzip, deflate',
        'Cache-Control': 'no-cache'
      },
      redirect: 'follow'
    });
    
    clearTimeout(timeoutId);
    
    console.log('RSS Proxy: Response status:', response.status, response.statusText);

    if (!response.ok) {
      const errorMsg = `HTTP ${response.status}: ${response.statusText}`;
      console.error('RSS Proxy: Fetch failed:', errorMsg);
      throw new Error(errorMsg);
    }

    const contentType = response.headers.get('content-type') || '';
    console.log('RSS Proxy: Content-Type:', contentType);
    
    const text = await response.text();
    console.log('RSS Proxy: Received', text.length, 'characters');
    
    // More lenient XML/RSS content validation
    const trimmedText = text.trim();
    const looksLikeXml = trimmedText.startsWith('<?xml') || 
                        trimmedText.startsWith('<rss') || 
                        trimmedText.startsWith('<feed') ||
                        trimmedText.includes('<rss') ||
                        trimmedText.includes('<feed') ||
                        trimmedText.includes('<channel>');
    
    if (!looksLikeXml) {
      console.error('RSS Proxy: Response does not appear to be XML/RSS content');
      console.error('RSS Proxy: First 200 chars:', trimmedText.substring(0, 200));
      throw new Error('Response does not appear to be XML/RSS content');
    }

    // Generate ETag for caching
    const etag = createHash('md5').update(text).digest('hex');
    
    // Cache the response
    cache.set(cacheKey, {
      data: text,
      etag: etag,
      timestamp: now
    });
    
    // Clean up old cache entries (keep only last 100 entries)
    if (cache.size > 100) {
      const entries = Array.from(cache.entries());
      entries.sort((a, b) => b[1].timestamp - a[1].timestamp);
      const toDelete = entries.slice(100);
      toDelete.forEach(([key]) => cache.delete(key));
    }

    // Set appropriate headers
    res.setHeader('Content-Type', contentType.includes('xml') ? contentType : 'application/xml; charset=utf-8');
    res.setHeader('ETag', etag);
    res.setHeader('Cache-Control', 'public, max-age=300, s-maxage=600');
    res.setHeader('CDN-Cache-Control', 'public, max-age=600');
    res.setHeader('Vercel-CDN-Cache-Control', 'public, max-age=600');
    
    console.log('RSS Proxy: Sending successful response');
    res.status(200).send(text);
    
  } catch (error) {
    console.error('RSS Proxy Error:', error);
    
    let errorMessage = 'Failed to fetch RSS feed';
    let statusCode = 500;
    
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        errorMessage = 'Request timeout';
        statusCode = 408;
      } else if (error.message.includes('HTTP')) {
        errorMessage = error.message;
        statusCode = 502;
      } else {
        errorMessage = error.message;
      }
    }
    
    res.status(statusCode).json({ 
      error: errorMessage,
      url: url 
    });
  }
}