// backend/src/models/genreModel.js
const db = require('../db');

const getAllGenresByUser = (user_id) =>
  db.query('SELECT * FROM Genre WHERE user_id = $1', [user_id])
    .then(r => r.rows);

const getGenreByIdAndUser = (id, user_id) =>
  db.query('SELECT * FROM Genre WHERE genre_id = $1 AND user_id = $2', [id, user_id])
    .then(r => r.rows[0]);

const createGenre = ({ name, user_id }) =>
  db.query(
    // drop genre_id entirely here—Postgres will fill it via DEFAULT nextval(...)
    `INSERT INTO genre (name, user_id)
      VALUES ($1, $2)
      RETURNING *`,
    [name, user_id]
  )
  .then(r => r.rows[0]);

const updateGenreByUser = async (id, user_id, { name }) => {
  const g = await getGenreByIdAndUser(id, user_id);
  if (!g) return null;
  return db.query(
    'UPDATE Genre SET name = $1 WHERE genre_id = $2 AND user_id = $3 RETURNING *',
    [name, id, user_id]
  ).then(r => r.rows[0]);
};

const deleteGenreByUser = (id, user_id) =>
  db.query(
    'DELETE FROM Genre WHERE genre_id = $1 AND user_id = $2',
    [id, user_id]
  );

module.exports = {
  getAllGenresByUser,
  getGenreByIdAndUser,
  createGenre,
  updateGenreByUser,
  deleteGenreByUser
};
