import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import './index.css';
import Sidebar from './components/Sidebar';
import Player from './components/Player';
import MainContent from './components/MainContent';
import Search from './pages/Search';
import Library from './pages/Library';
import RecentlyPlayed from './pages/RecentlyPlayed';
import LikedSongs from './pages/LikedSongs';
import CreatePlaylist from './pages/CreatePlaylist';
import PlaylistView from './pages/PlaylistView';
import StorageManagement from './pages/StorageManagement';
import { PlayerProvider } from './context/PlayerContext';
import ErrorBoundary from './components/ErrorBoundary';
import { getPlaylists, createPlaylist } from './services/audioService';  // Assuming you have utils for this

function App() {
  const playlists = getPlaylists(); // Assuming getPlaylists() returns the current playlists from localStorage

  // Function to handle playlist creation
  const handleCreatePlaylist = (name: string, description: string) => {
    createPlaylist(name, description);
  };

  return (
    <ErrorBoundary>
      <Router>
        <PlayerProvider>
          <div className="h-screen bg-black flex flex-col">
            <div className="flex flex-1 overflow-hidden">
              <Sidebar playlists={playlists} /> {/* Pass playlists to Sidebar */}
              <main className="flex-1 overflow-auto">
                <Routes>
                  <Route path="/" element={<MainContent />} />
                  <Route path="/search" element={<Search />} />
                  <Route path="/library" element={<Library playlists={playlists} />} /> {/* Pass playlists to Library */}
                  <Route path="/recently-played" element={<RecentlyPlayed />} />
                  <Route path="/liked-songs" element={<LikedSongs />} />
                  <Route 
                    path="/create-playlist" 
                    element={<CreatePlaylist onCreate={handleCreatePlaylist} />} /> {/* Pass onCreate to CreatePlaylist */}
                  <Route path="/playlist/:id" element={<PlaylistView />} />
                  <Route path="/storage" element={<StorageManagement />} />
                </Routes>
              </main>
            </div>
            <Player />
            <Toaster 
              position="bottom-center"
              toastOptions={{
                duration: 3000,
                style: {
                  background: '#333',
                  color: '#fff',
                },
              }} 
            />
          </div>
        </PlayerProvider>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
