import { mockPlaylists } from '../mockData';
import { ChevronLeft, ChevronRight, Play } from 'lucide-react';

export default function MainContent() {
  return (
    <div className="flex-1 bg-gradient-to-b from-[#1e1e1e] to-[#121212] overflow-auto">
      <header className="flex items-center justify-between p-6">
        <div className="flex gap-2">
          <button className="rounded-full bg-black/40 p-2">
            <ChevronLeft size={24} className="text-white" />
          </button>
          <button className="rounded-full bg-black/40 p-2">
            <ChevronRight size={24} className="text-white" />
          </button>
        </div>
        <button className="text-white bg-white/10 hover:bg-white/20 py-2 px-4 rounded-full text-sm font-semibold">
          Sign up
        </button>
      </header>

      <section className="p-6">
        <h2 className="text-2xl font-bold text-white mb-6">Good afternoon</h2>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {mockPlaylists.map(playlist => (
            <div 
              key={playlist.id}
              className="flex items-center bg-white/5 rounded-md hover:bg-white/10 transition group"
            >
              <img 
                src={playlist.coverUrl} 
                alt={playlist.name}
                className="h-20 w-20 rounded-l-md object-cover"
              />
              <h3 className="text-white font-semibold px-4">{playlist.name}</h3>
              <button className="ml-auto mr-4 bg-green-500 rounded-full p-3 shadow-lg opacity-0 group-hover:opacity-100 transition">
                <Play fill="black" size={20} />
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="p-6">
        <h2 className="text-2xl font-bold text-white mb-6">Made for you</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {mockPlaylists.map(playlist => (
            <div 
              key={playlist.id}
              className="bg-[#181818] p-4 rounded-md hover:bg-[#282828] transition group"
            >
              <div className="relative">
                <img 
                  src={playlist.coverUrl}
                  alt={playlist.name}
                  className="w-full aspect-square object-cover rounded-md mb-4"
                />
                <button className="absolute bottom-2 right-2 bg-green-500 rounded-full p-3 shadow-lg opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition">
                  <Play fill="black" size={20} />
                </button>
              </div>
              <h3 className="text-white font-semibold mb-2">{playlist.name}</h3>
              <p className="text-gray-400 text-sm line-clamp-2">{playlist.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}