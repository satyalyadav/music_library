import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../contexts/AuthContext';

interface Playlist {
  playlist_id: number;
  title: string;
  cover_image: string | null;
  date_created: string;
  user_id: number;
}

const PlaylistEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const playlistId = Number(id);
  const navigate = useNavigate();
  const { user } = useAuth();

  const [playlist, setPlaylist] = useState<Playlist | null>(null);
  const [title, setTitle] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [dateCreated, setDateCreated] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.get<Playlist>(`/playlists/${playlistId}`)
      .then(res => {
        setPlaylist(res.data);
        setTitle(res.data.title);
        setCoverImage(res.data.cover_image || '');
        setDateCreated(res.data.date_created.split('T')[0]);
      })
      .catch(() => setError('Failed to load playlist.'));
  }, [playlistId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) {
      setError('Title is required.');
      return;
    }
    setError(null);
    try {
      await api.put(`/playlists/${playlistId}`, {
        title,
        cover_image: coverImage || null,
        date_created: dateCreated
      });
      navigate(`/playlists/${playlistId}`);
    } catch (err: any) {
      setError(err.response?.data?.error || err.message);
    }
  };

  if (!playlist) return <p>Loading…</p>;

  // Optional: Ensure only owner can edit
  if (playlist.user_id !== user?.user_id) {
    return <p>You do not have permission to edit this playlist.</p>;
  }

  return (
    <div>
      <h1>Edit Playlist</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title<br/>
            <input
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
            />
          </label>
        </div>
        <div>
          <label>Cover Image URL (optional)<br/>
            <input
              type="text"
              value={coverImage}
              onChange={e => setCoverImage(e.target.value)}
            />
          </label>
        </div>
        <div>
          <label>Date Created<br/>
            <input
              type="date"
              value={dateCreated}
              onChange={e => setDateCreated(e.target.value)}
              required
            />
          </label>
        </div>
        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
};

export default PlaylistEdit;
