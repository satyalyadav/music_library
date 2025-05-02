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

interface Playlist {
  playlist_id: number;
  title: string;
  cover_image: string | null;
  date_created: string;
  user_id: number;
}

function formatDuration(d: any): string {
  if (typeof d === 'string') return d;
  const h = d.hours || 0;
  const m = String(d.minutes || 0).padStart(2, '0');
  const s = String(d.seconds || 0).padStart(2, '0');
  return `${h}:${m}:${s}`;
}

const PlaylistDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const playlistId = Number(id);
  const { user } = useAuth();
  const { playTrack, currentTrack, isPlaying } = useAudioPlayer();

  const [playlist, setPlaylist] = useState<Playlist | null>(null);
  const [songsInPlaylist, setSongsInPlaylist] = useState<Song[]>([]);
  const [allSongs, setAllSongs] = useState<Song[]>([]);
  const [selectedSong, setSelectedSong] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  const baseUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    api.get<Playlist>(`/playlists/${playlistId}`)
      .then(res => setPlaylist(res.data))
      .catch(() => setError('Failed to load playlist.'));
    api.get<Song[]>(`/playlists/${playlistId}/songs`)
      .then(res => setSongsInPlaylist(res.data))
      .catch(() => setError('Failed to load playlist songs.'));
    api.get<Song[]>('/songs')
      .then(res => setAllSongs(res.data))
      .catch(() => setError('Failed to load all songs.'));
  }, [playlistId]);

  const handleAdd = async () => {
    if (!selectedSong) return;
    await api.post(`/playlists/${playlistId}/songs`, { song_id: selectedSong });
    setSongsInPlaylist(prev => [
      ...prev,
      allSongs.find(s => s.song_id === selectedSong)!
    ]);
    setSelectedSong(0);
  };

  const handleRemove = async (songId: number) => {
    await api.delete(`/playlists/${playlistId}/songs/${songId}`);
    setSongsInPlaylist(prev => prev.filter(s => s.song_id !== songId));
  };

  if (!playlist) return <p>Loading…</p>;
  if (playlist.user_id !== user?.user_id) return <p>Access denied.</p>;

  const available = allSongs.filter(
    s => !songsInPlaylist.some(ps => ps.song_id === s.song_id)
  );

  return (
    <div>
      <h1>{playlist.title}</h1>
      {playlist.cover_image && (
        <img src={playlist.cover_image} alt="Cover" style={{ maxWidth: '200px' }} />
      )}
      <p>Created on: {new Date(playlist.date_created).toLocaleDateString()}</p>

      <h2>Songs</h2>
      {songsInPlaylist.length === 0 ? (
        <p>No songs in this playlist.</p>
      ) : (
        <ul>
          {songsInPlaylist.map(s => {
            const trackUrl = `${baseUrl}${s.file_path}`;
            const isCurrent = currentTrack?.url === trackUrl && isPlaying;
            return (
              <li key={s.song_id} style={{ marginBottom: '0.5rem' }}>
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
                </span>{' '}
                <button onClick={() => handleRemove(s.song_id)}>Remove</button>
              </li>
            );
          })}
        </ul>
      )}

      <div style={{ marginTop: '1rem' }}>
        <select
          value={selectedSong}
          onChange={e => setSelectedSong(Number(e.target.value))}
        >
          <option value={0}>Select song…</option>
          {available.map(s => (
            <option key={s.song_id} value={s.song_id}>
              {s.title}
            </option>
          ))}
        </select>
        <button onClick={handleAdd} disabled={!selectedSong}>
          Add Song
        </button>
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default PlaylistDetail;
