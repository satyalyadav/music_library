// backend/src/models/artistModel.js
const db = require('../db');

const getAllArtistsByUser = (user_id) =>
  db.query(
    'SELECT * FROM artist WHERE user_id = $1',
    [user_id]
  ).then(r => r.rows);

const getArtistByIdAndUser = (id, user_id) =>
  db.query(
    'SELECT * FROM artist WHERE artist_id = $1 AND user_id = $2',
    [id, user_id]
  ).then(r => r.rows[0]);

const createArtist = ({ name, user_id }) =>
  db.query(
    'INSERT INTO artist (name, user_id) VALUES ($1, $2) RETURNING *',
    [name, user_id]
  ).then(r => r.rows[0]);

const updateArtistByUser = async (id, user_id, { name }) => {
  const existing = await getArtistByIdAndUser(id, user_id);
  if (!existing) return null;
  return db.query(
    'UPDATE artist SET name = $1 WHERE artist_id = $2 AND user_id = $3 RETURNING *',
    [name, id, user_id]
  ).then(r => r.rows[0]);
};

const deleteArtistByUser = (id, user_id) =>
  db.query(
    'DELETE FROM artist WHERE artist_id = $1 AND user_id = $2',
    [id, user_id]
  );

module.exports = {
  getAllArtistsByUser,
  getArtistByIdAndUser,
  createArtist,
  updateArtistByUser,
  deleteArtistByUser
};
