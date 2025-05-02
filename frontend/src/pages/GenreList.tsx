import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
interface Genre { genre_id: number; name: string; }
const GenreList: React.FC = () => {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string|null>(null);
  const navigate = useNavigate();
  useEffect(() => {
    api.get<Genre[]>('/genres')
      .then(res => setGenres(res.data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);
  if (loading) return <p>Loading genres…</p>;
  if (error)   return <p style={{ color: 'red' }}>Error: {error}</p>;
  if (genres.length === 0) return <p>No genres found.</p>;
  return (
    <div>
      <h1>Genres</h1>
      <ul>
        {genres.map(g => (
          <li key={g.genre_id}>
            <button onClick={() => navigate(`/genres/${g.genre_id}`)}>
              {g.name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};
export default GenreList;