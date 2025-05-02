// backend/src/models/albumModel.js
const db = require('../db');

const getAllAlbumsByUser = (user_id) =>
  db.query('SELECT * FROM Album WHERE user_id = $1', [user_id])
    .then(r => r.rows);

const getAlbumByIdAndUser = (id, user_id) =>
  db.query('SELECT * FROM Album WHERE album_id = $1 AND user_id = $2', [id, user_id])
    .then(r => r.rows[0]);

const createAlbum = ({ title, release_date, cover_image, artist_id, user_id }) =>
  db.query(
    `INSERT INTO Album
       (title, release_date, cover_image, artist_id, user_id)
     VALUES ($1,$2,$3,$4,$5) RETURNING *`,
    [title, release_date, cover_image, artist_id, user_id]
  ).then(r => r.rows[0]);

const updateAlbumByUser = async (id, user_id, fields) => {
  const existing = await getAlbumByIdAndUser(id, user_id);
  if (!existing) return null;
  const cols = [], vals = [];
  Object.entries(fields).forEach(([k, v], i) => {
    cols.push(`${k}=$${i+1}`);
    vals.push(v);
  });
  vals.push(id, user_id);
  const query = `UPDATE Album SET ${cols.join(',')} WHERE album_id=$${cols.length+1} AND user_id=$${cols.length+2} RETURNING *`;
  return db.query(query, vals).then(r => r.rows[0]);
};

const deleteAlbumByUser = (id, user_id) =>
  db.query('DELETE FROM Album WHERE album_id=$1 AND user_id=$2', [id, user_id]);

module.exports = {
  getAllAlbumsByUser,
  getAlbumByIdAndUser,
  createAlbum,
  updateAlbumByUser,
  deleteAlbumByUser
};
