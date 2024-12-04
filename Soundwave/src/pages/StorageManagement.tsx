import { useState, useEffect } from 'react';
import { Trash2, HardDrive,  Music2 } from 'lucide-react';
import { getAllSongs, deleteSong, getStorageInfo } from '../services/audioService';
import { Song } from '../types';
import toast from 'react-hot-toast';

export default function StorageManagement() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [storageInfo, setStorageInfo] = useState<{
    used: number;
    total: number;
    percentage: number;
  }>({ used: 0, total: 0, percentage: 0 });
  const [selectedSongs, setSelectedSongs] = useState<Set<string>>(new Set());
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const loadedSongs = await getAllSongs();
    setSongs(loadedSongs);
    const info = await getStorageInfo();
    setStorageInfo({
      used: info.used ?? 0,
      total: info.total ?? 0,
      percentage: info.percentage ?? 0,
    });
  };
  

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleToggleSelect = (songId: string) => {
    const newSelected = new Set(selectedSongs);
    if (newSelected.has(songId)) {
      newSelected.delete(songId);
    } else {
      newSelected.add(songId);
    }
    setSelectedSongs(newSelected);
  };

  // const handleSelectAll = () => {
  //   if (selectedSongs.size === songs.length) {
  //     setSelectedSongs(new Set());
  //   } else {
  //     setSelectedSongs(new Set(songs.map(song => song.id)));
  //   }
  // };

  const handleDelete = async () => {
    if (selectedSongs.size === 0) return;

    const confirmMessage = selectedSongs.size === 1
      ? 'Are you sure you want to delete this song?'
      : `Are you sure you want to delete ${selectedSongs.size} songs?`;

    const result = window.confirm(confirmMessage); // Consider replacing with a modal

    if (!result) return;

    setIsDeleting(true);
    try {
      await Promise.all(Array.from(selectedSongs).map(id => deleteSong(id)));
      toast.success(`Successfully deleted ${selectedSongs.size} song(s)`);
      setSelectedSongs(new Set());
      loadData();
    } catch (error) {
      toast.error('Failed to delete some songs');
    } finally {
      setIsDeleting(false);
    }
  };

  const getStorageColor = (percentage: number) => {
    if (percentage >= 90) return 'bg-red-500';
    if (percentage >= 70) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Storage Management</h1>
        {selectedSongs.size > 0 && (
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 disabled:opacity-50"
          >
            <Trash2 size={20} />
            Delete {selectedSongs.size} selected
          </button>
        )}
      </div>

      <div className="bg-[#181818] rounded-lg p-6 mb-6">
        <div className="flex items-center gap-4 mb-4">
          <HardDrive size={24} className="text-gray-400" />
          <div className="flex-1">
            <div className="flex justify-between mb-2">
              <span className="text-sm text-gray-400">Storage Usage</span>
              <span className="text-sm font-medium">
                {formatSize(storageInfo.used)} / {formatSize(storageInfo.total)}
              </span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${getStorageColor(storageInfo.percentage)}`}
                style={{ width: `${storageInfo.percentage}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <div>
        {songs.length > 0 ? (
          <div className="space-y-4">
            {songs.map((song) => (
              <div
                key={song.id}
                className="flex justify-between items-center bg-[#242424] rounded-lg p-4"
              >
                <div className="flex items-center gap-4">
                  <input
                    type="checkbox"
                    checked={selectedSongs.has(song.id)}
                    onChange={() => handleToggleSelect(song.id)}
                    className="h-4 w-4"
                  />
                  <Music2 size={24} className="text-gray-400" />
                  <span className="text-white">{song.title}</span>
                </div>
                <button
                  onClick={() => deleteSong(song.id)}
                  className="text-red-500 hover:text-red-400"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-400">No songs found</div>
        )}
      </div>
    </div>
  );
}
