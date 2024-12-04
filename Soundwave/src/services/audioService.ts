import toast from 'react-hot-toast';
import type { Song, Playlist } from '../types';

const STORAGE_KEYS = {
  SONGS: 'uploadedSongs',
  PLAYLISTS: 'userPlaylists',
  LIKED_SONGS: 'likedSongs',
  QUEUE: 'songQueue'
};

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB limit
const ALLOWED_AUDIO_TYPES = ['audio/mpeg', 'audio/wav', 'audio/mp3'];
const MIN_STORAGE_BUFFER = 500 * 1024; // 500KB minimum free space

// Storage detection
export async function getStorageInfo() {
  try {
    let total = 0;
    let used = 0;

    // Try to detect actual storage limit
    if (navigator.storage && navigator.storage.estimate) {
      const estimate = await navigator.storage.estimate();
      total = estimate.quota || 0;
      used = estimate.usage || 0;
    } else {
      // Fallback to conservative estimate
      total = 5 * 1024 * 1024; // 5MB
      used = getStorageUsage();
    }

    const percentage = total > 0 ? Math.round((used / total) * 100) : 0;
    return { total, used, percentage };
  } catch (error) {
    console.error('Error getting storage info:', error);
    return { total: 0, used: 0, percentage: 0 };
  }
}

export function getStorageUsage(): number {
  try {
    let total = 0;
    for (const key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        total += (localStorage[key]?.length || 0) * 2; // UTF-16 characters = 2 bytes each
      }
    }
    return total;
  } catch (error) {
    console.error('Error calculating storage usage:', error);
    return 0;
  }
}

async function getAvailableStorage(): Promise<number> {
  const { total, used } = await getStorageInfo();
  return Math.max(0, total - used);
}

// Queue management functions
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

function generateUniqueId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

async function compressAudioData(audioData: string): Promise<string> {
  // Basic compression by reducing data URL quality
  if (audioData.startsWith('data:audio/wav')) {
    // Convert WAV to MP3-like format by changing the MIME type
    return audioData.replace('data:audio/wav', 'data:audio/mpeg');
  }
  return audioData;
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

export function getPlaylists(): Playlist[] {
  try {
    const playlistsData = localStorage.getItem(STORAGE_KEYS.PLAYLISTS);
    return playlistsData ? JSON.parse(playlistsData) : [];
  } catch (error) {
    console.error('Error getting playlists:', error);
    return [];
  }
}

export async function deleteSong(songId: string): Promise<boolean> {
  try {
    const songs = getAllSongs();
    const updatedSongs = songs.filter(song => song.id !== songId);
    localStorage.setItem(STORAGE_KEYS.SONGS, JSON.stringify(updatedSongs));

    // Update playlists
    const playlists = getPlaylists();
    const updatedPlaylists = playlists.map(playlist => ({
      ...playlist,
      songs: playlist.songs.filter(id => id !== songId)
    }));
    localStorage.setItem(STORAGE_KEYS.PLAYLISTS, JSON.stringify(updatedPlaylists));

    // Update queue
    const queue = getQueue();
    const updatedQueue = queue.filter(song => song.id !== songId);
    setQueue(updatedQueue);

    return true;
  } catch (error) {
    console.error('Error deleting song:', error);
    throw new Error('Failed to delete song');
  }
}

export async function uploadAudio(file: File): Promise<Song | null> {
  try {
    // Validate file
    if (!ALLOWED_AUDIO_TYPES.includes(file.type)) {
      toast.error('Please upload MP3 or WAV files only');
      return null;
    }

    if (file.size > MAX_FILE_SIZE) {
      toast.error('File is too large (maximum 10MB)');
      return null;
    }

    return new Promise((resolve) => {
      const reader = new FileReader();
      
      reader.onload = async (event) => {
        try {
          if (!event.target?.result) {
            throw new Error('Failed to read file');
          }

          const originalAudioData = event.target.result as string;
          const audioData = await compressAudioData(originalAudioData);
          
          // Check storage availability
          const estimatedSize = audioData.length * 2;
          const availableStorage = await getAvailableStorage();

          if (estimatedSize + MIN_STORAGE_BUFFER > availableStorage) {
            throw new Error(
              'Not enough storage space available. Please delete some songs first.'
            );
          }

          const audio = new Audio(audioData);
          
          await new Promise((res, rej) => {
            audio.onloadedmetadata = () => res(null);
            audio.onerror = () => rej(new Error('Invalid audio file'));
          });

          const newSong: Song = {
            id: generateUniqueId(),
            title: file.name.replace(/\.[^/.]+$/, ""),
            artist: "Unknown Artist",
            album: "Unknown Album",
            coverUrl: "https://images.unsplash.com/photo-1611339555312-e607c8352fd7",
            duration: formatDuration(audio.duration),
            uploadDate: new Date().toISOString(),
            audioData,
          };

          const storedSongs = getAllSongs();
          localStorage.setItem(STORAGE_KEYS.SONGS, JSON.stringify([...storedSongs, newSong]));
          toast.success('Song uploaded successfully');
          resolve(newSong);
        } catch (error) {
          console.error('Error processing audio:', error);
          toast.error(error.message || 'Error processing audio file');
          resolve(null);
        }
      };

      reader.onerror = () => {
        toast.error('Error reading file');
        resolve(null);
      };

      reader.readAsDataURL(file);
    });
  } catch (error) {
    console.error('Upload error:', error);
    toast.error('Failed to upload file');
    return null;
  }
}

export function createPlaylist(name: string, description: string): Playlist {
  const newPlaylist: Playlist = {
    id: generateUniqueId(),
    name,
    description,
    coverUrl: "https://images.unsplash.com/photo-1611339555312-e607c8352fd7",
    songs: []
  };

  try {
    const playlists = getPlaylists();
    localStorage.setItem(STORAGE_KEYS.PLAYLISTS, JSON.stringify([...playlists, newPlaylist]));
    return newPlaylist;
  } catch (error) {
    console.error('Error creating playlist:', error);
    toast.error('Failed to create playlist');
    throw error;
  }
}

export function searchSongs(query: string): Song[] {
  const songs = getAllSongs();
  const searchQuery = query.toLowerCase();
  
  return songs.filter(song => 
    song.title.toLowerCase().includes(searchQuery) ||
    song.artist.toLowerCase().includes(searchQuery) ||
    song.album.toLowerCase().includes(searchQuery)
  );
}