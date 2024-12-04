export interface Song {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: string;
  coverUrl: string;
  liked?: boolean;
  uploadDate?: string;
  audioData?: string; // Base64 encoded audio data
}

export interface Playlist {
  id: string;
  name: string;
  description: string;
  coverUrl: string;
  songs: string[]; // Array of song IDs
}

export interface PlayerContextType {
  currentSong: Song | null;
  setCurrentSong: (song: Song) => void;
  togglePlay: () => void;
  isPlaying: boolean;
  volume: number;
  progress: number;
  duration: number;
  setVolume: (volume: number) => void;
  seekTo: (position: number) => void;
  queue: Song[];
  setPlaylist: (songs: Song[]) => void;
  addToQueue: (song: Song) => void;
  removeFromQueue: (songId: string) => void;
  playNext: () => void;
  playPrevious: () => void;
}

export interface SearchFilters {
  type: 'all' | 'title' | 'artist' | 'album';
  sortBy: 'title' | 'artist' | 'uploadDate';
  order: 'asc' | 'desc';
}