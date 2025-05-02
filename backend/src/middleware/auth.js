const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = function auth(req, res, next) {
  const hdr = req.headers.authorization;
  if (!hdr || !hdr.startsWith('Bearer '))
    return res.status(401).json({ error: 'missing token' });

  const token = hdr.slice(7);
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload;    // { user_id, username, iat, exp }
    next();
  } catch {
    res.status(401).json({ error: 'invalid token' });
  }
};
