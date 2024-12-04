import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import type { Song } from '../types';
import { getQueue, setQueue } from '../services/audioService';
import toast from 'react-hot-toast';

interface PlayerContextType {
  currentSong: Song | null;
  isPlaying: boolean;
  volume: number;
  progress: number;
  duration: number;
  queue: Song[];
  isLoading: boolean;
  error: string | null;
  setCurrentSong: (song: Song) => void;
  togglePlay: () => Promise<void>;
  setVolume: (volume: number) => void;
  seekTo: (position: number) => void;
  setPlaylist: (songs: Song[]) => void;
  addToQueue: (song: Song) => void;
  removeFromQueue: (songId: string) => void;
  playNext: () => Promise<void>;
  playPrevious: () => Promise<void>;
  retry: () => Promise<void>;
}

const PlayerContext = createContext<PlayerContextType | null>(null);

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [queue, setQueueState] = useState<Song[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressInterval = useRef<number>();

  useEffect(() => {
    audioRef.current = new Audio();
    audioRef.current.volume = volume;

    const storedQueue = getQueue();
    if (storedQueue.length > 0) {
      setQueueState(storedQueue);
    }

    return () => {
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
        audioRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!audioRef.current || !currentSong?.audioData) return;

    const handleCanPlay = () => {
      setIsLoading(false);
      setError(null);
      setDuration(audioRef.current?.duration || 0);
      if (isPlaying) {
        audioRef.current?.play().catch(handlePlayError);
      }
    };

    const handleError = () => {
      setIsLoading(false);
      setIsPlaying(false);
      setError('Error loading audio file');
      toast.error('Failed to load audio');
    };

    const handleEnded = () => {
      playNext();
    };

    setIsLoading(true);
    setError(null);
    
    try {
      audioRef.current.src = currentSong.audioData;
      audioRef.current.load();
      
      audioRef.current.addEventListener('canplay', handleCanPlay);
      audioRef.current.addEventListener('error', handleError);
      audioRef.current.addEventListener('ended', handleEnded);

      return () => {
        if (audioRef.current) {
          audioRef.current.removeEventListener('canplay', handleCanPlay);
          audioRef.current.removeEventListener('error', handleError);
          audioRef.current.removeEventListener('ended', handleEnded);
        }
      };
    } catch (error) {
      handleError();
    }
  }, [currentSong]);

  useEffect(() => {
    if (progressInterval.current) {
      clearInterval(progressInterval.current);
    }

    if (isPlaying) {
      progressInterval.current = setInterval(() => {
        setProgress(audioRef.current?.currentTime || 0);
      }, 1000) as unknown as number;
    }

    return () => {
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    };
  }, [isPlaying]);

  const handlePlayError = (error: any) => {
    console.error('Playback error:', error);
    setIsPlaying(false);
    setError('Error playing audio');
    toast.error('Failed to play audio');
  };

  const togglePlay = async () => {
    if (!audioRef.current || !currentSong || isLoading) return;
    
    try {
      if (isPlaying) {
        await audioRef.current.pause();
      } else {
        await audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
      setError(null);
    } catch (error) {
      handlePlayError(error);
    }
  };

  const seekTo = (position: number) => {
    if (!audioRef.current || isLoading) return;
    
    try {
      audioRef.current.currentTime = position;
      setProgress(position);
      setError(null);
    } catch (error) {
      console.error('Error seeking:', error);
      setError('Error seeking in track');
      toast.error('Failed to seek');
    }
  };

  const handleSetVolume = (newVolume: number) => {
    if (!audioRef.current) return;
    
    try {
      audioRef.current.volume = newVolume;
      setVolume(newVolume);
      setError(null);
    } catch (error) {
      console.error('Error setting volume:', error);
      setError('Error adjusting volume');
      toast.error('Failed to adjust volume');
    }
  };

  const setPlaylist = (songs: Song[]) => {
    setQueueState(songs);
    setQueue(songs.map(s => s.id));
  };

  const addToQueue = (song: Song) => {
    setQueueState(prev => {
      const newQueue = [...prev, song];
      setQueue(newQueue.map(s => s.id));
      toast.success('Added to queue');
      return newQueue;
    });
  };

  const removeFromQueue = (songId: string) => {
    setQueueState(prev => {
      const newQueue = prev.filter(s => s.id !== songId);
      setQueue(newQueue.map(s => s.id));
      toast.success('Removed from queue');
      return newQueue;
    });
  };

  const playNext = async () => {
    if (queue.length === 0 || isLoading) return;
    
    try {
      const currentIndex = queue.findIndex(s => s.id === currentSong?.id);
      const nextIndex = currentIndex + 1;
      
      if (nextIndex < queue.length) {
        setCurrentSong(queue[nextIndex]);
        setIsPlaying(true);
        setError(null);
      } else {
        setIsPlaying(false);
      }
    } catch (error) {
      console.error('Error playing next:', error);
      setError('Error playing next track');
      toast.error('Failed to play next track');
    }
  };

  const playPrevious = async () => {
    if (queue.length === 0 || isLoading) return;
    
    try {
      const currentIndex = queue.findIndex(s => s.id === currentSong?.id);
      const prevIndex = currentIndex - 1;
      
      if (prevIndex >= 0) {
        setCurrentSong(queue[prevIndex]);
        setIsPlaying(true);
        setError(null);
      }
    } catch (error) {
      console.error('Error playing previous:', error);
      setError('Error playing previous track');
      toast.error('Failed to play previous track');
    }
  };

  const retry = async () => {
    setError(null);
    if (currentSong) {
      setCurrentSong({ ...currentSong });
    }
  };

  return (
    <PlayerContext.Provider value={{
      currentSong,
      isPlaying,
      volume,
      progress,
      duration,
      queue,
      isLoading,
      error,
      setCurrentSong,
      togglePlay,
      setVolume: handleSetVolume,
      seekTo,
      setPlaylist,
      addToQueue,
      removeFromQueue,
      playNext,
      playPrevious,
      retry,
    }}>
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
}