const router = require('express').Router();
const auth = require('../middleware/auth');
const {
  listPlaylists,
  getPlaylist,
  addPlaylist,
  editPlaylist,
  removePlaylist
} = require('../controllers/playlistController');
const {
  listSongs,
  addSong,
  removeSong
} = require('../controllers/playlistSongController');

// All playlist endpoints require authentication
router.use(auth);

// Playlist CRUD
router.get('/',                   listPlaylists);
router.get('/:id',                getPlaylist);
router.post('/',                  addPlaylist);
router.put('/:id',                editPlaylist);
router.delete('/:id',             removePlaylist);

// Songs in playlist
router.get('/:id/songs',          listSongs);
router.post('/:id/songs',         addSong);
router.delete('/:id/songs/:songId', removeSong);

module.exports = router;