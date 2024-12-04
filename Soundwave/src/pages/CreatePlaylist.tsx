import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Music, Upload } from 'lucide-react';
import { uploadAudio, createPlaylist } from '../services/audioService';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function CreatePlaylist() {
  const [playlistName, setPlaylistName] = useState('');
  const [playlistDescription, setPlaylistDescription] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const navigate = useNavigate();

  const onDrop = async (acceptedFiles: File[]) => {
    if (!playlistName) {
      toast.error('Please enter a playlist name first');
      return;
    }

    setIsUploading(true);
    const uploadedSongs = [];

    try {
      for (const file of acceptedFiles) {
        const result = await uploadAudio(file);
        if (result) {
          uploadedSongs.push(result);
          toast.success(`Uploaded ${file.name}`);
        }
      }

      // Create playlist if name is provided
      if (playlistName && uploadedSongs.length > 0) {
        const playlist = createPlaylist(playlistName, playlistDescription);
        toast.success('Playlist created successfully!');
        navigate(`/playlist/${playlist.id}`);
      }
    } catch (error) {
      toast.error('Failed to process files');
    } finally {
      setIsUploading(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    accept: {
      'audio/*': ['.mp3', '.wav']
    },
    onDrop,
    noClick: true // Disable click on the dropzone area
  });

  const handleCreatePlaylist = () => {
    if (!playlistName) {
      toast.error('Please enter a playlist name');
      return;
    }

    const playlist = createPlaylist(playlistName, playlistDescription);
    toast.success('Playlist created successfully!');
    navigate(`/playlist/${playlist.id}`);
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Create New a Playlist</h1>
      
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

        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition
            ${isDragActive ? 'border-white bg-white/10' : 'border-gray-600 hover:border-white hover:bg-white/5'}`}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center gap-4">
            {isUploading ? (
              <Upload className="animate-bounce" size={48} />
            ) : (
              <Music size={48} />
            )}
            <div>
              <p className="font-medium">
                {isDragActive
                  ? 'Drop the files here...'
                  : 'Drag and drop audio files here'}
              </p>
              <p className="text-sm text-gray-400 mt-1">Supported formats: MP3, WAV</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        <button
          onClick={handleCreatePlaylist}
          disabled={!playlistName}
          className="flex-1 py-3 rounded-full bg-green-500 text-black font-bold hover:scale-105 transition disabled:opacity-50 disabled:hover:scale-100"
        >
          Create Empty Playlist
        </button>
        <button
          onClick={open}
          disabled={!playlistName}
          className="flex-1 py-3 rounded-full bg-white text-black font-bold hover:scale-105 transition disabled:opacity-50 disabled:hover:scale-100"
        >
          Upload Songs
        </button>
      </div>
    </div>
  );
}