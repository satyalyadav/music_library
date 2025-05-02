// backend/src/routes/artistRoutes.js
const router = require('express').Router();
const auth = require('../middleware/auth');
const {
  listArtists,
  getArtist,
  addArtist,
  editArtist,
  removeArtist,
  listArtistSongs
} = require('../controllers/artistController');

router.use(auth);

router.get('/',    listArtists);
router.get('/:id', getArtist);
router.get('/:id/songs', listArtistSongs);
router.post('/',   addArtist);
router.put('/:id', editArtist);
router.delete('/:id', removeArtist);

module.exports = router;
