import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';

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

app.listen(PORT, () => {
  console.log(`Dev server running on http://localhost:${PORT}`);
});