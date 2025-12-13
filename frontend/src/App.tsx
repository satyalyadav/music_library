import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";
import Layout from "./components/Layout";
import PrivateRoute from "./components/PrivateRoute";

import SongList from "./pages/SongList";
import SongCreate from "./pages/SongCreate";
import SongEdit from "./pages/SongEdit";
import AlbumList from "./pages/AlbumList";
import AlbumDetail from "./pages/AlbumDetail";
import ArtistList from "./pages/ArtistList";
import ArtistDetail from "./pages/ArtistDetail";
import GenreList from "./pages/GenreList";
import GenreDetail from "./pages/GenreDetail";
import PlaylistList from "./pages/PlaylistList";
import PlaylistCreate from "./pages/PlaylistCreate";
import PlaylistDetail from "./pages/PlaylistDetail";
import PlaylistEdit from "./pages/PlaylistEdit";

const App: React.FC = () => {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="app-container">
        <div
          className="loading"
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          Loading...
        </div>
      </div>
    );
  }

  return (
    <Layout>
      <Routes>
        {/* All routes are accessible without authentication */}
        <Route
          path="/songs"
          element={
            <PrivateRoute>
              <SongList />
            </PrivateRoute>
          }
        />
        <Route
          path="/songs/new"
          element={
            <PrivateRoute>
              <SongCreate />
            </PrivateRoute>
          }
        />
        <Route
          path="/songs/:id/edit"
          element={
            <PrivateRoute>
              <SongEdit />
            </PrivateRoute>
          }
        />

        <Route
          path="/albums"
          element={
            <PrivateRoute>
              <AlbumList />
            </PrivateRoute>
          }
        />
        <Route
          path="/albums/:id"
          element={
            <PrivateRoute>
              <AlbumDetail />
            </PrivateRoute>
          }
        />

        <Route
          path="/artists"
          element={
            <PrivateRoute>
              <ArtistList />
            </PrivateRoute>
          }
        />
        <Route
          path="/artists/:id"
          element={
            <PrivateRoute>
              <ArtistDetail />
            </PrivateRoute>
          }
        />

        <Route
          path="/genres"
          element={
            <PrivateRoute>
              <GenreList />
            </PrivateRoute>
          }
        />
        <Route
          path="/genres/:id"
          element={
            <PrivateRoute>
              <GenreDetail />
            </PrivateRoute>
          }
        />

        <Route
          path="/playlists"
          element={
            <PrivateRoute>
              <PlaylistList />
            </PrivateRoute>
          }
        />
        <Route
          path="/playlists/new"
          element={
            <PrivateRoute>
              <PlaylistCreate />
            </PrivateRoute>
          }
        />
        <Route
          path="/playlists/:id"
          element={
            <PrivateRoute>
              <PlaylistDetail />
            </PrivateRoute>
          }
        />
        <Route
          path="/playlists/:id/edit"
          element={
            <PrivateRoute>
              <PlaylistEdit />
            </PrivateRoute>
          }
        />

        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/songs" replace />} />
        <Route path="*" element={<Navigate to="/songs" replace />} />
      </Routes>
    </Layout>
  );
};

export default App;
