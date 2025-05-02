// backend/src/controllers/albumController.js
const {
  getAllAlbumsByUser,
  getAlbumByIdAndUser,
  createAlbum,
  updateAlbumByUser,
  deleteAlbumByUser
} = require('../models/albumModel');

const { getSongsByAlbumUser } = require('../models/songModel');

const listAlbums = async (req, res, next) => {
  try {
    const rows = await getAllAlbumsByUser(req.user.user_id);
    res.json(rows);
  } catch (err) {
    next(err);
  }
};

const getAlbum = async (req, res, next) => {
  try {
    const a = await getAlbumByIdAndUser(req.params.id, req.user.user_id);
    if (!a) return res.status(404).json({ error: 'album not found' });
    res.json(a);
  } catch (err) {
    next(err);
  }
};

const addAlbum = async (req, res, next) => {
  try {
    const { title, release_date, cover_image, artist_id } = req.body;
    if (!title || !artist_id)
      return res.status(400).json({ error: 'title and artist_id are required' });
    const a = await createAlbum({
      title,
      release_date,
      cover_image,
      artist_id,
      user_id: req.user.user_id
    });
    res.status(201).json(a);
  } catch (err) {
    next(err);
  }
};

const editAlbum = async (req, res, next) => {
  try {
    if (Object.keys(req.body).length === 0)
      return res.status(400).json({ error: 'no fields to update' });
    const a = await updateAlbumByUser(req.params.id, req.user.user_id, req.body);
    if (!a) return res.status(404).json({ error: 'album not found' });
    res.json(a);
  } catch (err) {
    next(err);
  }
};

const removeAlbum = async (req, res, next) => {
  try {
    await deleteAlbumByUser(req.params.id, req.user.user_id);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
};

const listAlbumSongs = async (req, res, next) => {
  try {
    const albumId = Number(req.params.id);
    // verify album belongs to user
    const album = await getAlbumByIdAndUser(albumId, req.user.user_id);
    if (!album) return res.status(404).json({ error: 'album not found' });
    // fetch and return songs
    const songs = await getSongsByAlbumUser(albumId, req.user.user_id);
    res.json(songs);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  listAlbums,
  getAlbum,
  addAlbum,
  editAlbum,
  removeAlbum,
  listAlbumSongs
};
