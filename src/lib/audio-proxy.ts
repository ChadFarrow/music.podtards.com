/**
 * Proxies audio URLs through our backend to avoid CORS issues
 * Only proxies URLs that are likely to have CORS issues
 */
export function getProxiedAudioUrl(originalUrl: string): string {
  if (!originalUrl) return originalUrl;

  try {
    const url = new URL(originalUrl);
    
    // List of domains that need proxying due to CORS issues
    const domainsNeedingProxy = [
      'bitpunk.fm',
      'files.bitpunk.fm',
      'zine.bitpunk.fm',
      'music.behindthesch3m3s.com',
      'ableandthewolf.com',
      'static.staticsave.com',
      'f4.bcbits.com',
      'whiterabbitrecords.org'
    ];
    
    // Check if the domain needs proxying
    const needsProxy = domainsNeedingProxy.some(domain => 
      url.hostname.includes(domain)
    );
    
    if (!needsProxy) {
      // Return original URL if domain doesn't need proxying
      return originalUrl;
    }
    
    // For production, use the API proxy endpoint
    if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
      const proxyUrl = new URL('/api/audio-proxy', window.location.origin);
      proxyUrl.searchParams.set('url', originalUrl);
      console.log('Audio proxy: Proxying URL', originalUrl, 'through', proxyUrl.toString());
      return proxyUrl.toString();
    }
    
    // For local development, use a public CORS proxy as fallback
    // This is temporary until the audio proxy server is configured
    const corsProxyUrl = `https://corsproxy.io/?${encodeURIComponent(originalUrl)}`;
    console.log('Audio proxy: Using CORS proxy for local dev', originalUrl, 'through', corsProxyUrl);
    
    return corsProxyUrl;
  } catch (error) {
    console.error('Error creating proxy URL:', error);
    // Return original URL if there's an error
    return originalUrl;
  }
}