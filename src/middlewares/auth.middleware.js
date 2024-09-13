import jwt from 'jsonwebtoken';

export const authMiddleware = (req, res, next) => {
  const token = req.headers['authorization'];

  if (!token) return res.status(401).json({ message: 'No token provided, authorization denied' });

  try {
    const decoded = jwt.verify(token.split(' ')[1], process.env.JWT_SECRET);  // Extract the token
    req.user = decoded;  // Add user ID to the request object
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};
