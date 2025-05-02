// src/components/AudioPlayer.tsx
import React from 'react';
import { useAudioPlayer } from '../contexts/AudioPlayerContext';

const formatTime = (sec: number) => {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60)
    .toString()
    .padStart(2, '0');
  return `${m}:${s}`;
};

const AudioPlayer: React.FC = () => {
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    togglePlayPause,
    seek,
  } = useAudioPlayer();

  if (!currentTrack) return null;
  const timeRemaining = duration - currentTime;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        padding: '0.5rem 1rem',
        borderTop: '1px solid #ccc',
        background: '#fff',
        color: '#000',             // <-- ensure text is black
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
      }}
    >
      {/* Track info */}
      <div style={{ flexShrink: 0 }}>
        <div style={{ fontWeight: 'bold' }}>{currentTrack.title}</div>
        {currentTrack.artist && (
          <div style={{ fontSize: '0.9em' }}>
            {currentTrack.artist}
          </div>
        )}
      </div>

      {/* Play/pause */}
      <button onClick={togglePlayPause} style={{ flexShrink: 0 }}>
        {isPlaying ? '❚❚' : '▶'}
      </button>

      {/* Progress */}
      <div style={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
        <span style={{ width: '3rem', textAlign: 'right' }}>
          {formatTime(currentTime)}
        </span>

        <input
          type="range"
          min={0}
          max={duration || 0}
          step={0.1}
          value={currentTime}
          onChange={e => seek(Number(e.target.value))}
          style={{ flexGrow: 1, margin: '0 0.5rem' }}
        />

        <span style={{ width: '3rem', textAlign: 'left' }}>
          -{formatTime(timeRemaining)}
        </span>
      </div>
    </div>
  );
};

export default AudioPlayer;
