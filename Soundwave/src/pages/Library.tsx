import { mockPlaylists } from '../mockData';
import SongList from '../components/SongList';

export default function Library() {
  const allSongs = mockPlaylists.flatMap(playlist => playlist.songs);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Your Library</h1>
      
      <div className="bg-[#181818] rounded-lg p-6">
        <SongList songs={allSongs} />
      </div>
    </div>
  );
}