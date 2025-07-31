const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
    req.user = decoded;
    next();
  } catch (err) {
    console.error('Auth middleware error:', {
      message: err.message,
      stack: err.stack,
      timestamp: new Date().toISOString(),
    });
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};

module.exports = authMiddleware;