import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import crypto from 'crypto';
import { config } from 'dotenv';

// Load environment variables from .env file
config();



const app = express();
const PORT = 3001;

// Enable CORS
app.use(cors());

// RSS Proxy endpoint
app.get('/api/rss-proxy', async (req, res) => {
  const { url } = req.query;
  
  if (!url || typeof url !== 'string') {
    return res.status(400).json({ error: 'URL parameter is required' });
  }

  try {
    console.log('RSS Proxy: Fetching', url);
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; PodtardstrMusic/1.0; RSS Feed Reader)',
        'Accept': 'application/rss+xml, application/xml, text/xml, application/atom+xml, */*',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const text = await response.text();
    res.set('Content-Type', 'application/xml; charset=utf-8');
    res.send(text);
  } catch (error) {
    console.error('RSS Proxy Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Audio Proxy endpoint
app.get('/api/audio-proxy', async (req, res) => {
  const { url } = req.query;
  
  if (!url || typeof url !== 'string') {
    return res.status(400).json({ error: 'URL parameter is required' });
  }

  try {
    console.log('Audio Proxy: Fetching', url);
    
    const headers = {
      'User-Agent': 'Mozilla/5.0 (compatible; PodtardstrMusic/1.0; Audio Proxy)',
      'Accept': 'audio/*',
    };

    // Forward Range header if present
    if (req.headers.range) {
      headers['Range'] = req.headers.range;
    }

    const response = await fetch(url, { headers });

    if (!response.ok && response.status !== 206) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    // Forward important headers
    const contentType = response.headers.get('content-type');
    const contentLength = response.headers.get('content-length');
    const acceptRanges = response.headers.get('accept-ranges');
    const contentRange = response.headers.get('content-range');
    
    if (contentType) res.set('Content-Type', contentType);
    if (contentLength) res.set('Content-Length', contentLength);
    if (acceptRanges) res.set('Accept-Ranges', acceptRanges);
    if (contentRange) res.set('Content-Range', contentRange);
    
    res.status(response.status);
    
    // Stream the response
    response.body.pipe(res);
  } catch (error) {
    console.error('Audio Proxy Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// PodcastIndex API endpoint
app.get('/api/podcastindex', async (req, res) => {
  try {
    const { path, ...queryParams } = req.query;
    
    if (!path || typeof path !== 'string') {
      return res.status(400).json({ error: 'Path parameter is required' });
    }

    // Get API credentials from environment variables
    const API_KEY = process.env.VITE_PODCAST_INDEX_API_KEY;
    const API_SECRET = process.env.VITE_PODCAST_INDEX_API_SECRET;

    if (!API_KEY || !API_SECRET) {
      console.error('PodcastIndex API credentials not found in environment variables');
      return res.status(500).json({ error: 'API credentials not configured' });
    }

    // Generate authentication headers
    const apiHeaderTime = Math.floor(Date.now() / 1000);
    const data4Hash = API_KEY + API_SECRET + apiHeaderTime;
    const hash4Header = crypto.createHash('sha1').update(data4Hash).digest('hex');

    const authHeaders = {
      'X-Auth-Date': apiHeaderTime.toString(),
      'X-Auth-Key': API_KEY,
      'Authorization': hash4Header,
      'User-Agent': 'PodtardsMusic/1.0',
    };

    // Build the API URL
    const apiUrl = new URL(`/api/1.0/${path}`, 'https://api.podcastindex.org');
    
    // Add query parameters
    Object.entries(queryParams).forEach(([key, value]) => {
      if (typeof value === 'string') {
        apiUrl.searchParams.append(key, value);
      }
    });

    console.log(`🔍 PodcastIndex API request: ${apiUrl.toString()}`);

    // Make the request to PodcastIndex API
    const response = await fetch(apiUrl.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders,
      },
    });

    if (!response.ok) {
      console.error(`❌ PodcastIndex API error: ${response.status} ${response.statusText}`);
      return res.status(response.status).json({ 
        error: `PodcastIndex API error: ${response.status} ${response.statusText}` 
      });
    }

    const data = await response.json();
    
    console.log(`✅ PodcastIndex API response: ${response.status}`);
    res.json(data);

  } catch (error) {
    console.error('❌ PodcastIndex API handler error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Dev server running on http://localhost:${PORT}`);
});