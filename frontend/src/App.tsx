import React from 'react';
import { Routes, Route, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import { AudioPlayerProvider } from './contexts/AudioPlayerContext';
import AudioPlayer from './components/AudioPlayer';

import SongList       from './pages/SongList';
import SongCreate     from './pages/SongCreate';
import SongEdit       from './pages/SongEdit';
import AlbumList      from './pages/AlbumList';
import AlbumDetail    from './pages/AlbumDetail';
import ArtistList     from './pages/ArtistList';
import ArtistDetail   from './pages/ArtistDetail';
import GenreList      from './pages/GenreList';
import GenreDetail    from './pages/GenreDetail';
import PlaylistList   from './pages/PlaylistList';
import PlaylistCreate from './pages/PlaylistCreate';
import PlaylistDetail from './pages/PlaylistDetail';
import PlaylistEdit   from './pages/PlaylistEdit';
import Register       from './pages/Register';
import Login          from './pages/Login';

const App: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <AudioPlayerProvider>
      <div>
        <nav style={{ padding: '1rem', borderBottom: '1px solid #ccc' }}>
          {user ? (
            <>
              <NavLink to="/songs"     style={{ marginRight: '1rem' }}>Songs</NavLink>
              <NavLink to="/songs/new" style={{ marginRight: '1rem' }}>+ Add Song</NavLink>
              <NavLink to="/albums"    style={{ marginRight: '1rem' }}>Albums</NavLink>
              <NavLink to="/artists"   style={{ marginRight: '1rem' }}>Artists</NavLink>
              <NavLink to="/genres"    style={{ marginRight: '1rem' }}>Genres</NavLink>
              <NavLink to="/playlists" style={{ marginRight: '1rem' }}>Playlists</NavLink>
              <button
                onClick={() => navigate('/playlists/new')}
                style={{ marginRight: '1rem' }}
              >
                + Add Playlist
              </button>
              <span style={{ marginRight: '1rem' }}>Hello, {user.username}</span>
              <button onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <NavLink to="/register" style={{ marginRight: '1rem' }}>Register</NavLink>
              <NavLink to="/login">Login</NavLink>
            </>
          )}
        </nav>

        <main style={{ padding: '1rem' }}>
          <Routes>
            {/* Public */}
            <Route path="/login"    element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected */}
            <Route path="/songs"              element={<PrivateRoute><SongList /></PrivateRoute>} />
            <Route path="/songs/new"          element={<PrivateRoute><SongCreate /></PrivateRoute>} />
            <Route path="/songs/:id/edit"     element={<PrivateRoute><SongEdit /></PrivateRoute>} />

            <Route path="/albums"             element={<PrivateRoute><AlbumList /></PrivateRoute>} />
            <Route path="/albums/:id"         element={<PrivateRoute><AlbumDetail /></PrivateRoute>} />

            <Route path="/artists"            element={<PrivateRoute><ArtistList /></PrivateRoute>} />
            <Route path="/artists/:id"        element={<PrivateRoute><ArtistDetail /></PrivateRoute>} />

            <Route path="/genres"             element={<PrivateRoute><GenreList /></PrivateRoute>} />
            <Route path="/genres/:id"         element={<PrivateRoute><GenreDetail /></PrivateRoute>} />

            <Route path="/playlists"          element={<PrivateRoute><PlaylistList /></PrivateRoute>} />
            <Route path="/playlists/new"      element={<PrivateRoute><PlaylistCreate /></PrivateRoute>} />
            <Route path="/playlists/:id"      element={<PrivateRoute><PlaylistDetail /></PrivateRoute>} />
            <Route path="/playlists/:id/edit" element={<PrivateRoute><PlaylistEdit /></PrivateRoute>} />

            {/* Fallback */}
            <Route path="*" element={<PrivateRoute><SongList /></PrivateRoute>} />
          </Routes>
        </main>

        {/* universal player */}
        <AudioPlayer />
      </div>
    </AudioPlayerProvider>
  );
};

export default App;
