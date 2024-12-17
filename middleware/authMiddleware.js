const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', ''); // Strip 'Bearer ' prefix
  if (!token) return res.status(401).json({ message: 'Access Denied' });

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Token verified:', verified);  // Log decoded token
    req.user = verified;
    next();
  } catch (err) {
    console.log('Token verification failed:', err);  // Log error
    console.log('Received Token:', token);  // Log the token for debugging
    res.status(400).json({ message: 'Invalid Token, please log in again!' });
  }
};
