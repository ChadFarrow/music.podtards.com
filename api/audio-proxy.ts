import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Range');
  res.setHeader('Access-Control-Expose-Headers', 'Content-Length, Content-Range, Accept-Ranges');
  
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
    console.log('Audio Proxy: Fetching', url);
    
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

    // Prepare headers including Range for partial content support
    const headers: HeadersInit = {
      'User-Agent': 'Mozilla/5.0 (compatible; PodtardstrMusic/1.0; Audio Proxy)',
      'Accept': 'audio/*',
      'Accept-Encoding': 'identity', // Don't compress audio
    };

    // Forward Range header if present (for seeking)
    const rangeHeader = req.headers.range;
    if (rangeHeader) {
      headers['Range'] = rangeHeader;
    }

    // Fetch the audio file with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
    
    console.log('Audio Proxy: Making fetch request to', url);
    
    const response = await fetch(url, {
      signal: controller.signal,
      headers,
      redirect: 'follow'
    });
    
    clearTimeout(timeoutId);
    
    console.log('Audio Proxy: Response status:', response.status, response.statusText);

    if (!response.ok && response.status !== 206) { // 206 is partial content
      const errorMsg = `HTTP ${response.status}: ${response.statusText}`;
      console.error('Audio Proxy: Fetch failed:', errorMsg);
      throw new Error(errorMsg);
    }

    // Forward important headers
    const contentType = response.headers.get('content-type');
    const contentLength = response.headers.get('content-length');
    const acceptRanges = response.headers.get('accept-ranges');
    const contentRange = response.headers.get('content-range');
    
    if (contentType) {
      res.setHeader('Content-Type', contentType);
    } else {
      // Default to MP3 if no content type specified
      res.setHeader('Content-Type', 'audio/mpeg');
    }
    
    if (contentLength) {
      res.setHeader('Content-Length', contentLength);
    }
    
    if (acceptRanges) {
      res.setHeader('Accept-Ranges', acceptRanges);
    }
    
    if (contentRange) {
      res.setHeader('Content-Range', contentRange);
    }

    // Set cache headers for audio files
    res.setHeader('Cache-Control', 'public, max-age=31536000'); // Cache for 1 year
    
    // Set status code
    res.status(response.status);
    
    // Stream the response
    if (response.body) {
      const reader = response.body.getReader();
      
      while (true) {
        const { done, value } = await reader.read();
        
        if (done) break;
        
        res.write(value);
      }
      
      res.end();
    } else {
      res.status(500).json({ error: 'No response body' });
    }
    
  } catch (error) {
    console.error('Audio Proxy Error:', error);
    
    let errorMessage = 'Failed to fetch audio file';
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