# Soundwave: Spotify Clone

Welcome to **Soundwave**, a visually striking Spotify-inspired music application! This project replicates Spotify's modern interface using mock data and is focused on delivering an impressive user experience. While the core functionality revolves around basic playback and navigation, the main emphasis is on visual accuracy and usability.

---

## Features

### User Interface
- **Left Sidebar**: Navigation bar styled closely to Spotify, featuring links to Home, Search, Library, Liked Songs, and more.
- **Main Content Area**: Displays playlists, albums, and featured content with a responsive layout.
- **Bottom Player Bar**: Fully functional playback controls, volume adjustment, and progress tracking.
- **Dark Theme**: Aesthetic that mirrors Spotify’s sleek and modern design.

### Pages
- **Search**: Explore and browse songs with a search functionality.
- **Library**: View your saved playlists and albums.
- **Recently Played**: See your listening history.
- **Liked Songs**: Access your favorited tracks.
- **Create Playlist**: Craft custom playlists effortlessly.
- **Storage Management**: Manage browser storage for songs with a dynamic UI for better control and visualization.

---

## Technical Highlights

### Components
- **Sidebar**: Interactive navigation linked to all app pages.
- **Player**: Includes playback, progress tracking, and volume controls, all connected to mock song data.
- **MainContent**: Dynamically displays playlists and song lists.

### Context API
- A `PlayerContext` to handle global state for song playback, progress, and volume control.

### Mock Data
- Simulated playlists, albums, and song data for demonstration purposes.

### Storage Management
- A dedicated **StorageManagement** page:
  - Visualize storage usage.
  - Manage and delete songs to free up space.
  - Dynamic storage limits based on browser capabilities.
  - User-friendly error handling.

---

## How to Run

1. Clone the repository:
   ```bash
   git clone https://github.com/ndaedxo/Soundwave-Spotify-Clone.git
   cd soundwave
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Open the app in your browser:
   ```
   http://localhost:3000
   ```

---

## Key Improvements and Future Scope
- **Playback Enhancements**: Fine-tune the Player component with better controls and visuals.
- **Dynamic Navigation**: Extend Sidebar functionality for seamless user flow.
- **Audio Compression**: Optimize file storage with compression for better performance.
- **Error Handling**: Improve user messages for a polished experience.
- **Full Playlist Playback**: Enable shuffle and queue management.

---

## Project Structure
```
src/
├── components/
│   ├── Sidebar.tsx
│   ├── Player.tsx
│   ├── MainContent.tsx
│   └── SongList.tsx
├── pages/
│   ├── Search.tsx
│   ├── Library.tsx
│   ├── RecentlyPlayed.tsx
│   ├── LikedSongs.tsx
│   ├── CreatePlaylist.tsx
│   └── StorageManagement.tsx
├── services/
│   └── audioService.ts
├── context/
│   └── PlayerContext.tsx
├── mockData.ts
├── types.ts
├── App.tsx
└── index.css
```

---

## Contributing
Contributions are welcome! Please fork the repository and submit a pull request with your updates or fixes.

---

## 👤 Author

Ndaedzo Austin Mukhuba
- GitHub: [@ndaedzo](https://github.com/ndaedxo)
- LinkedIn: [Ndaedzo Austin Mukhuba](https://linkedin.com/in/ndaedzo-mukhuba-71759033b)
- Email: [ndaemukhuba](ndaemukhuba@gmail.com)
  

## License
This project is for educational and demonstration purposes only and is not affiliated with or endorsed by Spotify.

---

Enjoy exploring **Soundwave** and experience a visually stunning music app! 🎵