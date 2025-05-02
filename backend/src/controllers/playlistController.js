const {
  getAllPlaylistsByUser,
  getPlaylistByIdAndUser,
  createPlaylist,
  updatePlaylistByUser,
  deletePlaylistByUser
} = require('../models/playlistModel');

// List playlists owned by the logged-in user
const listPlaylists = async (req, res, next) => {
  try {
    const playlists = await getAllPlaylistsByUser(req.user.user_id);
    res.json(playlists);
  } catch (err) {
    next(err);
  }
};

// Get a specific playlist only if owned by the user
const getPlaylist = async (req, res, next) => {
  try {
    const p = await getPlaylistByIdAndUser(req.params.id, req.user.user_id);
    if (!p) return res.status(404).json({ error: 'playlist not found' });
    res.json(p);
  } catch (err) {
    next(err);
  }
};

// Add a new playlist for the logged-in user
const addPlaylist = async (req, res, next) => {
  try {
    const { title, cover_image, date_created } = req.body;
    if (!title) return res.status(400).json({ error: 'title is required' });
    const p = await createPlaylist({
      title,
      cover_image: cover_image || null,
      date_created: date_created || new Date(),
      user_id: req.user.user_id
    });
    res.status(201).json(p);
  } catch (err) {
    next(err);
  }
};

// Edit a playlist only if it belongs to the logged-in user
const editPlaylist = async (req, res, next) => {
  try {
    if (Object.keys(req.body).length === 0)
      return res.status(400).json({ error: 'no fields to update' });
    const updated = await updatePlaylistByUser(
      req.params.id,
      req.user.user_id,
      req.body
    );
    if (!updated) return res.status(404).json({ error: 'playlist not found' });
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

// Delete a playlist only if owned by the logged-in user
const removePlaylist = async (req, res, next) => {
  try {
    await deletePlaylistByUser(req.params.id, req.user.user_id);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
};

module.exports = {
  listPlaylists,
  getPlaylist,
  addPlaylist,
  editPlaylist,
  removePlaylist
};