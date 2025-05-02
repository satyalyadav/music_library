// frontend/src/pages/SongEdit.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/axios';

interface Artist { artist_id: number; name: string; }
interface Album  { album_id:  number; title:  string; }
interface Genre  { genre_id:  number; name:   string; }

const SongEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const songId = Number(id);
  const navigate = useNavigate();

  // Form state
  const [title, setTitle]           = useState('');
  const [artistName, setArtistName] = useState('');
  const [artistId, setArtistId]     = useState<number | null>(null);
  const [albumTitle, setAlbumTitle] = useState('');
  const [albumId, setAlbumId]       = useState<number | null>(null);
  const [genreName, setGenreName]   = useState('');
  const [genreId, setGenreId]       = useState<number | null>(null);
  const [duration, setDuration]     = useState('00:03:00');
  const [error, setError]           = useState<string | null>(null);

  // Lookup lists
  const [artists, setArtists] = useState<Artist[]>([]);
  const [albums, setAlbums]   = useState<Album[]>([]);
  const [genres, setGenres]   = useState<Genre[]>([]);

  // Load pick-lists and song data
  useEffect(() => {
    Promise.all([
      api.get<Artist[]>('/artists'),
      api.get<Album[]>('/albums'),
      api.get<Genre[]>('/genres'),
      api.get<any>(`/songs/${songId}`)
    ])
    .then(([aR, alR, gR, sR]) => {
      setArtists(aR.data);
      setAlbums(alR.data);
      setGenres(gR.data);

      const s = sR.data;
      setTitle(s.title);
      // Pre-set artist
      const art = aR.data.find(a => a.artist_id === s.artist_id);
      setArtistName(art?.name ?? '');
      setArtistId(s.artist_id);
      // Pre-set album
      if (s.album_id) {
        const alb = alR.data.find(a => a.album_id === s.album_id);
        setAlbumTitle(alb?.title ?? '');
        setAlbumId(s.album_id);
      }
      // Pre-set genre
      const gen = gR.data.find(g => g.genre_id === s.genre_id);
      setGenreName(gen?.name ?? '');
      setGenreId(s.genre_id);
      // Duration
      if (typeof s.duration === 'string') {
        setDuration(s.duration);
      } else {
        // New code—hours padded to two digits:
        const h2 = String(s.duration.hours || 0).padStart(2, '0');
        const m2 = String(s.duration.minutes || 0).padStart(2, '0');
        const sec2 = String(s.duration.seconds || 0).padStart(2, '0');
        setDuration(`${h2}:${m2}:${sec2}`);
      }
    })
    .catch(() => setError('Failed to load song data.'));
  }, [songId]);

  // Handlers for selecting existing entries
  const handleArtistSelect = (name: string) => {
    setArtistName(name);
    const match = artists.find(a => a.name === name);
    setArtistId(match?.artist_id ?? null);
  };
  const handleAlbumSelect = (title: string) => {
    setAlbumTitle(title);
    const match = albums.find(a => a.title === title);
    setAlbumId(match?.album_id ?? null);
  };
  const handleGenreSelect = (name: string) => {
    setGenreName(name);
    const match = genres.find(g => g.name === name);
    setGenreId(match?.genre_id ?? null);
  };

  // Inline creation
  const addNewArtist = async () => {
    if (!artistName) return;
    const res = await api.post<Artist>('/artists', { name: artistName });
    setArtists(prev => [...prev, res.data]);
    setArtistId(res.data.artist_id);
  };
  const addNewAlbum = async () => {
    if (!albumTitle || artistId === null) return;
    const res = await api.post<Album>('/albums', { title: albumTitle, artist_id: artistId });
    setAlbums(prev => [...prev, res.data]);
    setAlbumId(res.data.album_id);
  };
  const addNewGenre = async () => {
    if (!genreName) return;
    const res = await api.post<Genre>('/genres', { name: genreName });
    setGenres(prev => [...prev, res.data]);
    setGenreId(res.data.genre_id);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !artistId || !genreId || !duration) {
      setError('Title, artist, genre, and duration are required.');
      return;
    }
    setError(null);

    try {
      await api.put(`/songs/${songId}`, {
        title,
        artist_id: artistId,
        album_id: albumId || null,
        genre_id: genreId,
        duration
      });
      navigate('/songs');
    } catch (err: any) {
      setError(err.response?.data?.error || err.message);
    }
  };

  return (
    <div>
      <h1>Edit Song</h1>
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
          <label>Artist<br/>
            <input
              list="artist-list"
              value={artistName}
              onChange={e => handleArtistSelect(e.target.value)}
              required
            />
            <datalist id="artist-list">
              {artists.map(a => <option key={a.artist_id} value={a.name} />)}
            </datalist>
            {artistName && !artists.some(a => a.name === artistName) && (
              <button type="button" onClick={addNewArtist}>Add new artist</button>
            )}
          </label>
        </div>
        <div>
          <label>Album (optional)<br/>
            <input
              list="album-list"
              value={albumTitle}
              onChange={e => handleAlbumSelect(e.target.value)}
            />
            <datalist id="album-list">
              {albums.map(al => <option key={al.album_id} value={al.title} />)}
            </datalist>
            {albumTitle && !albums.some(al => al.title === albumTitle) && (
              <button type="button" onClick={addNewAlbum}>Add new album</button>
            )}
          </label>
        </div>
        <div>
          <label>Genre<br/>
            <input
              list="genre-list"
              value={genreName}
              onChange={e => handleGenreSelect(e.target.value)}
              required
            />
            <datalist id="genre-list">
              {genres.map(g => <option key={g.genre_id} value={g.name} />)}
            </datalist>
            {genreName && !genres.some(g => g.name === genreName) && (
              <button type="button" onClick={addNewGenre}>Add new genre</button>
            )}
          </label>
        </div>
        <div>
        <label>Duration (HH:MM:SS)<br/>
          <input
            type="text"
            value={duration}
            onChange={e => setDuration(e.target.value)}
            pattern="[0-9]{2}:[0-9]{2}:[0-9]{2}"
            title="Format: HH:MM:SS"
            placeholder="e.g., 03:24:00"
            required
          />
        </label>
        </div>
        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
};

export default SongEdit;
