const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
  const authHeader = req.header("Authorization");
  if (!authHeader) return res.status(401).json("Access denied");
  
  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.JWT_SECRET_KEY, (error, decoded) => {
    if (error) {
      return res.status(403).json("Invalid token");
    }
    req.user = decoded;
    next();
  });
};

const admin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json("Admin rights required");
  }
  next();
};

module.exports = { authenticate, admin };
