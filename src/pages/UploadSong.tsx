import { useDropzone } from 'react-dropzone';
import { uploadAudio, addSongsToPlaylist } from '../services/audioService';
import toast from 'react-hot-toast';
import pako from 'pako';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function UploadSong({ playlistId }: { playlistId: string }) {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState<number>(0); // To track upload progress
  const navigate = useNavigate();

  const onDrop = async (acceptedFiles: File[]) => {
    setIsUploading(true);
    const uploadedSongs = [];

    try {
      const invalidFiles = acceptedFiles.filter(file => !['audio/mp3', 'audio/wav'].includes(file.type));

      if (invalidFiles.length > 0) {
        toast.error('Please upload MP3 or WAV files only');
        return;
      }

      // Upload each song
      for (const file of acceptedFiles) {
        const compressedFile = await compressAudio(file);

        // Assuming uploadAudio doesn't accept progress as a parameter
        const result = await uploadAudio(compressedFile);
        
        // Manually track progress here if needed
        // Example of progress tracking: you could update progress based on certain events
        // For example, simulate progress update:
        setProgress(50); // Here, you can calculate progress based on your upload logic

        if (result) {
          uploadedSongs.push(result);
          toast.success(`Uploaded ${file.name}`);
        }
      }

      if (uploadedSongs.length > 0) {
        await addSongsToPlaylist(playlistId, uploadedSongs);
        toast.success('Songs added to the playlist!');
        navigate(`/playlist/${playlistId}`);
      }
    } catch (error) {
      toast.error('Failed to process files');
    } finally {
      setIsUploading(false);
    }
  };

  const compressAudio = async (file: File) => {
    const arrayBuffer = await file.arrayBuffer();
    const compressed = pako.deflate(arrayBuffer);
    const compressedFile = new File([compressed], file.name, { type: 'application/octet-stream', lastModified: file.lastModified });
    return compressedFile;
  };

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    accept: { 'audio/mp3': ['.mp3'], 'audio/wav': ['.wav'] },
    onDrop,
    noClick: true,
  });

  return (
    <div className="bg-[#181818] rounded-lg p-6 mb-6 space-y-4">
      <div {...getRootProps()} className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition">
        <input {...getInputProps()} />
        <p className="font-medium">{isDragActive ? 'Drop files here...' : 'Drag and drop audio files here'}</p>
      </div>
      <button onClick={open} disabled={isUploading} className="py-3 rounded-full bg-white text-black font-bold">
        Upload Songs
      </button>

      {isUploading && (
        <div className="mt-4">
          <p>Uploading... {progress}%</p>
          <div className="h-2 bg-gray-600 rounded-full overflow-hidden">
            <div style={{ width: `${progress}%` }} className="h-full bg-green-500"></div>
          </div>
        </div>
      )}
    </div>
  );
}
