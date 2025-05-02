const db = require('../db');

async function createUser({ username, password }) {
  const result = await db.query(
    `INSERT INTO Users (username, password)
     VALUES ($1, $2)
     RETURNING user_id, username`,
    [username, password]
  );
  return result.rows[0];
}

async function getUserByUsername(username) {
  const result = await db.query(
    `SELECT * FROM Users WHERE username = $1`,
    [username]
  );
  return result.rows[0];
}

module.exports = { createUser, getUserByUsername };
