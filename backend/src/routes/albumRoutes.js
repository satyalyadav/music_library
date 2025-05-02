// backend/src/routes/albumRoutes.js
const router = require('express').Router();
const auth = require('../middleware/auth');
const {
  listAlbums,
  getAlbum,
  addAlbum,
  editAlbum,
  removeAlbum,
  listAlbumSongs
} = require('../controllers/albumController');

router.use(auth);

router.get('/',        listAlbums);
router.get('/:id',     getAlbum);
router.get('/:id/songs', listAlbumSongs);

router.post('/',       addAlbum);
router.put('/:id',     editAlbum);
router.delete('/:id',  removeAlbum);

module.exports = router;
