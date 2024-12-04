import { Heart, Play } from 'lucide-react';
import { recentlyPlayed } from '../mockData';
import SongList from '../components/SongList';
import { usePlayer } from '../context/PlayerContext';

export default function LikedSongs() {
  const { setCurrentSong, setPlaylist } = usePlayer();

  const handlePlayAll = () => {
    if (recentlyPlayed.length > 0) {
      setPlaylist(recentlyPlayed);
      setCurrentSong(recentlyPlayed[0]);
    }
  };

  return (
    <div>
      <div className="bg-gradient-to-b from-purple-800 to-[#121212] p-6">
        <div className="flex items-end gap-6 mb-6">
          <div className="w-52 h-52 bg-gradient-to-br from-purple-700 to-purple-900 shadow-lg flex items-center justify-center">
            <Heart size={64} fill="white" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold uppercase">Playlist</p>
            <h1 className="text-8xl font-bold mb-6">Liked Songs</h1>
            <div className="flex items-center gap-4">
              <p className="text-sm text-gray-300">
                <span className="font-bold text-white">Username</span> • {recentlyPlayed.length} songs
              </p>
              <button
                onClick={handlePlayAll}
                className="bg-green-500 rounded-full p-4 hover:scale-105 transition"
              >
                <Play fill="black" size={24} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        <SongList songs={recentlyPlayed} />
      </div>
    </div>
  );
}