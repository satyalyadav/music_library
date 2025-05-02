const { getPlaylistByIdAndUser } = require('../models/playlistModel');
const {
  addSongToPlaylist,
  removeSongFromPlaylist,
  getSongsInPlaylistByUser
} = require('../models/playlistSongModel');

// List songs in a playlist, only if playlist is owned by the logged-in user
const listSongs = async (req, res, next) => {
  try {
    const playlistId = parseInt(req.params.id, 10);
    const playlist = await getPlaylistByIdAndUser(playlistId, req.user.user_id);
    if (!playlist) return res.status(404).json({ error: 'playlist not found' });

    const songs = await getSongsInPlaylistByUser(playlistId, req.user.user_id);
    res.json(songs);
  } catch (err) {
    next(err);
  }
};

// Add a song to a playlist if the playlist is owned by the logged-in user
const addSong = async (req, res, next) => {
  try {
    const playlistId = parseInt(req.params.id, 10);
    const playlist = await getPlaylistByIdAndUser(playlistId, req.user.user_id);
    if (!playlist) return res.status(404).json({ error: 'playlist not found' });

    const songId = parseInt(req.body.song_id, 10);
    if (!songId) return res.status(400).json({ error: 'song_id is required' });

    const ps = await addSongToPlaylist(playlistId, songId);
    res.status(201).json(ps);
  } catch (err) {
    next(err);
  }
};

// Remove a song from a playlist if owned by the logged-in user
const removeSong = async (req, res, next) => {
  try {
    const playlistId = parseInt(req.params.id, 10);
    const songId     = parseInt(req.params.songId, 10);
    const playlist = await getPlaylistByIdAndUser(playlistId, req.user.user_id);
    if (!playlist) return res.status(404).json({ error: 'playlist not found' });

    await removeSongFromPlaylist(playlistId, songId);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
};

module.exports = { listSongs, addSong, removeSong };