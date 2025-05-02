// src/pages/SongList.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAudioPlayer } from '../contexts/AudioPlayerContext';

interface Song {
  song_id: number;
  title: string;
  duration: any;
  file_path: string;
}

function formatDuration(d: any): string {
  if (typeof d === 'string') return d;
  const h = d.hours || 0;
  const m = String(d.minutes || 0).padStart(2, '0');
  const s = String(d.seconds || 0).padStart(2, '0');
  return `${h}:${m}:${s}`;
}

const SongList: React.FC = () => {
  const [songs, setSongs]   = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState<string | null>(null);
  const navigate = useNavigate();
  const {
    playTrack,
    currentTrack,
    isPlaying
  } = useAudioPlayer();
  const baseUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    api.get<Song[]>('/songs')
      .then(r => { setSongs(r.data); setError(null); })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading…</p>;
  if (error)   return <p style={{ color: 'red' }}>Error: {error}</p>;
  if (!songs.length) return <p>No songs found.</p>;

  return (
    <div>
      <h1>Songs</h1>
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
                        artist: '',
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
              <button
                onClick={() => navigate(`/songs/${s.song_id}/edit`)}
                style={{ margin: '0 0.5rem' }}
              >
                Edit
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default SongList;
