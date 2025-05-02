import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../contexts/AuthContext';
import { useAudioPlayer } from '../contexts/AudioPlayerContext';

interface Song {
  song_id: number;
  title: string;
  duration: string | { hours?: number; minutes?: number; seconds?: number };
  file_path: string;
}

interface Artist {
  artist_id: number;
  name: string;
  user_id: number;
}

function formatDuration(d: any): string {
  if (typeof d === 'string') return d;
  const h = d.hours || 0;
  const m = String(d.minutes || 0).padStart(2, '0');
  const s = String(d.seconds || 0).padStart(2, '0');
  return `${h}:${m}:${s}`;
}

const ArtistDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const artistId = Number(id);
  const { user } = useAuth();
  const { playTrack, currentTrack, isPlaying } = useAudioPlayer();

  const [artist, setArtist] = useState<Artist | null>(null);
  const [songs, setSongs]   = useState<Song[]>([]);
  const [error, setError]   = useState<string | null>(null);

  const baseUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    api.get<Artist>(`/artists/${artistId}`)
      .then(res => setArtist(res.data))
      .catch(() => setError('Failed to load artist.'));
    api.get<Song[]>(`/artists/${artistId}/songs`)
      .then(res => setSongs(res.data))
      .catch(() => setError('Failed to load artist songs.'));
  }, [artistId]);

  if (!artist) return <p>Loading…</p>;
  if (artist.user_id !== user?.user_id) return <p>Access denied.</p>;

  return (
    <div>
      <h1>{artist.name}</h1>
      <h2>Songs</h2>
      {songs.length === 0 ? (
        <p>No songs for this artist.</p>
      ) : (
        <ul>
          {songs.map(s => {
            const trackUrl = `${baseUrl}${s.file_path}`;
            const isCurrent = currentTrack?.url === trackUrl && isPlaying;
            return (
              <li key={s.song_id} style={{ marginBottom: '1rem' }}>
                {isCurrent
                  ? <span style={{ color: 'green', fontWeight: 'bold' }}>Playing</span>
                  : <button
                      onClick={() =>
                        playTrack({
                          url:    trackUrl,
                          title:  s.title,
                          artist: artist.name,
                          album:  ''
                        })
                      }
                    >
                      ▶ Play
                    </button>
                }
                <span style={{ marginLeft: '0.5rem' }}>
                  {s.title} — {formatDuration(s.duration)}
                </span>
              </li>
            );
          })}
        </ul>
      )}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default ArtistDetail;
