// backend/src/routes/genreRoutes.js
const router = require('express').Router();
const auth = require('../middleware/auth');
const {
  listGenres,
  getGenre,
  addGenre,
  editGenre,
  removeGenre,
  listGenreSongs
} = require('../controllers/genreController');

router.use(auth);

router.get('/', listGenres);
router.get('/:id', getGenre);
router.get('/:id/songs', listGenreSongs);
router.post('/', addGenre);
router.put('/:id', editGenre);
router.delete('/:id', removeGenre);

module.exports = router;
