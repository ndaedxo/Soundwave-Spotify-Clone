import { Play, Pause, SkipBack, SkipForward, Volume2, Repeat, Shuffle } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';

export default function Player() {
  const {
    currentSong,
    isPlaying,
    volume,
    progress,
    duration,
    togglePlay,
    setVolume,
    seekTo,
    playNext,
    playPrevious,
    toggleShuffle,
    toggleRepeat,
    isShuffleOn,
    isRepeatOn
  } = usePlayer();

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (!currentSong) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#181818] border-t border-[#333] p-4 flex items-center justify-between">
      <div className="flex items-center">
      <img src={currentSong.coverUrl} alt={currentSong.title} className="w-12 h-12 object-cover mr-4" />

        <div>
          <div className="text-white">{currentSong.title}</div>
          <div className="text-gray-400 text-sm">{currentSong.artist}</div>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <button onClick={toggleShuffle} className={`${isShuffleOn ? 'text-green-500' : 'text-white'}`}>
          <Shuffle />
        </button>

        <button onClick={playPrevious} className="text-white">
          <SkipBack />
        </button>

        <button onClick={togglePlay} className="text-white">
          {isPlaying ? <Pause /> : <Play />}
        </button>

        <button onClick={playNext} className="text-white">
          <SkipForward />
        </button>

        <button onClick={toggleRepeat} className={`${isRepeatOn ? 'text-green-500' : 'text-white'}`}>
          <Repeat />
        </button>
      </div>

      <div className="flex items-center">
        <input
          type="range"
          value={progress}
          max={duration}
          step="1"
          onChange={(e) => seekTo(Number(e.target.value))}
          className="w-24"
        />
        <div className="text-white text-sm">
          {formatTime(progress)} / {formatTime(duration)}
        </div>
      </div>

      <div className="flex items-center">
        <button onClick={() => setVolume(Math.max(0, volume - 0.1))} className="text-white">
          <Volume2 />
        </button>
        <input
          type="range"
          value={volume}
          max={1}
          step="0.01"
          onChange={(e) => setVolume(Number(e.target.value))}
          className="w-24"
        />
      </div>
    </div>
  );
}
