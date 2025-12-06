# Music Library - New Frontend

A modern, beautiful frontend for the Music Library app inspired by developer portfolio aesthetics.

## Features

- 🎨 **Beautiful Design** - Monospace font, clean card-based layout with gradient backgrounds
- 🌙 **Dark/Light Mode** - Toggle between themes with automatic system preference detection
- 🎵 **Audio Player** - Built-in audio player with queue management, next/previous controls
- 📱 **Responsive** - Works great on desktop and mobile devices
- ⚡ **Fast** - Built with Vite and React 19

## Design Inspiration

The design follows a developer portfolio aesthetic with:

- Monospace font (JetBrains Mono)
- `//section` style labels
- `<Component/>` style titles
- Clean, minimal card container
- Purple/pink gradient background
- Smooth theme transitions

## Getting Started

1. **Install dependencies:**

   ```bash
   cd frontend-new
   npm install
   ```

2. **Create environment file:**

   ```bash
   echo "VITE_API_URL=http://localhost:4000" > .env
   ```

3. **Start the development server:**

   ```bash
   npm run dev
   ```

4. **Open in browser:**
   Navigate to [http://localhost:5174](http://localhost:5174)

## Project Structure

```
frontend-new/
├── public/
│   └── music-icon.svg       # App icon
├── src/
│   ├── api/
│   │   └── axios.ts         # API client with auth interceptor
│   ├── components/
│   │   ├── AudioPlayer.tsx  # Global audio player
│   │   ├── Layout.tsx       # Main layout with navigation
│   │   └── PrivateRoute.tsx # Auth protection wrapper
│   ├── contexts/
│   │   ├── AudioPlayerContext.tsx  # Audio playback state
│   │   ├── AuthContext.tsx         # User authentication
│   │   └── ThemeContext.tsx        # Light/dark theme
│   ├── pages/
│   │   ├── Login.tsx / Register.tsx
│   │   ├── SongList.tsx / SongCreate.tsx / SongEdit.tsx
│   │   ├── AlbumList.tsx / AlbumDetail.tsx
│   │   ├── ArtistList.tsx / ArtistDetail.tsx
│   │   ├── GenreList.tsx / GenreDetail.tsx
│   │   └── PlaylistList.tsx / PlaylistCreate.tsx / PlaylistDetail.tsx / PlaylistEdit.tsx
│   ├── styles/
│   │   └── global.css       # Global styles and CSS variables
│   ├── App.tsx              # Main app with routing
│   └── main.tsx             # Entry point
└── vite.config.ts           # Vite configuration (port 5174)
```

## Replacing the Old Frontend

When you're ready to replace the old frontend:

1. Rename the old frontend folder:

   ```bash
   mv frontend frontend-old
   ```

2. Rename the new frontend folder:

   ```bash
   mv frontend-new frontend
   ```

3. Update `vite.config.ts` to use port 5173:

   ```ts
   server: {
     port: 5173,
   }
   ```

4. Run the app as usual:
   ```bash
   npm run dev
   ```

## Tech Stack

- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **React Router 7** - Routing
- **Axios** - HTTP client
- **CSS Variables** - Theming
