import { useState, useEffect } from 'react';
import { Trash2, HardDrive, AlertCircle, Music2 } from 'lucide-react';
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
    const loadedSongs = getAllSongs();
    setSongs(loadedSongs);
    const info = await getStorageInfo();
    setStorageInfo(info);
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

  const handleSelectAll = () => {
    if (selectedSongs.size === songs.length) {
      setSelectedSongs(new Set());
    } else {
      setSelectedSongs(new Set(songs.map(song => song.id)));
    }
  };

  const handleDelete = async () => {
    if (selectedSongs.size === 0) return;
    
    const confirmMessage = selectedSongs.size === 1 
      ? 'Are you sure you want to delete this song?'
      : `Are you sure you want to delete ${selectedSongs.size} songs?`;
    
    if (!window.confirm(confirmMessage)) return;

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
            <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
              <div
                className={`h-full ${getStorageColor(storageInfo.percentage)} transition-all`}
                style={{ width: `${storageInfo.percentage}%` }}
              />
            </div>
          </div>
        </div>

        {storageInfo.percentage >= 90 && (
          <div className="flex items-center gap-2 text-sm text-red-400 mt-2">
            <AlertCircle size={16} />
            <span>Storage is almost full. Consider deleting some songs.</span>
          </div>
        )}
      </div>

      <div className="bg-[#181818] rounded-lg overflow-hidden">
        <div className="p-4 border-b border-gray-800">
          <div className="flex items-center gap-4">
            <input
              type="checkbox"
              checked={selectedSongs.size === songs.length && songs.length > 0}
              onChange={handleSelectAll}
              className="w-4 h-4 rounded bg-gray-700 border-gray-600"
            />
            <span className="text-sm font-medium">
              {songs.length} song{songs.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>

        {songs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-gray-400">
            <Music2 size={48} className="mb-4" />
            <p>No songs uploaded yet</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-800">
            {songs.map(song => (
              <div
                key={song.id}
                className={`flex items-center gap-4 p-4 hover:bg-white/5 ${
                  selectedSongs.has(song.id) ? 'bg-white/10' : ''
                }`}
              >
                <input
                  type="checkbox"
                  checked={selectedSongs.has(song.id)}
                  onChange={() => handleToggleSelect(song.id)}
                  className="w-4 h-4 rounded bg-gray-700 border-gray-600"
                />
                <img
                  src={song.coverUrl}
                  alt={song.title}
                  className="w-12 h-12 rounded object-cover"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{song.title}</p>
                  <p className="text-sm text-gray-400 truncate">{song.artist}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-400">
                    {formatSize(song.audioData?.length ?? 0)}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(song.uploadDate || '').toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}