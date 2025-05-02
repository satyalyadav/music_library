import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../contexts/AuthContext';

const PlaylistCreate: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [dateCreated, setDateCreated] = useState(() => new Date().toISOString().split('T')[0]);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) {
      setError('Title is required.');
      return;
    }
    setError(null);
    try {
      await api.post('/playlists', {
        title,
        cover_image: coverImage || null,
        date_created: dateCreated,
        user_id: user?.user_id
      });
      navigate('/playlists');
    } catch (err: any) {
      setError(err.response?.data?.error || err.message);
    }
  };

  return (
    <div>
      <h1>New Playlist</h1>
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
        <button type="submit">Create Playlist</button>
      </form>
    </div>
  );
};

export default PlaylistCreate;
