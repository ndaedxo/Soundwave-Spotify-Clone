import { useState, useEffect } from 'react';
import { Search as SearchIcon, Music, Disc, Mic2, SortAsc, SortDesc } from 'lucide-react';
import { searchSongs } from '../services/audioService';
import type { Song, SearchFilters } from '../types';
import SongList from '../components/SongList';

export default function Search() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Song[]>([]);
  const [filters, setFilters] = useState<SearchFilters>({
    type: 'all',
    sortBy: 'title',
    order: 'asc'
  });

  useEffect(() => {
    if (query) {
      const searchResults = searchSongs(query);
      let filteredResults = [...searchResults];

      // Apply filters
      if (filters.type !== 'all') {
        filteredResults = filteredResults.filter(song => {
          switch (filters.type) {
            case 'title':
              return song.title.toLowerCase().includes(query.toLowerCase());
            case 'artist':
              return song.artist.toLowerCase().includes(query.toLowerCase());
            case 'album':
              return song.album.toLowerCase().includes(query.toLowerCase());
            default:
              return true;
          }
        });
      }

      // Apply sorting
      filteredResults.sort((a, b) => {
        const factor = filters.order === 'asc' ? 1 : -1;
        switch (filters.sortBy) {
          case 'title':
            return factor * a.title.localeCompare(b.title);
          case 'artist':
            return factor * a.artist.localeCompare(b.artist);
          case 'uploadDate':
            return factor * (new Date(b.uploadDate || 0).getTime() - new Date(a.uploadDate || 0).getTime());
          default:
            return 0;
        }
      });

      setResults(filteredResults);
    } else {
      setResults([]);
    }
  }, [query, filters]);

  const filterButtons = [
    { type: 'all', icon: Music, label: 'All' },
    { type: 'title', icon: Music, label: 'Title' },
    { type: 'artist', icon: Mic2, label: 'Artist' },
    { type: 'album', icon: Disc, label: 'Album' },
  ];

  return (
    <div className="p-6">
      <div className="mb-6 space-y-4">
        <div className="relative max-w-[400px]">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="What do you want to listen to?"
            className="w-full py-3 pl-10 pr-4 rounded-full bg-[#242424] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white"
          />
        </div>

        <div className="flex flex-wrap gap-4">
          {filterButtons.map(({ type, icon: Icon, label }) => (
            <button
              key={type}
              onClick={() => setFilters(f => ({ ...f, type: type as SearchFilters['type'] }))}
              className={`px-4 py-2 rounded-full flex items-center gap-2 ${
                filters.type === type
                  ? 'bg-white text-black'
                  : 'bg-[#242424] text-white hover:bg-[#2a2a2a]'
              }`}
            >
              <Icon size={16} />
              {label}
            </button>
          ))}

          <button
            onClick={() => setFilters(f => ({ ...f, order: f.order === 'asc' ? 'desc' : 'asc' }))}
            className="px-4 py-2 rounded-full bg-[#242424] text-white hover:bg-[#2a2a2a] flex items-center gap-2"
          >
            {filters.order === 'asc' ? <SortAsc size={16} /> : <SortDesc size={16} />}
            {filters.order === 'asc' ? 'Ascending' : 'Descending'}
          </button>
        </div>
      </div>

      {query && (
        <div className="bg-[#181818] rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">Search Results</h2>
          {results.length > 0 ? (
            <SongList songs={results} />
          ) : (
            <p className="text-gray-400">No results found for "{query}"</p>
          )}
        </div>
      )}

      {!query && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Browse all</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {['Pop', 'Hip-Hop', 'Rock', 'Latin', 'Mood', 'Indie', 'Workout', 'Charts'].map((genre) => (
              <div
                key={genre}
                className="aspect-square relative overflow-hidden rounded-lg bg-gradient-to-br from-purple-700 to-blue-500 p-4 hover:scale-105 transition-transform cursor-pointer"
              >
                <h3 className="text-2xl font-bold">{genre}</h3>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}