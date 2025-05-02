// frontend/src/pages/SongCreate.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

interface Artist { artist_id: number; name: string; }
interface Album  { album_id: number;  title: string; }
interface Genre  { genre_id: number;  name:  string; }

const SongCreate: React.FC = () => {
  const navigate = useNavigate();

  // Form state
  const [title, setTitle]         = useState('');
  const [artistName, setArtistName] = useState('');
  const [artistId, setArtistId]     = useState<number| null>(null);
  const [albumTitle, setAlbumTitle] = useState('');
  const [albumId, setAlbumId]       = useState<number| null>(null);
  const [genreName, setGenreName]   = useState('');
  const [genreId, setGenreId]       = useState<number| null>(null);
  const [duration, setDuration]     = useState('00:03:00');
  const [audioFile, setAudioFile]   = useState<File|null>(null);
  const [error, setError]           = useState<string|null>(null);

  // Lookup lists
  const [artists, setArtists] = useState<Artist[]>([]);
  const [albums, setAlbums]   = useState<Album[]>([]);
  const [genres, setGenres]   = useState<Genre[]>([]);

  // Load existing pick-lists on mount
  useEffect(() => {
    Promise.all([
      api.get<Artist[]>('/artists'),
      api.get<Album[]>('/albums'),
      api.get<Genre[]>('/genres'),
    ])
    .then(([aR, alR, gR]) => {
      setArtists(aR.data);
      setAlbums(alR.data);
      setGenres(gR.data);
    })
    .catch(() => {
      setError('Failed to load form data.');
    });
  }, []);

  // Handlers for selecting existing entries
  const handleArtistSelect = (name: string) => {
    setArtistName(name);
    const match = artists.find(a => a.name === name);
    setArtistId(match ? match.artist_id : null);
  };
  const handleAlbumSelect = (title: string) => {
    setAlbumTitle(title);
    const match = albums.find(a => a.title === title);
    setAlbumId(match ? match.album_id : null);
  };
  const handleGenreSelect = (name: string) => {
    setGenreName(name);
    const match = genres.find(g => g.name === name);
    setGenreId(match ? match.genre_id : null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !artistName || !genreName || !duration || !audioFile) {
      setError('Title, artist, genre, duration, and audio file are required.');
      return;
    }
    setError(null);

    try {
      // 1) Create artist if needed
      let finalArtistId = artistId!;
      if (!artistId) {
        const res = await api.post<Artist>('/artists', { name: artistName });
        finalArtistId = res.data.artist_id;
      }

      // 2) Create genre if needed
      let finalGenreId = genreId!;
      if (!genreId) {
        const res = await api.post<Genre>('/genres', { name: genreName });
        finalGenreId = res.data.genre_id;
      }

      // 3) Create album if title provided
      let finalAlbumId: number | null = albumId;
      if (albumTitle) {
        if (!albumId) {
          const res = await api.post<Album>('/albums', {
            title: albumTitle,
            artist_id: finalArtistId
          });
          finalAlbumId = res.data.album_id;
        }
      } else {
        finalAlbumId = null;
      }

      // 4) Finally create the song (this triggers file upload)
      const formData = new FormData();
      formData.append('audio', audioFile);
      formData.append('title', title);
      formData.append('artist_id', String(finalArtistId));
      formData.append('album_id', finalAlbumId ? String(finalAlbumId) : '');
      formData.append('genre_id', String(finalGenreId));
      formData.append('duration', duration);

      await api.post('/songs', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      navigate('/songs');
    } catch (err: any) {
      setError(err.response?.data?.error || err.message);
    }
  };

  return (
    <div>
      <h1>New Song</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        {/* Audio file input */}
        <div>
          <label>Audio File<br/>
            <input
              type="file"
              accept="audio/*"
              onChange={e => setAudioFile(e.target.files?.[0] || null)}
              required
            />
          </label>
        </div>

        {/* Title */}
        <div>
          <label>Title<br/>
            <input
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
            />
          </label>
        </div>

        {/* Artist typeahead */}
        <div>
          <label>Artist<br/>
            <input
              list="artist-list"
              value={artistName}
              onChange={e => handleArtistSelect(e.target.value)}
              required
            />
            <datalist id="artist-list">
              {artists.map(a => (
                <option key={a.artist_id} value={a.name} />
              ))}
            </datalist>
          </label>
        </div>

        {/* Album typeahead (optional) */}
        <div>
          <label>Album (optional)<br/>
            <input
              list="album-list"
              value={albumTitle}
              onChange={e => handleAlbumSelect(e.target.value)}
            />
            <datalist id="album-list">
              {albums.map(al => (
                <option key={al.album_id} value={al.title} />
              ))}
            </datalist>
          </label>
        </div>

        {/* Genre typeahead */}
        <div>
          <label>Genre<br/>
            <input
              list="genre-list"
              value={genreName}
              onChange={e => handleGenreSelect(e.target.value)}
              required
            />
            <datalist id="genre-list">
              {genres.map(g => (
                <option key={g.genre_id} value={g.name} />
              ))}
            </datalist>
          </label>
        </div>

        {/* Duration */}
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

        <button type="submit">Create Song</button>
      </form>
    </div>
  );
};

export default SongCreate;
