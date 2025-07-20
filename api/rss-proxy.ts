import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { url } = req.query;
  
  if (!url || typeof url !== 'string') {
    res.status(400).json({ error: 'URL parameter is required' });
    return;
  }

  try {
    console.log('RSS Proxy: Fetching', url);
    
    // Validate URL
    try {
      new URL(url);
    } catch {
      res.status(400).json({ error: 'Invalid URL' });
      return;
    }

    // Fetch the RSS feed with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
    
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'PodtardstrMusic/1.0 (RSS Feed Reader)',
        'Accept': 'application/rss+xml, application/xml, text/xml, */*',
        'Cache-Control': 'no-cache'
      }
    });
    
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const contentType = response.headers.get('content-type') || '';
    const text = await response.text();
    
    // Verify it's actually XML/RSS content
    if (!text.includes('<?xml') && !text.includes('<rss') && !text.includes('<feed')) {
      throw new Error('Response does not appear to be XML/RSS content');
    }

    // Set appropriate headers
    res.setHeader('Content-Type', contentType.includes('xml') ? contentType : 'application/xml');
    res.setHeader('Cache-Control', 'public, max-age=300'); // Cache for 5 minutes
    
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