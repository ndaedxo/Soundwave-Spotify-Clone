import { Home, Search, Library, Plus, Heart, HardDrive } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import type { Playlist } from '../types';

// Sidebar.tsx
interface SidebarProps {
  playlists: Playlist[]; // This is the prop that you need to use
}

export default function Sidebar({ playlists }: SidebarProps) {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="bg-black w-64 p-6 flex flex-col gap-6">
      <div className="space-y-4">
        <Link 
          to="/"
          className={`flex items-center gap-4 text-sm font-semibold ${
            isActive('/') ? 'text-white' : 'text-gray-400 hover:text-white'
          }`}
        >
          <Home size={24} />
          Home
        </Link>
        <Link 
          to="/search"
          className={`flex items-center gap-4 text-sm font-semibold ${
            isActive('/search') ? 'text-white' : 'text-gray-400 hover:text-white'
          }`}
        >
          <Search size={24} />
          Search
        </Link>
        <Link 
          to="/storage"
          className={`flex items-center gap-4 text-sm font-semibold ${
            isActive('/storage') ? 'text-white' : 'text-gray-400 hover:text-white'
          }`}
        >
          <HardDrive size={24} />
          Storage
        </Link>
      </div>

      <div className="bg-[#121212] rounded-lg p-4 flex-1">
        <div className="flex items-center justify-between mb-4">
          <Link 
            to="/library"
            className={`flex items-center gap-2 text-sm font-semibold ${
              isActive('/library') ? 'text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            <Library size={24} />
            Your Library
          </Link>
          <Link 
            to="/create-playlist"
            className="text-gray-400 hover:text-white"
          >
            <Plus size={20} />
          </Link>
        </div>

        <div className="space-y-2">
          <Link
            to="/liked-songs"
            className={`block text-white p-4 rounded-lg ${
              isActive('/liked-songs') ? 'bg-[#2a2a2a]' : 'bg-[#242424] hover:bg-[#2a2a2a]'
            } transition cursor-pointer`}
          >
            <h3 className="font-bold">Liked Songs</h3>
            <p className="text-sm text-gray-400 flex items-center gap-2">
              <Heart size={12} fill="white" /> Playlist • 12 songs
            </p>
          </Link>

          {/* Use playlists prop here instead of mockPlaylists */}
          {playlists.map(playlist => (
            <Link
              key={playlist.id}
              to={`/playlist/${playlist.id}`}
              className={`block p-2 rounded ${isActive(`/playlist/${playlist.id}`) ? 'bg-[#2a2a2a]' : 'hover:bg-[#1a1a1a]'}`}
            >
              <p className="text-sm text-gray-400 font-medium">{playlist.name}</p>
              <p className="text-xs text-gray-500">Playlist</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
