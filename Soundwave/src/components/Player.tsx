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
    <div className="fixed bottom-0 left-0 right-0 bg-[#181818] border-t border-[#282828] px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 w-[30%]">
          <img 
            src={currentSong.coverUrl}
            alt={currentSong.title}
            className="h-14 w-14 rounded"
          />
          <div>
            <h4 className="text-sm text-white">{currentSong.title}</h4>
            <p className="text-xs text-gray-400">{currentSong.artist}</p>
          </div>
        </div>

        <div className="flex flex-col items-center gap-2 w-[40%]">
          <div className="flex items-center gap-6">
            <button 
              className={`text-gray-400 hover:text-white ${isShuffleOn ? 'text-green-500' : ''}`}
              onClick={toggleShuffle}
            >
              <Shuffle size={20} />
            </button>
            <button 
              className="text-gray-400 hover:text-white"
              onClick={playPrevious}
            >
              <SkipBack size={20} />
            </button>
            <button 
              className="bg-white rounded-full p-2 hover:scale-105 transition"
              onClick={togglePlay}
            >
              {isPlaying ? (
                <Pause size={20} fill="black" />
              ) : (
                <Play size={20} fill="black" />
              )}
            </button>
            <button 
              className="text-gray-400 hover:text-white"
              onClick={playNext}
            >
              <SkipForward size={20} />
            </button>
            <button 
              className={`text-gray-400 hover:text-white ${isRepeatOn ? 'text-green-500' : ''}`}
              onClick={toggleRepeat}
            >
              <Repeat size={20} />
            </button>
          </div>
          <div className="flex items-center gap-2 w-full">
            <span className="text-xs text-gray-400">{formatTime(progress)}</span>
            <div 
              className="h-1 flex-1 bg-[#4d4d4d] rounded-full cursor-pointer"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const percent = x / rect.width;
                seekTo(percent * duration);
              }}
            >
              <div 
                className="h-1 bg-white rounded-full"
                style={{ width: `${(progress / duration) * 100}%` }}
              />
            </div>
            <span className="text-xs text-gray-400">{formatTime(duration)}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 w-[30%] justify-end">
          <Volume2 size={20} className="text-gray-400" />
          <div 
            className="h-1 w-24 bg-[#4d4d4d] rounded-full cursor-pointer"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const x = e.clientX - rect.left;
              const percent = x / rect.width;
              setVolume(percent);
            }}
          >
            <div 
              className="h-1 bg-white rounded-full"
              style={{ width: `${volume * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}