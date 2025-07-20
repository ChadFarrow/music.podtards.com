export interface Album {
  id: string;
  title: string;
  artist: string;
  artwork?: string;
  feedUrl: string;
  description?: string;
}

// The Doerfels Albums
export const DOERFELS_ALBUMS: Album[] = [
  {
    id: 'bloodshot-lies',
    title: 'Bloodshot Lies - The Album',
    artist: 'The Doerfels',
    artwork: 'https://www.doerfelverse.com/art/bloodshot-lies-the-album.png',
    feedUrl: 'https://www.doerfelverse.com/feeds/bloodshot-lies-album.xml',
    description: 'A powerful collection of rock anthems exploring themes of deception and resilience.'
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
    id: 'ben-doerfel',
    title: 'Ben Doerfel',
    artist: 'Ben Doerfel',
    artwork: 'https://www.doerfelverse.com/art/ben-doerfel-red.png',
    feedUrl: 'https://www.doerfelverse.com/feeds/ben-doerfel.xml',
    description: 'Solo work from Ben Doerfel'
  },
  {
    id: 'into-the-doerfelverse',
    title: 'Into the Doerfelverse',
    artist: 'The Doerfels',
    artwork: 'https://www.doerfelverse.com/art/v4v-music-podcast.png',
    feedUrl: 'https://www.doerfelverse.com/feeds/intothedoerfelverse.xml',
    description: 'Journey into the Doerfelverse'
  },
  {
    id: 'kurtisdrums-v1',
    title: 'Kurtisdrums V1',
    artist: 'Kurtis',
    artwork: 'https://www.doerfelverse.com/art/kurtisdrums.png',
    feedUrl: 'https://www.sirtjthewrathful.com/wp-content/uploads/2023/08/Kurtisdrums-V1.xml',
    description: 'Drum compositions by Kurtis'
  },
  {
    id: 'nostalgic',
    title: 'Nostalgic',
    artist: 'The Doerfels',
    artwork: 'https://www.doerfelverse.com/art/nostalgic.png',
    feedUrl: 'https://www.doerfelverse.com/feeds/nostalgic.xml',
    description: 'Nostalgic memories in musical form'
  },
  {
    id: 'citybeach',
    title: 'CityBeach',
    artist: 'The Doerfels',
    artwork: 'https://www.doerfelverse.com/art/citybeach.png',
    feedUrl: 'https://www.doerfelverse.com/feeds/citybeach.xml',
    description: 'Urban beach vibes and summer sounds'
  },
  {
    id: 'wrath-of-banjo',
    title: 'Wrath of Banjo',
    artist: 'The Doerfels',
    artwork: 'https://www.doerfelverse.com/art/wrath-of-banjo.png',
    feedUrl: 'https://www.doerfelverse.com/feeds/wrath-of-banjo.xml',
    description: 'Banjo-driven melodies with attitude'
  },
  {
    id: 'ring-that-bell',
    title: 'Ring That Bell',
    artist: 'The Doerfels',
    artwork: 'https://www.doerfelverse.com/art/ring-that-bell.png',
    feedUrl: 'https://www.doerfelverse.com/feeds/ring-that-bell.xml',
    description: 'Bell-inspired musical compositions'
  }
];

// Producers Picks Albums
export const PRODUCERS_PICKS_ALBUMS: Album[] = [
  {
    id: 'heycitizen-experience',
    title: 'The HeyCitizen Experience',
    artist: 'HeyCitizen',
    artwork: 'https://files.heycitizen.xyz/Songs/Albums/The-Heycitizen-Experience/The-HEYCitizen-Experience-3000x3000.jpg',
    feedUrl: 'https://files.heycitizen.xyz/Songs/Albums/The-Heycitizen-Experience/the heycitizen experience.xml',
    description: 'An experimental journey through electronic soundscapes and indie vibes.'
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
  },
  {
    id: 'aged-friends-old-whiskey',
    title: 'Aged Friends & Old Whiskey',
    artist: 'Various Artists',
    artwork: 'https://files.heycitizen.xyz/Songs/Albums/Aged-Friends-Old-Whiskey/Aged-Friends-Old-Whiskey.png',
    feedUrl: 'https://files.heycitizen.xyz/Songs/Albums/Aged-Friends-Old-Whiskey/aged-friends-old-whiskey.xml',
    description: 'A collection celebrating friendship and good times.'
  },
  {
    id: 'cosmodrome',
    title: 'Cosmodrome',
    artist: 'Various Artists',
    artwork: 'https://files.heycitizen.xyz/Songs/Albums/Cosmodrome/Cosmodrome.png',
    feedUrl: 'https://files.heycitizen.xyz/Songs/Albums/Cosmodrome/cosmodrome.xml',
    description: 'Space-themed musical journey.'
  },
  {
    id: 'east-to-west',
    title: 'East To West',
    artist: 'Various Artists',
    artwork: 'https://files.heycitizen.xyz/Songs/Albums/East-To-West/East-To-West.png',
    feedUrl: 'https://files.heycitizen.xyz/Songs/Albums/East-To-West/east-to-west.xml',
    description: 'Cross-country musical adventure.'
  },
  {
    id: 'tripodacus',
    title: 'Tripodacus',
    artist: 'Various Artists',
    artwork: 'https://files.heycitizen.xyz/Songs/Albums/Tripodacus/Tripodacus.png',
    feedUrl: 'https://files.heycitizen.xyz/Songs/Albums/Tripodacus/tripodacus.xml',
    description: 'Experimental three-part musical composition.'
  },
  {
    id: 'pilot',
    title: 'Pilot',
    artist: 'Various Artists',
    artwork: 'https://files.heycitizen.xyz/Songs/Albums/Pilot/Pilot.png',
    feedUrl: 'https://files.heycitizen.xyz/Songs/Albums/Pilot/pilot.xml',
    description: 'Taking flight with musical exploration.'
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
    id: 'mikes-mixtape',
    title: 'Mike\'s Mix Tape',
    artist: 'Mike Neumann',
    artwork: 'https://cdn.mikesmixtape.com/assets/static/mmt-logo2-512.jpg',
    feedUrl: 'https://mikesmixtape.com/mikesmixtaperss.xml',
    description: 'A value4value old school mix tape podcast featuring curated value4value music from independent artists. 🎵⚡'
  }
];

// Live Concerts Albums
export const LIVE_CONCERTS_ALBUMS: Album[] = [
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
    id: 'live-at-fickle-pickle',
    title: 'Live at the Fickle Pickle - Into the Valquverse',
    artist: 'The Doerfels',
    artwork: 'https://www.doerfelverse.com/art/live-at-the-fickle-pickle.png',
    feedUrl: 'https://www.doerfelverse.com/feeds/live-at-the-fickle-pickle.xml',
    description: 'Live concert recording from the Fickle Pickle venue.'
  }
];

// All albums combined for main gallery view
export const FEATURED_ALBUMS: Album[] = [
  ...DOERFELS_ALBUMS,
  ...PRODUCERS_PICKS_ALBUMS,
  ...LIVE_CONCERTS_ALBUMS
];