import { recentlyPlayed } from '../mockData';
import { Play } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';

export default function RecentlyPlayed() {
  const { setCurrentSong, currentSong, isPlaying, togglePlay, setPlaylist } = usePlayer();

  const handlePlaySong = (song: typeof recentlyPlayed[0]) => {
    if (currentSong?.id === song.id) {
      togglePlay();
    } else {
      setPlaylist(recentlyPlayed);
      setCurrentSong(song);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Recently Played</h1>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {recentlyPlayed.map((song) => (
          <div
            key={song.id}
            className="bg-[#181818] p-4 rounded-md hover:bg-[#282828] transition group cursor-pointer"
          >
            <div className="relative">
              <img
                src={song.coverUrl}
                alt={song.title}
                className="w-full aspect-square object-cover rounded-md mb-4"
              />
              <button 
                className="absolute bottom-2 right-2 bg-green-500 rounded-full p-3 shadow-lg opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition"
                onClick={() => handlePlaySong(song)}
              >
                <Play fill="black" size={20} />
              </button>
            </div>
            <h3 className={`font-semibold mb-1 ${currentSong?.id === song.id ? 'text-green-500' : 'text-white'}`}>
              {song.title}
            </h3>
            <p className="text-gray-400 text-sm">{song.artist}</p>
          </div>
        ))}
      </div>
    </div>
  );
}