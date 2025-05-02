// backend/src/models/playlistSongModel.js
const db = require('../db');

const addSongToPlaylist = (playlistId, songId) =>
  db.query(
    `INSERT INTO playlist_song (playlist_id, song_id)
     VALUES ($1, $2)
     ON CONFLICT DO NOTHING
     RETURNING *`,
    [playlistId, songId]
  ).then(r => r.rows[0]);

const removeSongFromPlaylist = (playlistId, songId) =>
  db.query(
    `DELETE FROM playlist_song
     WHERE playlist_id = $1 AND song_id = $2`,
    [playlistId, songId]
  );

const getSongsInPlaylistByUser = (playlistId, userId) =>
  db.query(
    `SELECT s.*
       FROM song s
       JOIN playlist_song ps ON s.song_id = ps.song_id
      WHERE ps.playlist_id = $1
        AND s.user_id = $2`,
    [playlistId, userId]
  ).then(r => r.rows);

module.exports = {
  addSongToPlaylist,
  removeSongFromPlaylist,
  getSongsInPlaylistByUser
};
