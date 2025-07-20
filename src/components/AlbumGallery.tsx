import { Link } from 'react-router-dom';
import { ImageWithFallback } from './ImageWithFallback';
import { Disc } from 'lucide-react';

interface Album {
  id: string;
  title: string;
  artist: string;
  artwork?: string;
  feedUrl: string;
  description?: string;
}

// Featured albums data
const FEATURED_ALBUMS: Album[] = [
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
    artwork: 'https://files.heycitizen.xyz/Songs/Albums/The-Heycitizen-Experience/The-Heycitizen-Experience.jpg',
    feedUrl: 'https://files.heycitizen.xyz/Songs/Albums/The-Heycitizen-Experience/the heycitizen experience.xml',
    description: 'An experimental journey through electronic soundscapes and indie vibes.'
  },
  {
    id: 'think-ep',
    title: 'Think EP',
    artist: 'The Doerfels',
    artwork: 'https://www.doerfelverse.com/art/think-ep.png',
    feedUrl: 'https://www.doerfelverse.com/feeds/think-ep.xml',
    description: 'A contemplative EP that challenges conventional thinking through melodic storytelling.'
  },
  {
    id: 'music-from-the-doerfelverse',
    title: 'Music From The Doerfel-Verse',
    artist: 'The Doerfels',
    artwork: 'https://www.doerfelverse.com/art/carol-of-the-bells.png',
    feedUrl: 'https://www.doerfelverse.com/feeds/music-from-the-doerfelverse.xml',
    description: 'A diverse collection spanning the musical universe of The Doerfels.'
  },
  {
    id: 'stay-awhile',
    title: 'Stay Awhile',
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
    id: 'autumn-rust',
    title: 'Autumn Rust',
    artist: 'The Satellite Skirmish',
    artwork: 'https://music.behindthesch3m3s.com/wp-content/uploads/Sat_Skirmish/autumnrust/art/Autumn-Rust-Feed-Art.gif',
    feedUrl: 'https://music.behindthesch3m3s.com/wp-content/uploads/Sat_Skirmish/autumnrust/mp3s/album_feed/feed.xml',
    description: 'Melancholic melodies capturing the beauty of seasonal transformation.'
  },
  {
    id: 'the-satellite-skirmish-album',
    title: 'The Satellite Skirmish',
    artist: 'Various Artists',
    artwork: 'https://music.behindthesch3m3s.com/wp-content/uploads/Sat_Skirmish/art/the%20satellite%20skirmish%20mku.gif',
    feedUrl: 'https://music.behindthesch3m3s.com/wp-content/uploads/Sat_Skirmish/the_satellite_skirmish_album.xml',
    description: 'A collaborative collection featuring diverse artists from the Satellite Skirmish collective.'
  },
  {
    id: 'lofi-experience',
    title: 'HeyCitizen\'s Lo-Fi Hip-Hop Beats to Study and Relax to',
    artist: 'HeyCitizen',
    artwork: 'https://files.heycitizen.xyz/Songs/Albums/Lofi-Experience/Lofi-Experience.png',
    feedUrl: 'https://files.heycitizen.xyz/Songs/Albums/Lofi-Experience/lofi.xml',
    description: 'Chill beats perfect for focus, relaxation, and late-night coding sessions.'
  },
  {
    id: 'tinderbox',
    title: 'Tinderbox',
    artist: 'Nate Johnivan',
    artwork: 'https://d12wklypp119aj.cloudfront.net/image/d677db67-0310-4813-970e-e65927c689f1.jpg',
    feedUrl: 'https://wavlake.com/feed/music/d677db67-0310-4813-970e-e65927c689f1',
    description: 'Raw, emotional tracks that ignite the soul and challenge conventions.'
  },
  {
    id: 'deathdreams',
    title: 'deathdreams',
    artist: 'Survival Guide (Emily Whitehurst)',
    artwork: 'https://static.wixstatic.com/media/484406_9138bd56c7b64a388da3b927a5bb2220~mv2.png',
    feedUrl: 'https://static.staticsave.com/mspfiles/deathdreams.xml',
    description: 'Haunting melodies exploring the darker corners of the human experience.'
  },
  {
    id: 'pony-up-daddy',
    title: 'Pony Up Daddy',
    artist: '$2 Holla',
    artwork: 'https://f4.bcbits.com/img/a1480089316_16.jpg',
    feedUrl: 'https://music.behindthesch3m3s.com/wp-content/uploads/Mike_Epting/$2Holla/pony%20up%20daddy.xml',
    description: 'High-energy beats and clever wordplay that demand attention.'
  },
  {
    id: 'empty-passenger-seat',
    title: 'Empty Passenger Seat',
    artist: 'Joe Martin',
    artwork: 'https://d12wklypp119aj.cloudfront.net/image/95ea253a-4058-402c-8503-204f6d3f1494.jpg',
    feedUrl: 'https://www.wavlake.com/feed/95ea253a-4058-402c-8503-204f6d3f1494',
    description: 'Indie rock journeys through solitude and self-discovery.'
  }
];

export function AlbumGallery() {
  return (
    <div 
      className="min-h-screen bg-black text-white py-8 pt-12 pb-32"
      style={{
        paddingLeft: `max(2rem, env(safe-area-inset-left))`,
        paddingRight: `max(2rem, env(safe-area-inset-right))`,
        paddingBottom: `max(8rem, env(safe-area-inset-bottom) + 6rem)`
      }}
    >
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-4 text-center">All Albums</h1>
        <p className="text-lg text-gray-300 mb-8 text-center max-w-3xl mx-auto">
          A collection of V4V albums from The Doerfels, Friends of the band and albums our producers enjoy
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {FEATURED_ALBUMS.map((album) => (
            <Link
              key={album.id}
              to={`/albums/${album.id}`}
              className="group relative overflow-hidden rounded-lg bg-gray-900 hover:bg-gray-800 transition-all duration-300 hover:scale-105"
            >
              <div className="aspect-square relative overflow-hidden">
                {album.artwork ? (
                  <ImageWithFallback
                    src={album.artwork}
                    alt={album.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    width={400}
                    height={400}
                    fallback="🎵"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                    <Disc size={80} className="text-gray-600" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
              </div>
              
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="font-bold text-lg mb-1 line-clamp-1">{album.title}</h3>
                <p className="text-sm text-gray-300 mb-2">{album.artist}</p>
                {album.description && (
                  <p className="text-xs text-gray-400 line-clamp-2">{album.description}</p>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}