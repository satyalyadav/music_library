// src/pages/AlbumList.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/axios';

interface Album {
  album_id:    number;
  title:       string;
  cover_image: string | null;
  user_id:     number;
  // any other fields…
}

const AlbumList: React.FC = () => {
  const { category } = useParams<{ category: string }>();
  const navigate = useNavigate();

  const [albums, setAlbums]     = useState<Album[]>([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    // Build the URL: e.g. /albums?category=singles
    const url = category ? `/albums?category=${category}` : '/albums';

    api.get<Album[]>(url)
      .then(res => {
        setAlbums(res.data);
      })
      .catch(err => {
        setError(err.message);
      })
      .finally(() => {
        // ✅ ALWAYS clear loading
        setLoading(false);
      });
  }, [category]);

  if (loading) return <p>Loading…</p>;
  if (error)   return <p style={{ color: 'red' }}>Error: {error}</p>;

  // If we got back an empty array, show a friendly message
  if (albums.length === 0) {
    return (
      <div>
        <h1>
          {category
            ? `${category.charAt(0).toUpperCase() + category.slice(1)} Albums`
            : 'Albums'}
        </h1>
        <p>No {category ?? ''} albums found.</p>
      </div>
    );
  }

  return (
    <div>
      <h1>
        {category
          ? `${category.charAt(0).toUpperCase() + category.slice(1)} Albums`
          : 'Albums'}
      </h1>
      <ul>
        {albums.map(album => (
          <li key={album.album_id} style={{ marginBottom: '1rem' }}>
            {album.cover_image && (
              <img
                src={album.cover_image}
                alt={album.title}
                style={{ width: 100, height: 100, objectFit: 'cover', marginRight: 8 }}
              />
            )}
            <strong>{album.title}</strong>{' '}
            <button onClick={() => navigate(`/albums/${album.album_id}`)}>
              View
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AlbumList;
