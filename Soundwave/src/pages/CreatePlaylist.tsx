import { useState } from 'react';
import toast from 'react-hot-toast';

interface CreatePlaylistProps {
  onCreate: (name: string, description: string) => void;
}

export default function CreatePlaylist({ onCreate }: CreatePlaylistProps) {
  const [playlistName, setPlaylistName] = useState('');
  const [playlistDescription, setPlaylistDescription] = useState('');

  const handleCreatePlaylist = () => {
    if (!playlistName) {
      toast.error('Please enter a playlist name');
      return;
    }

    onCreate(playlistName, playlistDescription); // Call onCreate from props to update playlists
    toast.success('Playlist created successfully!');
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Create New Playlist</h1>
      <div className="bg-[#181818] rounded-lg p-6 mb-6 space-y-4">
        <input
          type="text"
          placeholder="Playlist name"
          value={playlistName}
          onChange={(e) => setPlaylistName(e.target.value)}
          className="w-full p-3 rounded bg-[#242424] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white"
        />
        <textarea
          placeholder="Playlist description (optional)"
          value={playlistDescription}
          onChange={(e) => setPlaylistDescription(e.target.value)}
          className="w-full p-3 rounded bg-[#242424] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white resize-none h-24"
        />
        <button
          onClick={handleCreatePlaylist}
          disabled={!playlistName}
          className="w-full py-3 rounded-full bg-green-500 text-black font-bold hover:scale-105 transition disabled:opacity-50"
        >
          Create Playlist
        </button>
      </div>
    </div>
  );
}
