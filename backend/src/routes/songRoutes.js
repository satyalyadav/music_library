const router = require('express').Router();
const auth = require('../middleware/auth');
const {
  listSongs,
  getSong,
  addSong,
  editSong,
  removeSong
} = require('../controllers/songController');

// All /songs routes require authentication
router.use(auth);

router.get('/', listSongs);
router.get('/:id', getSong);
router.post('/', addSong);
router.put('/:id', editSong);
router.delete('/:id', removeSong);

module.exports = router;