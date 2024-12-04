import { Playlist } from '../types';
import SongList from '../components/SongList';
import { useState } from 'react';
import { toast } from 'react-toastify'; // Assuming you're using react-toastify for notifications
import { usePlayer } from '../context/PlayerContext';  // Import the usePlayer hook

interface LibraryProps {
  playlists: Playlist[];
}

export default function Library({ playlists }: LibraryProps) {
  const [openDropdown, setOpenDropdown] = useState<{ [key: string]: boolean }>({});
  const { playSong } = usePlayer();  // Access playSong from context
  

  const toggleDropdown = (playlistId: string) => {
    setOpenDropdown(prev => ({
      ...prev,
      [playlistId]: !prev[playlistId],
    }));
  };

  const handleDeletePlaylist = (playlistId: string) => {
    // Implement logic for deleting playlist (e.g., calling an API or updating state)
    console.log(`Deleting playlist with ID: ${playlistId}`);
    toast.success('Playlist deleted successfully');
  };

  const handlePlayPlaylist = (playlistId: string) => {
    const playlist = playlists.find(p => p.id === playlistId);
    if (playlist && playlist.songs.length > 0) {
      const songToPlay = playlist.songs[0]; // Get the first song
      playSong(songToPlay); // You need to implement playSong function in your context
    }
  };

  const handleSharePlaylist = (playlistId: string) => {
    const playlist = playlists.find(p => p.id === playlistId);
    if (playlist) {
      const shareData = {
        title: playlist.name,
        text: playlist.description,
        url: window.location.href,
      };
      if (navigator.share) {
        navigator.share(shareData)
          .then(() => toast.success('Playlist shared successfully'))
          .catch(() => toast.error('Failed to share playlist'));
      } else {
        toast.warning('Sharing not supported on this device');
      }
    }
  };

  const handleDownloadPlaylist = (playlistId: string) => {
    const playlist = playlists.find(p => p.id === playlistId);
    if (playlist) {
      // Logic to download the playlist (e.g., bundle songs into a zip or download each individually)
      toast.success('Playlist download initiated');
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Your Library</h1>
      <div className="bg-[#181818] rounded-lg p-6">
        <SongList songs={playlists.flatMap(playlist => playlist.songs)} />

        {playlists.map((playlist) => (
          <div key={playlist.id} className="mb-4 relative">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-white">{playlist.name}</h3>
                <p className="text-gray-400">{playlist.description}</p>
              </div>

              {/* Dropdown for options */}
              <button
                onClick={() => toggleDropdown(playlist.id)}
                className="text-gray-400 hover:text-white"
              >
                &#8226;&#8226;&#8226; {/* More options icon */}
              </button>

              {openDropdown[playlist.id] && (
                <div className="absolute top-0 right-0 mt-2 bg-black text-white rounded-lg p-2">
                  <button onClick={() => handlePlayPlaylist(playlist.id)} className="block w-full text-left p-2">Play</button>
                  <button onClick={() => handleDeletePlaylist(playlist.id)} className="block w-full text-left p-2 text-red-500">Delete</button>
                  <button onClick={() => handleSharePlaylist(playlist.id)} className="block w-full text-left p-2">Share</button>
                  <button onClick={() => handleDownloadPlaylist(playlist.id)} className="block w-full text-left p-2">Download</button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
