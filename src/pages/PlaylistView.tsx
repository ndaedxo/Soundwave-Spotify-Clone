import { useParams } from 'react-router-dom';
import { getPlaylists, getAllSongs, uploadAudio, addSongsToPlaylist } from '../services/audioService';
import { Song } from '../types';
import SongList from '../components/SongList';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify'; // Import toast for notifications

export default function PlaylistView() {
  const { id } = useParams<{ id: string }>();

  // Ensure `id` is not undefined
  if (!id) {
    return (
      <div className="p-6">
        <p className="text-gray-400">Playlist not found</p>
      </div>
    );
  }

  const playlist = getPlaylists().find((p) => p.id === id);
  const allSongs = getAllSongs();
  const [openOptions, setOpenOptions] = useState<{ [key: string]: boolean }>({});
  const [isUploading, setIsUploading] = useState(false); // For tracking the upload state
  const navigate = useNavigate();

  const toggleSongOptions = (songId: string) => {
    setOpenOptions((prev) => ({
      ...prev,
      [songId]: !prev[songId],
    }));
  };

  const handleDeleteSong = (songId: string) => {
    console.log(`Deleting song with ID: ${songId}`);
  };

  const handlePlaySong = (song: Song) => {
    console.log(`Playing song: ${song.title}`);
  };

  const handleDownloadSong = (song: Song) => {
    console.log(`Downloading song: ${song.title}`);
  };

  const handleUploadSong = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;
    setIsUploading(true);
  
    const file = event.target.files[0]; // Assuming a single file upload
    try {
      const uploadedSong = await uploadAudio(file); // Upload the song (assuming `uploadAudio` handles the upload)
      if (uploadedSong) {
        // Ensure that `uploadedSong` is of type `Song`
        if ('id' in uploadedSong && 'title' in uploadedSong) {
          // Add the uploaded song to the playlist (make sure it's a Song object)
          await addSongsToPlaylist(id, [uploadedSong]); // Wrap in an array
  
          // If playlist.songs is an array of IDs, you need to update it by adding the ID of the uploaded song
          if (Array.isArray(playlist?.songs)) {
            playlist?.songs.push(uploadedSong); // Push the song ID, not the song object
          } else {
            // If `songs` isn't an array, initialize it as one with the uploaded song
            playlist!.songs = [uploadedSong];
          }
  
          toast.success(`Uploaded ${file.name} and added to playlist!`);
          navigate(`/playlist/${id}`);
        } else {
          toast.error('Uploaded song is not in the correct format');
        }
      }
    } catch (error) {
      toast.error('Failed to upload the song');
    } finally {
      setIsUploading(false);
    }
  };
  
  
  

  if (!playlist) {
    return (
      <div className="p-6">
        <p className="text-gray-400">Playlist not found</p>
      </div>
    );
  }

  // Correctly map and filter songs
  const playlistSongs = playlist.songs
    .map((songId) => allSongs.find((song) => song === songId))
    .filter((song): song is Song => song !== undefined);

  return (
    <div>
      <div className="p-6 bg-gradient-to-b from-blue-800 to-[#121212]">
        <h1 className="text-4xl font-bold">{playlist.name}</h1>
        <p className="text-gray-300">{playlist.description}</p>
      </div>

      <div className="p-6">
        {/* Upload Song Button */}
        <div className="mb-4">
          <input
            type="file"
            accept="audio/mp3,audio/wav"
            onChange={handleUploadSong}
            disabled={isUploading}
            className="bg-blue-500 text-white py-2 px-4 rounded"
          />
          {isUploading && <p>Uploading...</p>}
        </div>

        <SongList songs={playlistSongs} />

        {/* Song options */}
        <div className="relative mt-4">
          {playlistSongs.map((song) => (
            <div key={song.id} className="mb-4 flex justify-between items-center">
              <span>{song.title}</span>
              <button
                onClick={() => toggleSongOptions(song.id)}
                className="text-gray-400 hover:text-white"
              >
                &#8226;&#8226;&#8226;
              </button>

              {openOptions[song.id] && (
                <div className="absolute top-0 right-0 mt-2 bg-black text-white rounded-lg p-2">
                  <button onClick={() => handlePlaySong(song)} className="block w-full text-left p-2">Play</button>
                  <button onClick={() => handleDeleteSong(song.id)} className="block w-full text-left p-2 text-red-500">Delete</button>
                  <button onClick={() => handleDownloadSong(song)} className="block w-full text-left p-2">Download</button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
