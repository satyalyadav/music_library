// backend/src/controllers/artistController.js
const {
  getAllArtistsByUser,
  getArtistByIdAndUser,
  createArtist,
  updateArtistByUser,
  deleteArtistByUser
} = require('../models/artistModel');

const { getSongsByArtistUser } = require('../models/songModel');

const listArtists = async (req, res, next) => {
  try {
    const rows = await getAllArtistsByUser(req.user.user_id);
    res.json(rows);
  } catch (err) {
    next(err);
  }
};

const getArtist = async (req, res, next) => {
  try {
    const art = await getArtistByIdAndUser(req.params.id, req.user.user_id);
    if (!art) return res.status(404).json({ error: 'artist not found' });
    res.json(art);
  } catch (err) {
    next(err);
  }
};

const addArtist = async (req, res, next) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: 'name required' });
    const art = await createArtist({ name, user_id: req.user.user_id });
    res.status(201).json(art);
  } catch (err) {
    next(err);
  }
};

const editArtist = async (req, res, next) => {
  try {
    const updated = await updateArtistByUser(req.params.id, req.user.user_id, req.body);
    if (!updated) return res.status(404).json({ error: 'artist not found' });
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

const removeArtist = async (req, res, next) => {
  try {
    await deleteArtistByUser(req.params.id, req.user.user_id);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
};

/**
 * List songs for this artist (scoped to the logged-in user).
 */
const listArtistSongs = async (req, res, next) => {
  try {
    const artistId = Number(req.params.id);
    // ensure artist belongs to user
    const artist = await getArtistByIdAndUser(artistId, req.user.user_id);
    if (!artist) return res.status(404).json({ error: 'artist not found' });

    const songs = await getSongsByArtistUser(artistId, req.user.user_id);
    res.json(songs);
  } catch (err) {
    next(err);
  }
};

module.exports = { listArtists, getArtist, addArtist, editArtist, removeArtist, listArtistSongs };
