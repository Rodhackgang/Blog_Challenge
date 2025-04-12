const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ message: 'Accès refusé. Veuillez vous connecter.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;  
    next();
  } catch (error) {
    res.status(400).json({ message: 'Token invalide' });
  }
};

module.exports = authMiddleware;
