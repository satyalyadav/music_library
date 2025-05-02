require('dotenv').config();
const path = require('path');
const cors = require('cors');
const express = require('express');
const multer = require('multer');

const app = express();

// 1) CORS + JSON
app.use(cors());
app.use(express.json());

// 2) Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// 3) Multer storage config
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, path.join(__dirname, '../uploads')),
  filename: (_req, file, cb) => {
    const unique = Date.now() + '-' + file.originalname;
    cb(null, unique);
  }
});
const upload = multer({ storage });

// 4) Import route modules
const authRoutes = require('./routes/authRoutes');
const artistRoutes = require('./routes/artistRoutes');
const genreRoutes = require('./routes/genreRoutes');
const albumRoutes = require('./routes/albumRoutes');
const songRoutes = require('./routes/songRoutes');
const playlistRoutes = require('./routes/playlistRoutes');

// 5) Import error handler
const errorHandler = require('./middleware/errorHandler');

// 6) Health check
app.get('/ping', (req, res) => {
  res.json({ message: 'pong' });
});

// 7) Auth endpoints
app.use('/auth', authRoutes);

// 8) CRUD endpoints for your entities
app.use('/artists', artistRoutes);
app.use('/genres', genreRoutes);
app.use('/albums', albumRoutes);

// 9) For /songs, use multer upload middleware
app.use('/songs', upload.single('audio'), songRoutes);

app.use('/playlists', playlistRoutes);

// 10) Global error handler (must come last)
app.use(errorHandler);

// 11) Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
