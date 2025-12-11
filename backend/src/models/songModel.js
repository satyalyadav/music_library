const db = require('../db');

/**
 * Fetch all songs owned by a given user.
 * @param {number} user_id
 */
const getSongsByUser = (user_id) =>
  db.query(
    `SELECT 
      s.*,
      a.name AS artist_name,
      al.title AS album_title
    FROM song s
    LEFT JOIN artist a ON s.artist_id = a.artist_id
    LEFT JOIN album al ON s.album_id = al.album_id
    WHERE s.user_id = $1`,
    [user_id]
  )
    .then(r => r.rows);

/**
 * Fetch a single song by its ID and owner.
 * @param {number} id
 * @param {number} user_id
 */
const getSongByIdAndUser = (id, user_id) =>
  db.query('SELECT * FROM song WHERE song_id = $1 AND user_id = $2', [id, user_id])
    .then(r => r.rows[0]);

/**
 * Create a new song record with owner.
 * @param {object} songData
 * @param {string} songData.title
 * @param {number} songData.artist_id
 * @param {number|null} songData.album_id
 * @param {number} songData.genre_id
 * @param {string} songData.duration
 * @param {string} songData.file_path
 * @param {string|null} songData.cover_image
 * @param {number} songData.user_id
 */
const createSong = ({ title, artist_id, album_id, genre_id, duration, file_path, cover_image, user_id }) =>
  db.query(
    `INSERT INTO song
     (title, artist_id, album_id, genre_id, duration, file_path, cover_image, user_id)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
     RETURNING *`,
    [title, artist_id, album_id, genre_id, duration, file_path, cover_image || null, user_id]
  ).then(r => r.rows[0]);

/**
 * Update a song record if owned by the user.
 * @param {number} id
 * @param {number} user_id
 * @param {object} fields - fields to update
 */
const updateSongByUser = async (id, user_id, fields) => {
  // Verify ownership and existence
  const existing = await getSongByIdAndUser(id, user_id);
  if (!existing) return null;

  const cols = [];
  const vals = [];
  let idx = 1;
  Object.entries(fields).forEach(([k, v]) => {
    cols.push(`${k}=$${idx++}`);
    vals.push(v);
  });
  vals.push(id, user_id);

  const query = `UPDATE song SET ${cols.join(',')} WHERE song_id=$${idx++} AND user_id=$${idx} RETURNING *`;
  return db.query(query, vals).then(r => r.rows[0]);
};

/**
 * Delete a song by ID if owned by the user.
 * @param {number} id
 * @param {number} user_id
 */
const deleteSongByUser = async (id, user_id) => {
  // Delete only if the song belongs to the user
  return db.query(
    `DELETE FROM song WHERE song_id=$1 AND user_id=$2`,
    [id, user_id]
  );
};

function getSongsByAlbumUser(albumId, userId) {
  return db
    .query(
      `SELECT * 
         FROM song
        WHERE album_id = $1
          AND user_id = $2
      `,
      [albumId, userId]
    )
    .then(r => r.rows);
}

/**
 * Get all songs by a given artist for a given user.
 */
function getSongsByArtistUser(artistId, userId) {
  return db
    .query(
      `SELECT * 
         FROM song
        WHERE artist_id = $1
          AND user_id = $2`,
      [artistId, userId]
    )
    .then(r => r.rows);
}

/**
 * Get all songs in a given genre for a given user.
 */
function getSongsByGenreUser(genreId, userId) {
  return db
    .query(
      `SELECT * 
         FROM song
        WHERE genre_id = $1
          AND user_id = $2`,
      [genreId, userId]
    )
    .then(r => r.rows);
}

module.exports = {
  getSongsByUser,
  getSongByIdAndUser,
  createSong,
  updateSongByUser,
  deleteSongByUser,
  getSongsByAlbumUser,
  getSongsByArtistUser,
  getSongsByGenreUser
};
