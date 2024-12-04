import toast from 'react-hot-toast';
import type { Song, Playlist } from '../types';

const STORAGE_KEYS = {
  SONGS: 'uploadedSongs',
  PLAYLISTS: 'userPlaylists',
  LIKED_SONGS: 'likedSongs',
  QUEUE: 'songQueue',
};

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB limit
const ALLOWED_AUDIO_TYPES = ['audio/mpeg', 'audio/wav', 'audio/mp3'];
const MIN_STORAGE_BUFFER = 500 * 1024; // 500KB minimum free space

// Utility functions
const formatFileSize = (size: number): string => {
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  if (size < 1024 * 1024 * 1024) return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  return `${(size / (1024 * 1024 * 1024)).toFixed(1)} GB`;
};

const formatDuration = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

const generateUniqueId = (): string => Date.now().toString(36) + Math.random().toString(36).substr(2);

// Storage management
export async function getStorageInfo() {
  try {
    const estimate = await navigator.storage?.estimate() ?? { quota: 5 * 1024 * 1024, usage: 0 };
    return {
      total: estimate.quota ?? 0,
      used: estimate.usage ?? 0, // Default to 0 if usage is undefined
      percentage: estimate.quota ? Math.round((estimate.usage ?? 0) / estimate.quota * 100) : 0,
    };
  } catch (error) {
    console.error('Error getting storage info:', error);
    return { total: 0, used: 0, percentage: 0 };
  }
}

export function getStorageUsage(): number {
  try {
    return Object.values(localStorage).reduce((total, value) => total + (value?.length || 0) * 2, 0); // UTF-16
  } catch (error) {
    console.error('Error calculating storage usage:', error);
    return 0;
  }
}

export async function getAvailableStorage(): Promise<number> {
  const { total, used } = await getStorageInfo();
  return Math.max(0, total - used);
}

// Queue management
export function getQueue(): Song[] {
  try {
    const queueData = localStorage.getItem(STORAGE_KEYS.QUEUE);
    return queueData ? JSON.parse(queueData) : [];
  } catch (error) {
    console.error('Error getting queue:', error);
    return [];
  }
}

export function setQueue(songs: Song[]) {
  try {
    localStorage.setItem(STORAGE_KEYS.QUEUE, JSON.stringify(songs));
  } catch (error) {
    console.error('Error setting queue:', error);
    toast.error('Failed to update queue');
  }
}

// Playlist management
export function getPlaylists(): Playlist[] {
  try {
    const playlistsData = localStorage.getItem(STORAGE_KEYS.PLAYLISTS);
    return playlistsData ? JSON.parse(playlistsData) : [];
  } catch (error) {
    console.error('Error getting playlists:', error);
    return [];
  }
}

export function addSongsToPlaylist(playlistId: string, songs: Song[]): Playlist | null {
  try {
    const playlists = getPlaylists();
    const playlist = playlists.find(p => p.id === playlistId);
    if (!playlist) throw new Error('Playlist not found');
    
    playlist.songs.push(...songs.map(song => song)); // Add only song IDs, not the full song object
    localStorage.setItem(STORAGE_KEYS.PLAYLISTS, JSON.stringify(playlists));

    return playlist;
  } catch (error) {
    console.error('Error adding songs to playlist:', error);
    return null;
  }
}

export function createPlaylist(name: string, description: string): Playlist {
  const newPlaylist: Playlist = {
    id: generateUniqueId(),
    name,
    description,
    coverUrl: "https://images.unsplash.com/photo-1611339555312-e607c8352fd7",
    songs: [],
  };
  try {
    const playlists = getPlaylists();
    playlists.push(newPlaylist);
    localStorage.setItem(STORAGE_KEYS.PLAYLISTS, JSON.stringify(playlists));
    return newPlaylist;
  } catch (error) {
    console.error('Error creating playlist:', error);
    toast.error('Failed to create playlist');
    throw error;
  }
}

// Song management
export async function deleteSong(songId: string): Promise<boolean> {
  try {
    let success = true;
    const songs = getAllSongs();
    const updatedSongs = songs.filter(song => song.id !== songId);
    if (updatedSongs.length === songs.length) success = false;
    localStorage.setItem(STORAGE_KEYS.SONGS, JSON.stringify(updatedSongs));

    // Update playlists
    const playlists = getPlaylists();
    playlists.forEach(playlist => {
      playlist.songs = playlist.songs.filter(id => id.id !== songId);
    });
    localStorage.setItem(STORAGE_KEYS.PLAYLISTS, JSON.stringify(playlists));

    // Update queue
    const queue = getQueue();
    const updatedQueue = queue.filter(song => song.id !== songId);
    setQueue(updatedQueue);

    return success;
  } catch (error) {
    console.error('Error deleting song:', error);
    toast.error('Failed to delete song');
    return false;
  }
}

export async function uploadAudio(file: File): Promise<Song | null> {
  try {
    if (!ALLOWED_AUDIO_TYPES.includes(file.type)) {
      toast.error('Only MP3 and WAV files are allowed');
      return null;
    }

    if (file.size > MAX_FILE_SIZE) {
      toast.error('File size exceeds the 10MB limit');
      return null;
    }

    const audioData = await readFileAsDataUrl(file);
    const compressedAudioData = await compressAudioData(audioData);
    const estimatedSize = compressedAudioData.length * 2; // Assuming UTF-16

    const availableStorage = await getAvailableStorage();
    if (estimatedSize + MIN_STORAGE_BUFFER > availableStorage) {
      toast.error('Not enough storage space');
      return null;
    }

    const audio = new Audio(compressedAudioData);
    await new Promise((res, rej) => {
      audio.onloadedmetadata = res;
      audio.onerror = rej;
    });

    const newSong: Song = {
      id: generateUniqueId(),
      title: file.name.replace(/\.[^/.]+$/, ""),
      artist: "Unknown Artist",
      album: "Unknown Album",
      size: formatFileSize(file.size),
      coverUrl: "https://images.unsplash.com/photo-1611339555312-e607c8352fd7",
      duration: formatDuration(audio.duration),
      uploadDate: new Date().toISOString(),
      audioData: compressedAudioData,
    };

    const songs = getAllSongs();
    localStorage.setItem(STORAGE_KEYS.SONGS, JSON.stringify([...songs, newSong]));
    toast.success('Song uploaded successfully');
    return newSong;
  } catch (error) {
    console.error('Error uploading song:', error);
    toast.error('Failed to upload song');
    return null;
  }
}

export function getAllSongs(): Song[] {
  try {
    const songsData = localStorage.getItem(STORAGE_KEYS.SONGS);
    return songsData ? JSON.parse(songsData) : [];
  } catch (error) {
    console.error('Error getting songs:', error);
    return [];
  }
}

export function searchSongs(query: string): Song[] {
  const songs = getAllSongs();
  const lowercasedQuery = query.toLowerCase();
  return songs.filter(song =>
    song.title.toLowerCase().includes(lowercasedQuery) ||
    song.artist.toLowerCase().includes(lowercasedQuery) ||
    song.album.toLowerCase().includes(lowercasedQuery)
  );
}

async function compressAudioData(audioData: string): Promise<string> {
  if (audioData.startsWith('data:audio/wav')) {
    return audioData.replace('data:audio/wav', 'data:audio/mpeg');
  }
  return audioData;
}

const readFileAsDataUrl = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};
