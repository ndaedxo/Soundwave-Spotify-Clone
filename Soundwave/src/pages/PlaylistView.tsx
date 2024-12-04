import { useParams } from 'react-router-dom';
import { Play, Clock } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';
import { getPlaylists } from '../services/audioService';
import { getAllSongs } from '../services/audioService';
import SongList from '../components/SongList';
import type { Song } from '../types';

export default function PlaylistView() {
  const { id } = useParams<{ id: string }>();
  const { setCurrentSong, setPlaylist } = usePlayer();

  const playlist = getPlaylists().find(p => p.id === id);
  const allSongs = getAllSongs();
  const playlistSongs = playlist?.songs.map(songId => 
    allSongs.find(s => s.id === songId)
  ).filter((song): song is Song => song !== undefined) || [];

  if (!playlist) {
    return (
      <div className="p-6">
        <p className="text-gray-400">Playlist not found</p>
      </div>
    );
  }

  const handlePlayAll = () => {
    if (playlistSongs.length > 0) {
      setPlaylist(playlistSongs);
      setCurrentSong(playlistSongs[0]);
    }
  };

  return (
    <div>
      <div className="bg-gradient-to-b from-blue-800 to-[#121212] p-6">
        <div className="flex items-end gap-6 mb-6">
          <img 
            src={playlist.coverUrl} 
            alt={playlist.name}
            className="w-52 h-52 shadow-lg object-cover"
          />
          <div className="flex-1">
            <p className="text-sm font-bold uppercase">Playlist</p>
            <h1 className="text-4xl font-bold mb-6">{playlist.name}</h1>
            <p className="text-gray-300 mb-4">{playlist.description}</p>
            <div className="flex items-center gap-4">
              <p className="text-sm text-gray-300">
                {playlistSongs.length} songs
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
        <SongList songs={playlistSongs} />
      </div>
    </div>
  );
}