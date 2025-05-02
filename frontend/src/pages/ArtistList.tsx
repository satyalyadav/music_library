import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

interface Artist {
  artist_id: number;
  name: string;
}

const ArtistList: React.FC = () => {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    api.get<Artist[]>('/artists')
      .then(res => setArtists(res.data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading artists…</p>;
  if (error)   return <p style={{ color: 'red' }}>Error: {error}</p>;
  if (artists.length === 0) return <p>No artists found.</p>;

  return (
    <div>
      <h1>Artists</h1>
      <ul>
        {artists.map(artist => (
          <li key={artist.artist_id}>
            <button onClick={() => navigate(`/artists/${artist.artist_id}`)}>
              {artist.name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ArtistList;
