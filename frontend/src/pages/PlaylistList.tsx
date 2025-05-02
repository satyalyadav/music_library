import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../contexts/AuthContext';

interface Playlist {
  playlist_id: number;
  title: string;
  cover_image: string | null;
  date_created: string;
  user_id: number;
}

const PlaylistList: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPlaylists = () => {
    setLoading(true);
    api.get<Playlist[]>('/playlists')
      .then(res => setPlaylists(res.data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(fetchPlaylists, []);

  const handleDelete = async (id: number) => {
    if (!window.confirm('Delete this playlist?')) return;
    try {
      await api.delete(`/playlists/${id}`);
      fetchPlaylists();
    } catch (err: any) {
      alert(err.response?.data?.error || err.message);
    }
  };

  if (loading) return <p>Loading playlists…</p>;
  if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;
  if (playlists.length === 0) return <p>No playlists found.</p>;

  return (
    <div>
      <h1>Your Playlists</h1>
      <button onClick={() => navigate('/playlists/new')} style={{ marginBottom: '1rem' }}>
        + Add Playlist
      </button>
      <ul>
        {playlists.map(p => (
          <li key={p.playlist_id} style={{ marginBottom: '0.5rem' }}>
            {p.title} — {new Date(p.date_created).toLocaleDateString()}
            {' '}
            <button onClick={() => navigate(`/playlists/${p.playlist_id}`)}>
              View
            </button>
            {' '}
            <button onClick={() => navigate(`/playlists/${p.playlist_id}/edit`)}>
              Edit
            </button>
            {' '}
            <button onClick={() => handleDelete(p.playlist_id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PlaylistList;
