import { Clock, Play, Heart } from 'lucide-react';
import { Song } from '../types';
import { usePlayer } from '../context/PlayerContext';

interface SongListProps {
  songs: Song[];
  showHeader?: boolean;
}

export default function SongList({ songs, showHeader = true }: SongListProps) {
  const { currentSong, isPlaying, setCurrentSong, togglePlay, setPlaylist } = usePlayer();

  const handlePlay = (song: Song, index: number) => {
    if (currentSong?.id === song.id) {
      togglePlay();
    } else {
      setPlaylist(songs);
      setCurrentSong(song);
    }
  };

  return (
    <table className="w-full">
      {showHeader && (
        <thead>
          <tr className="text-gray-400 text-sm border-b border-gray-700">
            <th className="text-left pb-3 w-8">#</th>
            <th className="text-left pb-3">Title</th>
            <th className="text-left pb-3">Album</th>
            <th className="text-left pb-3">Date added</th>
            <th className="text-right pb-3"><Clock size={16} /></th>
          </tr>
        </thead>
      )}
      <tbody>
        {songs.map((song, index) => (
          <tr 
            key={song.id} 
            className={`hover:bg-white/10 group ${
              currentSong?.id === song.id ? 'text-green-500' : ''
            }`}
          >
            <td className="py-3">
              <button 
                className="w-6 h-6 flex items-center justify-center"
                onClick={() => handlePlay(song, index)}
              >
                {currentSong?.id === song.id && isPlaying ? (
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                ) : (
                  <>
                    <span className="group-hover:hidden">{index + 1}</span>
                    <Play size={16} className="hidden group-hover:block" />
                  </>
                )}
              </button>
            </td>
            <td className="py-3">
              <div className="flex items-center gap-3">
                <img src={song.coverUrl} alt={song.title} className="w-10 h-10 rounded" />
                <div>
                  <p className="font-medium">{song.title}</p>
                  <p className="text-sm text-gray-400">{song.artist}</p>
                </div>
              </div>
            </td>
            <td className="py-3 text-gray-400">{song.album}</td>
            <td className="py-3 text-gray-400">{song.uploadDate || '2 days ago'}</td>
            <td className="py-3 text-gray-400 text-right">
              <div className="flex items-center justify-end gap-4">
                <button className="opacity-0 group-hover:opacity-100">
                  <Heart size={16} className={song.liked ? 'fill-green-500 text-green-500' : ''} />
                </button>
                <span>{song.duration}</span>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}