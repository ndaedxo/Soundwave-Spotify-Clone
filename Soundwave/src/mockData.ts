import { Song, Playlist } from './types';

export const mockPlaylists: Playlist[] = [
  {
    id: '1',
    name: 'Today\'s Top Hits',
    description: 'The biggest hits right now.',
    coverUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    songs: [  // This is now correctly typed as Song[]
      {
        id: '1-1',
        title: 'Dance The Night',
        artist: 'Dua Lipa',
        album: 'Barbie',
        duration: '3:21',
        coverUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
        size: '5MB',  // Added 'size' to each song
      },
      {
        id: '1-2',
        title: 'Vampire',
        artist: 'Olivia Rodrigo',
        album: 'GUTS',
        duration: '3:40',
        coverUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
        size: '6MB',  // Added 'size' to each song
      },
    ],
  },
  // ... other playlists
];

export const recentlyPlayed: Song[] = [
  {
    id: '1-1',
    title: 'Dance The Night',
    artist: 'Dua Lipa',
    album: 'Barbie',
    duration: '3:21',
    coverUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    size: '5MB',  // Added 'size' to each song
  },
  // ... other songs
];
