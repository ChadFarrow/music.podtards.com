export interface Album {
  id: string;
  title: string;
  artist: string;
  artwork?: string;
  feedUrl: string;
  description?: string;
}

export const FEATURED_ALBUMS: Album[] = [
  {
    id: 'bloodshot-lies',
    title: 'Bloodshot Lies - The Album',
    artist: 'The Doerfels',
    artwork: 'https://www.doerfelverse.com/art/bloodshot-lies-the-album.png',
    feedUrl: 'https://www.doerfelverse.com/feeds/bloodshot-lies-album.xml',
    description: 'A powerful collection of rock anthems exploring themes of deception and resilience.'
  },
  {
    id: 'heycitizen-experience',
    title: 'The HeyCitizen Experience',
    artist: 'HeyCitizen',
    artwork: 'https://files.heycitizen.xyz/Songs/Albums/HeyCitizen-Experience/HeyCitizen-Experience.png',
    feedUrl: 'https://files.heycitizen.xyz/Songs/Albums/HeyCitizen-Experience/HeyCitizen-Experience.xml',
    description: 'An eclectic journey through electronic soundscapes and experimental beats.'
  },
  {
    id: 'makin-beans',
    title: 'Makin\' Beans',
    artist: 'Able and The Wolf',
    artwork: 'https://ableandthewolf.com/static/media/01_MakinBeans.6dfb9c8e18b0f28adf4d.jpg',
    feedUrl: 'https://ableandthewolf.com/static/media/feed.xml',
    description: 'Intimate acoustic sessions that invite listeners to pause and reflect.'
  },
  {
    id: 'spectral-hiding',
    title: 'Spectral Hiding',
    artist: 'Bitpunk.fm',
    artwork: 'https://files.bitpunk.fm/spectral_hiding.png',
    feedUrl: 'https://zine.bitpunk.fm/feeds/spectral-hiding.xml',
    description: 'Ethereal electronic compositions that blur the line between digital and organic.'
  },
  {
    id: 'polar-embrace',
    title: 'Polar Embrace',
    artist: 'The Satellite Skirmish',
    artwork: 'https://music.behindthesch3m3s.com/wp-content/uploads/Sat_Skirmish/polarembrace/art/Polar-Embrace-Feed-art-hires.gif',
    feedUrl: 'https://music.behindthesch3m3s.com/wp-content/uploads/Sat_Skirmish/polarembrace/rss/videofeed/feed.xml',
    description: 'Ambient soundscapes inspired by arctic solitude and cosmic wonder.'
  },
  {
    id: 'tinderbox',
    title: 'Tinderbox',
    artist: 'Nate Johnivan',
    artwork: 'https://d12wklypp119aj.cloudfront.net/image/d677db67-0310-4813-970e-e65927c689f1.jpg',
    feedUrl: 'https://wavlake.com/feed/music/d677db67-0310-4813-970e-e65927c689f1',
    description: 'Raw, emotional tracks that ignite the soul and challenge conventions.'
  }
];