// backend/src/controllers/genreController.js
const {
  getAllGenresByUser,
  getGenreByIdAndUser,
  createGenre,
  updateGenreByUser,
  deleteGenreByUser
} = require('../models/genreModel');

const { getSongsByGenreUser } = require('../models/songModel');

const listGenres = async (req, res, next) => {
  try {
    const rows = await getAllGenresByUser(req.user.user_id);
    res.json(rows);
  } catch (err) {
    next(err);
  }
};

const getGenre = async (req, res, next) => {
  try {
    const g = await getGenreByIdAndUser(req.params.id, req.user.user_id);
    if (!g) return res.status(404).json({ error: 'genre not found' });
    res.json(g);
  } catch (err) {
    next(err);
  }
};

const addGenre = async (req, res, next) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: 'name is required' });
    const newGenre = await createGenre({ name, user_id: req.user.user_id });
    res.status(201).json(newGenre);
  } catch (err) {
    next(err);
  }
};

const editGenre = async (req, res, next) => {
  try {
    const updated = await updateGenreByUser(req.params.id, req.user.user_id, req.body);
    if (!updated) return res.status(404).json({ error: 'genre not found' });
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

const removeGenre = async (req, res, next) => {
  try {
    await deleteGenreByUser(req.params.id, req.user.user_id);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
};

/**
 * List songs for this genre (scoped to the logged-in user).
 */
const listGenreSongs = async (req, res, next) => {
  try {
    const genreId = Number(req.params.id);
    const genre = await getGenreByIdAndUser(genreId, req.user.user_id);
    if (!genre) return res.status(404).json({ error: 'genre not found' });

    const songs = await getSongsByGenreUser(genreId, req.user.user_id);
    res.json(songs);
  } catch (err) {
    next(err);
  }
};

module.exports = { listGenres, getGenre, addGenre, editGenre, removeGenre, listGenreSongs };
