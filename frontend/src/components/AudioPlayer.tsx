import React from "react";
import { useAudioPlayer } from "../contexts/AudioPlayerContext";

function formatTime(seconds: number): string {
  if (isNaN(seconds)) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

const AudioPlayer: React.FC = () => {
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    volume,
    togglePlayPause,
    seek,
    setVolume,
    playNext,
    playPrevious,
  } = useAudioPlayer();

  if (!currentTrack) {
    return (
      <div className="audio-player">
        <div className="audio-player-info">
          <div
            className="audio-player-title"
            style={{ color: "var(--text-muted)" }}
          >
            No track selected
          </div>
        </div>
      </div>
    );
  }

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    seek(percentage * duration);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(parseFloat(e.target.value));
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="audio-player">
      <div className="audio-player-controls">
        <button
          className="btn btn-icon"
          onClick={playPrevious}
          title="Previous"
        >
          <span className="btn-icon-content">⏮</span>
        </button>
        <button
          className="btn btn-icon btn-primary"
          onClick={togglePlayPause}
          title={isPlaying ? "Pause" : "Play"}
        >
          <span className="btn-icon-content">{isPlaying ? "⏸" : "▶"}</span>
        </button>
        <button className="btn btn-icon" onClick={playNext} title="Next">
          <span className="btn-icon-content">⏭</span>
        </button>
      </div>

      <div className="audio-player-info">
        <div className="audio-player-title">
          {currentTrack.title || "Unknown"}
        </div>
        <div className="audio-player-subtitle">
          {currentTrack.artist || "Unknown Artist"}
          {currentTrack.album && ` • ${currentTrack.album}`}
        </div>
      </div>

      <div className="audio-player-progress">
        <span className="audio-player-time">{formatTime(currentTime)}</span>
        <div className="audio-player-slider" onClick={handleProgressClick}>
          <div
            className="audio-player-slider-fill"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="audio-player-time">{formatTime(duration)}</span>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <span style={{ fontSize: "14px" }}>🔊</span>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={handleVolumeChange}
          style={{ width: "80px" }}
        />
      </div>
    </div>
  );
};

export default AudioPlayer;
