const db = require('../db');

/**
 * Get all playlists owned by a given user.
 * @param {number} user_id
 */
const getAllPlaylistsByUser = (user_id) =>
  db.query('SELECT * FROM playlist WHERE user_id = $1', [user_id])
    .then(r => r.rows);

/**
 * Get a specific playlist by ID and owner.
 * @param {number} id
 * @param {number} user_id
 */
const getPlaylistByIdAndUser = (id, user_id) =>
  db.query('SELECT * FROM playlist WHERE playlist_id = $1 AND user_id = $2', [id, user_id])
    .then(r => r.rows[0]);

/**
 * Create a new playlist.
 */
const createPlaylist = ({ title, cover_image, date_created, user_id }) =>
  db.query(
    `INSERT INTO playlist (title, cover_image, date_created, user_id)
     VALUES ($1,$2,$3,$4) RETURNING *`,
    [title, cover_image, date_created, user_id]
  )
  .then(r => r.rows[0]);

/**
 * Update a playlist by ID and owner.
 */
const updatePlaylistByUser = async (id, user_id, fields) => {
  const existing = await getPlaylistByIdAndUser(id, user_id);
  if (!existing) return null;

  const cols = [];
  const vals = [];
  let idx = 1;
  Object.entries(fields).forEach(([k, v]) => {
    cols.push(`${k}=$${idx++}`);
    vals.push(v);
  });
  vals.push(id, user_id);

  const query = `UPDATE playlist SET ${cols.join(',')} WHERE playlist_id=$${idx++} AND user_id=$${idx} RETURNING *`;
  return db.query(query, vals).then(r => r.rows[0]);
};

/**
 * Delete a playlist by ID and owner.
 */
const deletePlaylistByUser = (id, user_id) =>
  db.query(
    'DELETE FROM playlist WHERE playlist_id=$1 AND user_id=$2',
    [id, user_id]
  );

module.exports = {
  getAllPlaylistsByUser,
  getPlaylistByIdAndUser,
  createPlaylist,
  updatePlaylistByUser,
  deletePlaylistByUser
};